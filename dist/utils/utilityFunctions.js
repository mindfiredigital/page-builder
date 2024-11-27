//Function for toggling notification
export function showNotification(message) {
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
export function showDialogBox(message, onConfirm, onCancel) {
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
  dialog === null || dialog === void 0
    ? void 0
    : dialog.classList.remove('hidden');
  // Handle the 'Yes' button click
  yesButton === null || yesButton === void 0
    ? void 0
    : yesButton.addEventListener('click', () => {
        onConfirm(); // Execute the onConfirm function
        dialog === null || dialog === void 0
          ? void 0
          : dialog.classList.add('hidden'); // Hide the dialog after action
      });
  // Handle the 'No' button click
  noButton === null || noButton === void 0
    ? void 0
    : noButton.addEventListener('click', () => {
        onCancel(); // Execute the onCancel function
        dialog === null || dialog === void 0
          ? void 0
          : dialog.classList.add('hidden'); // Hide the dialog after action
      });
}
export function syntaxHighlightHTML(html) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(.*?)")/g, `<span class="string">$1</span>`) // String values
    .replace(/(\b[a-zA-Z-]+\b)(?==")/g, `<span class="attribute">$1</span>`) // Attributes
    .replace(/(&lt;\/?[a-zA-Z-]+&gt;)/g, `<span class="tag">$1</span>`); // Tags
}
export function syntaxHighlightCSS(css) {
  return css
    .replace(/([a-zA-Z-]+)(?=:)/g, `<span class="property">$1</span>`) // CSS properties
    .replace(/(:\s*[^;]+;)/g, `<span class="value">$1</span>`) // CSS values
    .replace(/({|})/g, `<span class="bracket">$1</span>`); // Braces
}
