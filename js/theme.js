const moonSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const sunSVG  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

function updateButton(dark) {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.innerHTML = dark ? sunSVG : moonSVG;
  btn.setAttribute("aria-label", dark ? "ライトモードに切り替え" : "ダークモードに切り替え");
}

export function initTheme() {
  // data-theme はフラッシュ防止のため <head> インラインスクリプトで設定済み
  // ここでは localStorage を再読みせず DOM 状態を使う（二重初期化を解消）
  const isDark = document.documentElement.dataset.theme === "dark";
  updateButton(isDark);

  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
    updateButton(dark);
  });
}
