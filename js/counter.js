export function initCounter() {
  let count = parseInt(localStorage.getItem("counter") ?? "0", 10);
  const countEl = document.getElementById("count");
  if (!countEl) return;

  const render = () => {
    countEl.textContent = count;
    localStorage.setItem("counter", String(count));
  };

  render();

  document.getElementById("inc")?.addEventListener("click",   () => { count++; render(); });
  document.getElementById("dec")?.addEventListener("click",   () => { count--; render(); });
  document.getElementById("reset")?.addEventListener("click", () => { count = 0; render(); });
}
