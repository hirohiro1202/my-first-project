// フォーム送信先の設定 (Formspree)
// 使用方法:
//   1. https://formspree.io でアカウントを作成する
//   2. 新しいフォームを作成してフォームIDを取得する
//   3. 下記を更新する: "https://formspree.io/f/YOUR_FORM_ID"
const FORM_ENDPOINT = "";

export function initForm() {
  const form   = document.getElementById("contact-form");
  const result = document.getElementById("form-result");
  if (!form || !result) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!FORM_ENDPOINT) {
      result.textContent = "フォームの送信先が設定されていません。";
      result.className = "form-result error";
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "送信中…";
    result.textContent = "";
    result.className = "form-result";

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method:  "POST",
        body:    new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        result.textContent = "送信しました！ありがとうございます。";
        result.className = "form-result success";
        form.reset();
      } else {
        result.textContent = "送信に失敗しました。しばらくしてから再試行してください。";
        result.className = "form-result error";
      }
    } catch {
      result.textContent = "ネットワークエラーが発生しました。";
      result.className = "form-result error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "送信";
    }
  });
}
