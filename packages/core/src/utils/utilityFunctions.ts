/** Function for toggling notification */
export function showNotification(message: string): void {
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
export function showDialogBox(
  message: string,
  onConfirm: () => void,
  onCancel: () => void
): void {
  const dialog = document.getElementById('dialog');
  const yesButton = document.getElementById('dialog-yes');
  const noButton = document.getElementById('dialog-no');

  const messageElement = document.getElementById('dialog-message');
  if (messageElement) {
    messageElement.innerHTML = message;
  }

  dialog?.classList.remove('hidden');

  yesButton?.addEventListener('click', () => {
    onConfirm();
    dialog?.classList.add('hidden');
  });

  noButton?.addEventListener('click', () => {
    onCancel();
    dialog?.classList.add('hidden');
  });
}

export function syntaxHighlightHTML(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /\s([a-zA-Z-]+)="(.*?)"/g,
      (_match, attr: string, value: string) =>
        ` ${attr}=<span class="attribute">"</span><span class="string">${value}</span><span class="attribute">"</span>`
    )
    .replace(/(&lt;\/?[a-zA-Z-]+&gt;)/g, `<span class="tag">$1</span>`);
}

export function syntaxHighlightCSS(css: string): string {
  return css
    .replace(/([a-zA-Z-]+)(?=:)/g, `<span class="property">$1</span>`)
    .replace(/(:\s*[^;]+;)/g, `<span class="value">$1</span>`)
    .replace(/({|})/g, `<span class="bracket">$1</span>`);
}

/** Generic debounce — the callback type is preserved through the overload */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>): void => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
