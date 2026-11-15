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

// お問い合わせフォーム(送信はせず、画面上に結果を表示するだけ)
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  document.getElementById("form-result").textContent =
    `${name} さん、ありがとうございます!(これはデモのため、実際には送信されません)`;
  e.target.reset();
});
