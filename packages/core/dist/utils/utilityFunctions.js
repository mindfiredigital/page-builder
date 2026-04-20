/** Function for toggling notification */
export function showNotification(message) {
  const notification = document.getElementById('notification');
  if (notification) {
    notification.innerHTML = message;
    notification.classList.add('visible');
    notification.classList.remove('hidden');
    /** Hide the notification after 2 seconds */
    setTimeout(() => {
      notification.classList.remove('visible');
      notification.classList.add('hidden');
    }, 2000);
  }
}
/** Function for handling dialog box, where confirmation and cancellation functions are passed as parameters */
export function showDialogBox(message, onConfirm, onCancel) {
  const dialog = document.getElementById('dialog');
  const yesButton = document.getElementById('dialog-yes');
  const noButton = document.getElementById('dialog-no');
  const messageElement = document.getElementById('dialog-message');
  if (messageElement) {
    messageElement.innerHTML = message;
  }
  dialog === null || dialog === void 0
    ? void 0
    : dialog.classList.remove('hidden');
  yesButton === null || yesButton === void 0
    ? void 0
    : yesButton.addEventListener('click', () => {
        onConfirm();
        dialog === null || dialog === void 0
          ? void 0
          : dialog.classList.add('hidden');
      });
  noButton === null || noButton === void 0
    ? void 0
    : noButton.addEventListener('click', () => {
        onCancel();
        dialog === null || dialog === void 0
          ? void 0
          : dialog.classList.add('hidden');
      });
}
export function syntaxHighlightHTML(html) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /\s([a-zA-Z-]+)="(.*?)"/g,
      (_match, attr, value) =>
        ` ${attr}=<span class="attribute">"</span><span class="string">${value}</span><span class="attribute">"</span>`
    )
    .replace(/(&lt;\/?[a-zA-Z-]+&gt;)/g, `<span class="tag">$1</span>`);
}
export function syntaxHighlightCSS(css) {
  return css
    .replace(/([a-zA-Z-]+)(?=:)/g, `<span class="property">$1</span>`)
    .replace(/(:\s*[^;]+;)/g, `<span class="value">$1</span>`)
    .replace(/({|})/g, `<span class="bracket">$1</span>`);
}
/** Generic debounce — the callback type is preserved through the overload */
export function debounce(func, delay) {
  let timeoutId = null;
  return (...args) => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
