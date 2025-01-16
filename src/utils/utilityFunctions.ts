//Function for toggling notification
export function showNotification(message: string) {
  const notification = document.getElementById('notification');
  if (notification) {
    notification.innerHTML = message;
    notification.classList.add('visible');
    notification.classList.remove('hidden');

    // Hide the notification after 2 seconds
    setTimeout(() => {
      notification.classList.remove('visible');
      notification.classList.add('hidden');
    }, 2000);
  }
}

//Function for handling dialog box, where confirmation and cancellation functions are passed as parameters
export function showDialogBox(
  message: string,
  onConfirm: () => void,
  onCancel: () => void
) {
  // Get the dialog and buttons from the DOM
  const dialog = document.getElementById('dialog');
  const yesButton = document.getElementById('dialog-yes');
  const noButton = document.getElementById('dialog-no');

  // Set the dialog message
  const messageElement = document.getElementById('dialog-message');
  if (messageElement) {
    messageElement.innerHTML = message;
  }

  // Show the dialog by removing the 'hidden' class
  dialog?.classList.remove('hidden');

  // Handle the 'Yes' button click
  yesButton?.addEventListener('click', () => {
    onConfirm(); // Execute the onConfirm function
    dialog?.classList.add('hidden'); // Hide the dialog after action
  });

  // Handle the 'No' button click
  noButton?.addEventListener('click', () => {
    onCancel(); // Execute the onCancel function
    dialog?.classList.add('hidden'); // Hide the dialog after action
  });
}
export function syntaxHighlightHTML(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /\s([a-zA-Z-]+)="(.*?)"/g,
      (match, attr, value) =>
        ` ${attr}=<span class="attribute">"</span><span class="string">${value}</span><span class="attribute">"</span>`
    )
    .replace(/(&lt;\/?[a-zA-Z-]+&gt;)/g, `<span class="tag">$1</span>`);
}

export function syntaxHighlightCSS(css: string): string {
  return css
    .replace(/([a-zA-Z-]+)(?=:)/g, `<span class="property">$1</span>`) // CSS properties
    .replace(/(:\s*[^;]+;)/g, `<span class="value">$1</span>`) // CSS values
    .replace(/({|})/g, `<span class="bracket">$1</span>`); // Braces
}

export function debounce(func: Function, delay: number) {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
