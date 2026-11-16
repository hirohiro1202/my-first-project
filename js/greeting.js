export function initGreeting() {
  document.getElementById("greet-btn")?.addEventListener("click", () => {
    const hour = new Date().getHours();
    let message;
    if (hour < 5)       message = "こんばんは。夜更かしですね!";
    else if (hour < 11) message = "おはようございます!";
    else if (hour < 18) message = "こんにちは!";
    else                message = "こんばんは!";
    document.getElementById("greeting").textContent = message;
  });
}
