(() => {
  "use strict";
  const KEY = "expense-desk-v1";
  const $ = (id) => document.getElementById(id);
  const yen = (n) => new Intl.NumberFormat("ja-JP", {style:"currency",currency:"JPY",maximumFractionDigits:0}).format(Number(n)||0);
  const today = () => new Date().toLocaleDateString("sv-SE");
  const monthNow = () => today().slice(0,7);
  let state = loadState();
  let importRows = [];
  let toastTimer;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && Array.isArray(saved.expenses) && Array.isArray(saved.projects)) return saved;
    } catch {}
    return {projects:[], expenses:[], importedIds:[]};
  }
  function saveState() {
    localStorage.setItem(KEY, JSON.stringify(state));
    renderAll();
  }
  function uid() { return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)+Math.random().toString(36).slice(2); }
  function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function projectName(id) { return state.projects.find(p=>p.id===id)?.name || "案件未設定"; }
  function showToast(message) { $("toast").textContent=message; $("toast").classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2600); }
  function emptyRow(cols,text) { return `<tr><td colspan="${cols}" class="empty">${escapeHtml(text)}</td></tr>`; }
  function statusBadge(paid) { return paid ? '<span class="pill paid">精算済み</span>' : '<span class="pill unpaid">未精算</span>'; }
  function fillProjectSelects() {
    const opts = state.projects.map(p=>`<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)}</option>`).join("");
    $("expense-project").innerHTML='<option value="">案件未設定</option>'+opts;
    $("filter-project").innerHTML='<option value="">すべての案件</option>'+opts;
  }
  function renderDashboard() {
    const month = state.expenses.filter(e=>e.date?.startsWith(monthNow()));
    const unpaid = state.expenses.filter(e=>!e.paid);
    const todays = state.expenses.filter(e=>e.date===today());
    $("stat-month").textContent=yen(month.reduce((s,e)=>s+Number(e.amount),0));
    $("stat-month-count").textContent=month.length+"件の明細";
    $("stat-unpaid").textContent=yen(unpaid.reduce((s,e)=>s+Number(e.amount),0));
    $("stat-today").textContent=todays.length+"件";
    const recent=[...state.expenses].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6);
    $("recent-body").innerHTML=recent.length?recent.map(e=>`<tr><td>${escapeHtml(e.date)}</td><td>${escapeHtml(e.title)}</td><td>${escapeHtml(projectName(e.projectId))}</td><td class="amount">${yen(e.amount)}</td><td>${statusBadge(e.paid)}</td></tr>`).join(""):emptyRow(5,"まだ明細がありません。最初の1件を登録しましょう。");
    const totals=state.projects.map(p=>({p,total:state.expenses.filter(e=>e.projectId===p.id).reduce((s,e)=>s+Number(e.amount),0),count:state.expenses.filter(e=>e.projectId===p.id).length})).sort((a,b)=>b.total-a.total).slice(0,3);
    $("project-summary").innerHTML=totals.length?totals.map(x=>`<article class="project-mini"><strong>${escapeHtml(x.p.name)}</strong><span>${x.count}件の明細</span><b>${yen(x.total)}</b></article>`).join(""):'<div class="project-mini"><span>案件を登録すると、ここに集計が表示されます。</span></div>';
  }
  function filteredExpenses() {
    const q=$("search-expenses").value.trim().toLowerCase(), month=$("filter-month").value, project=$("filter-project").value, status=$("filter-status").value;
    return [...state.expenses].filter(e=>(!q||(e.title+" "+e.payee+" "+projectName(e.projectId)).toLowerCase().includes(q))&&(!month||e.date.startsWith(month))&&(!project||e.projectId===project)&&(!status||(status==="paid"?e.paid:!e.paid))).sort((a,b)=>b.date.localeCompare(a.date));
  }
  function renderExpenses() {
    const list=filteredExpenses();
    $("expenses-body").innerHTML=list.length?list.map(e=>`<tr><td>${escapeHtml(e.date)}</td><td>${escapeHtml(e.title)}${e.note?'<span class="sub">'+escapeHtml(e.note)+'</span>':''}</td><td>${escapeHtml(e.category)}</td><td>${escapeHtml(projectName(e.projectId))}</td><td>${escapeHtml(e.payee||"—")}</td><td class="amount">${yen(e.amount)}</td><td>${statusBadge(e.paid)}</td><td><button class="text-button" data-edit="${escapeHtml(e.id)}">編集</button> <button class="text-button" data-delete="${escapeHtml(e.id)}">削除</button></td></tr>`).join(""):emptyRow(8,"条件に合う明細がありません。");
    $("expense-count").textContent=list.length+"件 / 合計 "+yen(list.reduce((s,e)=>s+Number(e.amount),0));
  }
  function renderProjects() {
    $("projects-grid").innerHTML=state.projects.length?state.projects.map(p=>{
      const expenses=state.expenses.filter(e=>e.projectId===p.id),sum=expenses.reduce((s,e)=>s+Number(e.amount),0);
      return `<article class="project-card"><h3>${escapeHtml(p.name)}</h3><div class="client">${escapeHtml(p.client||"クライアント未設定")}</div><div class="project-total">${yen(sum)}</div><p>${expenses.length}件の立替明細</p><div class="project-meta"><span class="muted">${escapeHtml(p.note||"")}</span><button data-project-expenses="${escapeHtml(p.id)}">明細を見る →</button></div></article>`;
    }).join(""):'<div class="project-card"><p>まだ案件がありません。右上の「案件を追加」から登録してください。</p></div>';
  }
  function renderImport() {
    $("import-body").innerHTML=importRows.length?importRows.map((r,i)=>`<tr><td><input type="checkbox" data-import-check="${i}" ${r.selected?"checked":""}></td><td>${escapeHtml(r.date)}</td><td>${escapeHtml(r.title)}</td><td class="amount">${yen(r.amount)}</td><td><select data-import-project="${i}"><option value="">案件未設定</option>${state.projects.map(p=>`<option value="${escapeHtml(p.id)}" ${p.id===r.projectId?"selected":""}>${escapeHtml(p.name)}</option>`).join("")}</select></td></tr>`).join(""):emptyRow(5,"CSVを取り込むと、ここに履歴候補が表示されます。");
    $("register-selected").disabled=!importRows.some(r=>r.selected);
  }
  function renderAll(){fillProjectSelects();renderDashboard();renderExpenses();renderProjects();renderImport();}
  function switchView(name) {
    document.querySelectorAll(".view").forEach(v=>v.classList.toggle("hidden",v.id!=="view-"+name));
    document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
    const titles={dashboard:"ダッシュボード",expenses:"明細一覧",projects:"案件管理",import:"ICOCA履歴取込"};
    $("page-title").textContent=titles[name]||titles.dashboard;
  }
  function openExpense(expense=null, defaults={}) {
    $("expense-form").reset(); $("expense-id").value=expense?.id||"";
    $("expense-dialog-title").textContent=expense?"明細を編集":"明細を追加";
    $("expense-date").value=expense?.date||defaults.date||today();
    $("expense-amount").value=expense?.amount||defaults.amount||"";
    $("expense-title").value=expense?.title||defaults.title||"";
    $("expense-category").value=expense?.category||defaults.category||"交通費";
    $("expense-project").value=expense?.projectId||defaults.projectId||"";
    $("expense-payee").value=expense?.payee||defaults.payee||"";
    $("expense-note").value=expense?.note||defaults.note||"";
    $("expense-paid").checked=Boolean(expense?.paid);
    $("expense-dialog").showModal();
  }
  function parseCsv(text) {
    const rows=[];let row=[],cell="",quoted=false;
    text=text.replace(/^\uFEFF/,"");
    for(let i=0;i<text.length;i++){const c=text[i],next=text[i+1];if(c==='"'&&quoted&&next==='"'){cell+='"';i++;}else if(c==='"'){quoted=!quoted;}else if(c===","&&!quoted){row.push(cell);cell="";}else if((c==="\n"||c==="\r")&&!quoted){if(c==="\r"&&next==="\n")i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell="";}else cell+=c;}
    row.push(cell);if(row.some(x=>x.trim()))rows.push(row);return rows;
  }
  function normalizeDate(value) {
    const s=String(value||"").trim().replace(/[年月]/g,"/").replace("日","");
    const m=s.match(/(20\d{2})[./-](\d{1,2})[./-](\d{1,2})/);
    if(m)return m[1]+"-"+m[2].padStart(2,"0")+"-"+m[3].padStart(2,"0");
    const jp=s.match(/(\d{1,2})[./-](\d{1,2})/);if(jp)return new Date().getFullYear()+"-"+jp[1].padStart(2,"0")+"-"+jp[2].padStart(2,"0");
    return today();
  }
  function importCsv(text) {
    const rows=parseCsv(text);if(rows.length<2)throw new Error("CSVにデータ行がありません。");
    const headers=rows[0].map(x=>x.trim().toLowerCase());
    const find=(keys)=>headers.findIndex(h=>keys.some(k=>h.includes(k)));
    const dateCol=find(["利用日","日付","date","年月日"]),amountCol=find(["金額","利用額","支払額","amount"]),descCol=find(["利用内容","利用区間","内容","区間","駅","摘要","description","detail"]),outCol=find(["出場","降車","到着"]),inCol=find(["入場","乗車","出発"]);
    if(dateCol<0||amountCol<0)throw new Error("日付・金額の列を認識できません。CSVの見出しをご確認ください。");
    const known=new Set(state.importedIds);
    importRows=rows.slice(1).map(cols=>{
      const rawAmount=String(cols[amountCol]||"").replace(/[¥￥,円\s]/g,"");
      const amount=Math.abs(Number(rawAmount));if(!amount)return null;
      const date=normalizeDate(cols[dateCol]);
      const station=[cols[inCol],cols[outCol]].filter(Boolean).join(" → ");
      const title=String(cols[descCol]||station||"ICOCA利用履歴").trim();
      const key=[date,amount,title].join("|");
      return {id:key,date,amount,title,category:"交通費",payee:"ICOCA",projectId:"",selected:!known.has(key)};
    }).filter(Boolean);
    $("import-message").textContent=importRows.length+"件を読み込みました。案件を割り当てて登録できます。";
    renderImport();
  }
  function downloadCsv() {
    const list=filteredExpenses(),header=["日付","内容","経費区分","案件名","クライアント名","支払先","金額","精算状況","備考"];
    const rows=list.map(e=>[e.date,e.title,e.category,projectName(e.projectId),state.projects.find(p=>p.id===e.projectId)?.client||"",e.payee,e.amount,e.paid?"精算済み":"未精算",e.note]);
    const csv=[header,...rows].map(row=>row.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(",")).join("\r\n");
    const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="立替明細_"+( $("filter-month").value||monthNow())+".csv";a.click();URL.revokeObjectURL(url);
  }
  document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.view)));
  document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.goto)));
  $("quick-add").addEventListener("click",()=>openExpense());
  $("expense-form").addEventListener("submit",e=>{e.preventDefault();const id=$("expense-id").value,old=state.expenses.find(x=>x.id===id);const record={id:id||uid(),date:$("expense-date").value,amount:Number($("expense-amount").value),title:$("expense-title").value.trim(),category:$("expense-category").value,projectId:$("expense-project").value,payee:$("expense-payee").value.trim(),note:$("expense-note").value.trim(),paid:$("expense-paid").checked,createdAt:old?.createdAt||new Date().toISOString()};if(old)state.expenses=state.expenses.map(x=>x.id===id?record:x);else state.expenses.push(record);$("expense-dialog").close();saveState();showToast(old?"明細を更新しました":"明細を登録しました");});
  ["close-expense","cancel-expense"].forEach(id=>$(id).addEventListener("click",()=>$("expense-dialog").close()));
  $("expenses-body").addEventListener("click",e=>{const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");if(edit){openExpense(state.expenses.find(x=>x.id===edit.dataset.edit));}if(del&&confirm("この明細を削除しますか？")){state.expenses=state.expenses.filter(x=>x.id!==del.dataset.delete);saveState();showToast("明細を削除しました");}});
  ["search-expenses","filter-month","filter-project","filter-status"].forEach(id=>$(id).addEventListener("input",renderExpenses));
  $("export-csv").addEventListener("click",downloadCsv);
  $("add-project").addEventListener("click",()=>$("project-dialog").showModal());
  ["close-project","cancel-project"].forEach(id=>$(id).addEventListener("click",()=>$("project-dialog").close()));
  $("project-form").addEventListener("submit",e=>{e.preventDefault();state.projects.push({id:uid(),name:$("project-name").value.trim(),client:$("project-client").value.trim(),note:$("project-note").value.trim(),createdAt:new Date().toISOString()});$("project-dialog").close();saveState();showToast("案件を登録しました");});
  $("projects-grid").addEventListener("click",e=>{const b=e.target.closest("[data-project-expenses]");if(b){switchView("expenses");$("filter-project").value=b.dataset.projectExpenses;renderExpenses();}});
  $("icoca-file").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;try{importCsv(await file.text());showToast("履歴を読み込みました");}catch(err){$("import-message").textContent=err.message;showToast("CSVを読み込めませんでした");}});
  $("import-body").addEventListener("change",e=>{const c=e.target.closest("[data-import-check]"),p=e.target.closest("[data-import-project]");if(c)importRows[Number(c.dataset.importCheck)].selected=c.checked;if(p)importRows[Number(p.dataset.importProject)].projectId=p.value;renderImport();});
  $("select-all-import").addEventListener("change",e=>{importRows.forEach(r=>r.selected=e.target.checked);renderImport();});
  $("register-selected").addEventListener("click",()=>{const selected=importRows.filter(r=>r.selected);selected.forEach(r=>{state.expenses.push({id:uid(),date:r.date,amount:r.amount,title:r.title,category:r.category,projectId:r.projectId,payee:r.payee,note:"ICOCA CSVから取込",paid:false,createdAt:new Date().toISOString()});state.importedIds.push(r.id);});importRows=importRows.filter(r=>!r.selected);saveState();showToast(selected.length+"件を明細に登録しました");});
  $("today-label").textContent=new Date().toLocaleDateString("ja-JP",{year:"numeric",month:"long",day:"numeric",weekday:"long"});
  renderAll();
})();