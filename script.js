// あいさつボタン: 時間帯に合わせたメッセージを表示
document.getElementById("greet-btn").addEventListener("click", () => {
  const hour = new Date().getHours();
  let message;
  if (hour < 5) message = "こんばんは。夜更かしですね!";
  else if (hour < 11) message = "おはようございます!";
  else if (hour < 18) message = "こんにちは!";
  else message = "こんばんは!";
  document.getElementById("greeting").textContent = message;
});

// カウンター
let count = 0;
const countEl = document.getElementById("count");
const render = () => { countEl.textContent = count; };

document.getElementById("inc").addEventListener("click", () => { count++; render(); });
document.getElementById("dec").addEventListener("click", () => { count--; render(); });
document.getElementById("reset").addEventListener("click", () => { count = 0; render(); });

// テーマ切り替え
const moonSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const sunSVG  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

function applyTheme(dark) {
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  const btn = document.getElementById("theme-toggle");
  btn.innerHTML = dark ? sunSVG : moonSVG;
  btn.setAttribute("aria-label", dark ? "ライトモードに切り替え" : "ダークモードに切り替え");
}

(function () {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved ? saved === "dark" : prefersDark);
})();

document.getElementById("theme-toggle").addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme === "dark";
  localStorage.setItem("theme", isDark ? "light" : "dark");
  applyTheme(!isDark);
});

// お問い合わせフォーム(送信はせず、画面上に結果を表示するだけ)
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  document.getElementById("form-result").textContent =
    `${name} さん、ありがとうございます!(これはデモのため、実際には送信されません)`;
  e.target.reset();
});
