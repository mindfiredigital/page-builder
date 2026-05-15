/* Builds a single attribute input row (text / number / checkbox) with event-trigger wiring */
export function createAttributeControls(
  attribute: ComponentAttribute,
  functionsPanel: HTMLElement,
  handleInputTrigger: (event: Event) => void
): void {
  const box = document.createElement('div');
  box.className = 'attribute-input-container';

  /* Generate the correct input HTML for each supported input type */
  let inputHtml = '';

  switch (attribute.input_type) {
    case 'checkbox': {
      const isChecked = attribute.default_value === 'true';
      inputHtml = `
        <div class="attribute-input-wrapper checkbox-wrapper">
          <input
            type="checkbox"
            class="attribute-input"
            id="${attribute.key}"
            ${!attribute.editable ? 'disabled' : ''}
            ${isChecked ? 'checked' : ''}
          >
        </div>
      `;
      break;
    }

    case 'number':
      inputHtml = `
        <div class="attribute-input-wrapper">
          <input
            type="number"
            class="attribute-input"
            id="${attribute.key}"
            ${!attribute.editable ? 'disabled readonly' : ''}
            value="${attribute.default_value || ''}"
            placeholder="Enter ${attribute.title.toLowerCase()}..."
          >
        </div>
      `;
      break;

    case 'text':
    default:
      inputHtml = `
        <div class="attribute-input-wrapper">
          <input
            type="text"
            class="attribute-input"
            id="${attribute.key}"
            ${!attribute.editable ? 'disabled readonly' : ''}
            value="${attribute.default_value || ''}"
            placeholder="Enter ${attribute.title.toLowerCase()}..."
          >
        </div>
      `;
      break;
  }

  box.innerHTML = `
    <div class="attribute-header">
      <label for="${attribute.key}" class="attribute-label">${attribute.title}</label>
      ${!attribute.editable ? '<span class="readonly-badge">Read Only</span>' : ''}
    </div>
    ${inputHtml}
  `;

  functionsPanel.appendChild(box);

  const inputElement = document.getElementById(
    attribute.key
  ) as HTMLInputElement;

  /* Editable attributes get a trigger-event selector so users can choose when the handler fires */
  if (attribute.editable !== false) {
    const eventConfigurator = document.createElement('div');
    eventConfigurator.className = 'event-configurator';
    eventConfigurator.innerHTML = `
      <div class="event-trigger-section">
        <div class="trigger-header">
          <label class="trigger-label">Trigger Event:</label>
        </div>
        <div class="trigger-select-wrapper">
          <select class="event-selector" id="event-selector-${attribute.key}">
            <option value="input">On Input (Real-time)</option>
            <option value="change">On Change</option>
            <option value="blur">On Focus Lost</option>
            <option value="keyup">On Key Release</option>
            <option value="click">On Click</option>
          </select>
          <div class="select-arrow">▼</div>
        </div>
      </div>
    `;
    box.appendChild(eventConfigurator);

    const eventSelector = document.getElementById(
      `event-selector-${attribute.key}`
    ) as HTMLSelectElement;

    /* Remove all previous listeners then add the newly selected one */
    const setupListener = (eventToListen: string): void => {
      ['input', 'change', 'blur', 'keyup', 'click'].forEach(eventType => {
        inputElement.removeEventListener(eventType, handleInputTrigger);
      });
      inputElement.addEventListener(eventToListen, handleInputTrigger);
      box.setAttribute('data-trigger', eventToListen);
    };

    eventSelector.addEventListener('change', () => {
      const selectedEvent = eventSelector.value;
      setupListener(selectedEvent);

      /* Flash a visual hint when the trigger type changes */
      eventSelector.parentElement?.classList.add('trigger-changed');
      setTimeout(() => {
        eventSelector.parentElement?.classList.remove('trigger-changed');
      }, 300);
    });

    /* Default trigger is "input" for real-time feedback */
    const defaultTrigger = 'input';
    eventSelector.value = defaultTrigger;
    setupListener(defaultTrigger);

    /* Focus/blur classes let the container style the focused state */
    inputElement.addEventListener('focus', () =>
      box.classList.add('input-focused')
    );
    inputElement.addEventListener('blur', () =>
      box.classList.remove('input-focused')
    );
  }
}
