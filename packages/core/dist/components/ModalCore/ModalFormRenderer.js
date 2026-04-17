/* Clears and rebuilds the form inside the modal content container */
export function renderForm(contentContainer, attributes) {
  contentContainer.innerHTML = '';
  attributes.forEach(attr => {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'form-field';
    fieldContainer.setAttribute('data-attr-key', attr.key);
    /* Clicking any field selects it and deselects all others */
    fieldContainer.addEventListener('click', () => {
      contentContainer.querySelectorAll('.form-field').forEach(f => {
        f.classList.remove('selected');
      });
      fieldContainer.classList.add('selected');
    });
    /* Expandable header row — holds the arrow button + title/key text */
    const headerContainer = document.createElement('div');
    headerContainer.className = 'form-field-header';
    headerContainer.setAttribute('data-attr-id', attr.id);
    const expandButton = document.createElement('button');
    expandButton.className = 'expand-button';
    expandButton.type = 'button';
    expandButton.innerHTML = `
      <svg class="expand-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    `;
    const titleKeyContainer = document.createElement('div');
    titleKeyContainer.className = 'title-key-container';
    const title = document.createElement('span');
    title.className = 'form-title';
    title.textContent = `${attr.title}`;
    const key = document.createElement('span');
    key.className = 'form-key';
    key.textContent = `(${attr.key})(${attr.type})`;
    titleKeyContainer.appendChild(title);
    titleKeyContainer.appendChild(key);
    headerContainer.appendChild(expandButton);
    headerContainer.appendChild(titleKeyContainer);
    /* Value row — collapsed by default, revealed on expand */
    const valueContainer = document.createElement('div');
    valueContainer.className = 'form-value-container form-value-collapsed';
    const valueLabel = document.createElement('label');
    valueLabel.className = 'form-label';
    valueLabel.textContent = 'Value:';
    valueLabel.setAttribute('for', attr.id);
    /* Read-only display span showing the current attribute value */
    const displayValue = document.createElement('span');
    displayValue.id = attr.id;
    displayValue.textContent = attr.value ? attr.value.toString() : null;
    displayValue.className = 'form-display-value';
    valueContainer.appendChild(valueLabel);
    valueContainer.appendChild(displayValue);
    fieldContainer.appendChild(headerContainer);
    fieldContainer.appendChild(valueContainer);
    contentContainer.appendChild(fieldContainer);
    /* Wire the header click to expand/collapse this field's value row */
    headerContainer.addEventListener('click', () => {
      toggleFieldExpansion(attr.id, contentContainer);
    });
  });
}
/* Toggles the collapsed/expanded state of a single field's value container */
export function toggleFieldExpansion(attrId, modalRoot) {
  const headerContainer = modalRoot.querySelector(`[data-attr-id="${attrId}"]`);
  const valueContainer =
    headerContainer === null || headerContainer === void 0
      ? void 0
      : headerContainer.nextElementSibling;
  const expandIcon =
    headerContainer === null || headerContainer === void 0
      ? void 0
      : headerContainer.querySelector('.expand-icon');
  if (valueContainer && expandIcon) {
    /* Toggle direction: collapse if expanded, expand if collapsed */
    const isExpanded = !valueContainer.classList.contains(
      'form-value-collapsed'
    );
    if (isExpanded) {
      valueContainer.classList.add('form-value-collapsed');
      expandIcon.style.transform = 'rotate(0deg)';
    } else {
      valueContainer.classList.remove('form-value-collapsed');
      expandIcon.style.transform = 'rotate(90deg)';
    }
  }
}
/* Hides fields that don't match the query; shows those that do */
export function filterAttributes(query, contentContainer) {
  const normalizedQuery = query.toLowerCase().trim();
  contentContainer.querySelectorAll('.form-field').forEach(field => {
    var _a, _b, _c;
    const key =
      (_a = field.getAttribute('data-attr-key')) === null || _a === void 0
        ? void 0
        : _a.toLowerCase();
    const title =
      (_c =
        (_b = field.querySelector('.form-title')) === null || _b === void 0
          ? void 0
          : _b.textContent) === null || _c === void 0
        ? void 0
        : _c.toLowerCase();
    /* Show if either the key or title contains the search query */
    if (
      (key === null || key === void 0
        ? void 0
        : key.includes(normalizedQuery)) ||
      (title === null || title === void 0
        ? void 0
        : title.includes(normalizedQuery))
    ) {
      field.classList.remove('modal-hidden');
    } else {
      field.classList.add('modal-hidden');
    }
  });
}
