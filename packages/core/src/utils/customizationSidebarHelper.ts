import { TextComponent } from '../components/TextComponent';
import { HeaderComponent } from '../components/HeaderComponent';
import { TableComponent } from '../components/TableComponent';
import { Canvas } from '../canvas/Canvas';
import { ModalComponent } from '../components/ModalManager';
import { handleComponentClick } from './componentClickManager';
export class SidebarUtils {
  static createAttributeControls(
    attribute: ComponentAttribute,
    functionsPanel: HTMLElement,
    handleInputTrigger: (event: Event) => void
  ) {
    const box = document.createElement('div');
    box.className = 'attribute-input-container';

    let inputHtml = '';
    switch (attribute.input_type) {
      case 'checkbox':
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

      const setupListener = (eventToListen: string) => {
        const eventTypes = ['input', 'change', 'blur', 'keyup', 'click'];
        eventTypes.forEach(eventType => {
          inputElement.removeEventListener(eventType, handleInputTrigger);
        });
        inputElement.addEventListener(eventToListen, handleInputTrigger);
        box.setAttribute('data-trigger', eventToListen);
      };

      eventSelector.addEventListener('change', () => {
        const selectedEvent = eventSelector.value;
        setupListener(selectedEvent);
        eventSelector.parentElement?.classList.add('trigger-changed');
        setTimeout(() => {
          eventSelector.parentElement?.classList.remove('trigger-changed');
        }, 300);
      });

      const defaultTrigger = 'input';
      eventSelector.value = defaultTrigger;
      setupListener(defaultTrigger);

      inputElement.addEventListener('focus', () => {
        box.classList.add('input-focused');
      });

      inputElement.addEventListener('blur', () => {
        box.classList.remove('input-focused');
      });
    }
  }

  static populateModalButton(
    component: HTMLElement,
    functionsPanel: HTMLElement,
    editable: boolean | null
  ) {
    if (editable === false) return;

    const modalButton = document.createElement('button');
    modalButton.textContent = `Set ${component.classList[0].replace('-component', '')} Attribute`;
    modalButton.className = 'set-attribute-button';
    functionsPanel.appendChild(modalButton);

    modalButton.addEventListener('click', () => {
      const modalComponent = new ModalComponent();
      if (component.classList.contains('text-component')) {
        const textComponentInstance = new TextComponent();
        handleComponentClick(
          modalComponent,
          TextComponent.textAttributeConfig, // Access static property
          component,
          textComponentInstance.updateTextContent
        );
      } else if (component.classList.contains('header-component')) {
        const headerComponentInstance = new HeaderComponent();
        handleComponentClick(
          modalComponent,
          HeaderComponent.headerAttributeConfig, // Access static property
          component,
          headerComponentInstance.updateHeaderContent
        );
      } else if (component.classList.contains('table-cell-content')) {
        const tableComponentInstance = new TableComponent();
        const cell = component.closest('.table-cell');
        handleComponentClick(
          modalComponent,
          TableComponent.tableAttributeConfig, // Access static property
          cell as HTMLElement,
          tableComponentInstance.updateCellContent
        );
      }
    });
  }

  static rgbToHex(rgb: string): string {
    const result = rgb.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/
    );
    if (!result) return rgb;
    const r = parseInt(result[1], 10);
    const g = parseInt(result[2], 10);
    const b = parseInt(result[3], 10);

    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
  }

  static createControl(
    label: string,
    id: string,
    type: string,
    value: string | number,
    controlsContainer: HTMLElement,
    attributes: Record<string, string | number> = {}
  ) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('control-wrapper');

    const isNumber = type === 'number';

    if (isNumber && attributes.unit) {
      const unit = attributes.unit;
      wrapper.innerHTML = `
                <label for="${id}">${label}:</label>
                <div class="input-wrapper">
                  <input type="${type}" id="${id}" value="${value}">
                  <select id="${id}-unit">
                      <option value="px" ${unit === 'px' ? 'selected' : ''}>px</option>
                      <option value="rem" ${unit === 'rem' ? 'selected' : ''}>rem</option>
                      <option value="vh" ${unit === 'vh' ? 'selected' : ''}>vh</option>
                      <option value="%" ${unit === '%' ? 'selected' : ''}>%</option>
                  </select>
                </div>
            `;
    } else {
      wrapper.innerHTML = `
        <label for="${id}">${label}:</label>
        <div class="input-wrapper">
          <input type="color" id="${id}" value="${value}">
          <input type="text" id="${id}-value" style="font-size: 0.8rem; width: 200px; margin-left: 8px;" value="${value}">
        </div>
      `;
    }

    const input = wrapper.querySelector('input') as HTMLInputElement;
    const unitSelect = wrapper.querySelector(
      `#${id}-unit`
    ) as HTMLSelectElement;

    if (input) {
      Object.keys(attributes).forEach(key => {
        input.setAttribute(key, attributes[key].toString());
      });
    }

    const colorInput = wrapper.querySelector(
      `input[type="color"]#${id}`
    ) as HTMLInputElement;
    const hexInput = wrapper.querySelector(`#${id}-value`) as HTMLInputElement;

    if (colorInput) {
      colorInput.addEventListener('input', () => {
        if (hexInput) {
          hexInput.value = colorInput.value;
        }
      });
    }

    if (hexInput) {
      hexInput.addEventListener('input', () => {
        if (colorInput) {
          colorInput.value = hexInput.value;
        }
      });
    }

    controlsContainer.appendChild(wrapper);

    if (unitSelect) {
      unitSelect.addEventListener('change', () => {
        const unit = unitSelect.value;
        const currentValue = parseInt(input.value);
        input.value = `${currentValue}${unit}`;
      });
    }
  }

  static createSelectControl(
    label: string,
    id: string,
    currentValue: string,
    options: string[],
    controlsContainer: HTMLElement
  ) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('control-wrapper');
    const selectOptions = options
      .map(
        option =>
          `<option value="${option}" ${
            option === currentValue ? 'selected' : ''
          }>${option}</option>`
      )
      .join('');
    wrapper.innerHTML = `
                <label for="${id}">${label}:</label>
                <div class="input-wrapper">
                  <select id="${id}">${selectOptions}</select>
                </div>
            `;
    controlsContainer.appendChild(wrapper);
  }

  static populateRowVisibilityControls(
    row: HTMLElement,
    inputs: ComponentAttribute[]
  ) {
    const functionsPanel = document.getElementById('functions-panel')!;

    const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M5 12h14M12 5v14"/></svg>`;
    const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>`;

    functionsPanel.innerHTML = `
      <div id="visibility-rules-panel" class="rules-panel">
          <h4 class="panel-title">Row Visibility Rules</h4>
          
          <div id="rules-list" class="rules-list"></div>
          
          <div class="rule-builder-form">
              <h5 class="rule-builder-form-title">Add New Rule</h5>
              <select id="rule-input-key-select" class="form-row select"></select>
              
              <div class="form-row">
                  <select id="rule-operator-select">
                      <option value="equals">Equals</option>
                      <option value="not_equals">Not Equals</option>
                      <option value="greater_than">Greater Than</option>
                      <option value="less_than">Less Than</option>
                      <option value="contains">Contains</option>
                  </select>
                  <input type="text" id="rule-value-input" placeholder="Enter value">
              </div>
              
              <div class="form-row">
                  <select id="rule-action-select">
                      <option value="show">Show Row</option>
                      <option value="hide">Hide Row</option>
                  </select>
                  <button id="add-rule-btn" class="add-rule-btn">
                      ${addIcon}
                      <span>Add Rule</span>
                  </button>
              </div>
          </div>
      </div>
    `;

    const inputKeySelect = document.getElementById(
      'rule-input-key-select'
    ) as HTMLSelectElement;
    if (inputKeySelect) {
      if (inputs) {
        inputs.forEach(attr => {
          if (attr.type === 'Input') {
            const option = document.createElement('option');
            option.value = attr.key;
            option.textContent = attr.title;
            inputKeySelect.appendChild(option);
          }
        });
      }
    }

    const rulesList = document.getElementById('rules-list')!;
    const addRuleBtn = document.getElementById('add-rule-btn')!;
    const ruleValueInput = document.getElementById(
      'rule-value-input'
    ) as HTMLInputElement;
    const ruleOperatorSelect = document.getElementById(
      'rule-operator-select'
    ) as HTMLSelectElement;
    const ruleActionSelect = document.getElementById(
      'rule-action-select'
    ) as HTMLSelectElement;

    const renderRules = () => {
      rulesList.innerHTML = '';
      const rules = JSON.parse(
        row.getAttribute('data-visibility-rules') || '[]'
      );
      rules.forEach((rule: any, index: number) => {
        const ruleItem = document.createElement('div');
        ruleItem.className = 'rule-item';
        ruleItem.innerHTML = `
          <span class="rule-item-text">
              If <strong class="text-blue-600">${rule.inputKey}</strong> ${rule.operator} '<strong class="text-green-600">${rule.value}</strong>', then <strong class="text-purple-600">${rule.action}</strong>
          </span>
          <button class="delete-rule-btn">
              ${deleteIcon}
          </button>
        `;
        const deleteButton = ruleItem.querySelector(
          '.delete-rule-btn'
        ) as HTMLButtonElement;
        deleteButton.addEventListener('click', () => {
          this.deleteRule(row, index);
          renderRules();
          Canvas.dispatchDesignChange();
        });
        rulesList.appendChild(ruleItem);
      });
    };

    addRuleBtn.addEventListener('click', () => {
      const newRule = {
        inputKey: inputKeySelect.value,
        operator: ruleOperatorSelect.value,
        value: ruleValueInput.value,
        action: ruleActionSelect.value,
      };
      this.addRule(row, newRule);
      renderRules();
      Canvas.dispatchDesignChange();
    });

    renderRules();
  }

  private static addRule(row: HTMLElement, rule: any) {
    try {
      const existingRules = JSON.parse(
        row.getAttribute('data-visibility-rules') || '[]'
      );
      existingRules.push(rule);
      row.setAttribute('data-visibility-rules', JSON.stringify(existingRules));
    } catch (e) {
      console.error('Failed to add rule:', e);
    }
  }

  private static deleteRule(row: HTMLElement, index: number) {
    try {
      const existingRules = JSON.parse(
        row.getAttribute('data-visibility-rules') || '[]'
      );
      existingRules.splice(index, 1);
      row.setAttribute('data-visibility-rules', JSON.stringify(existingRules));
    } catch (e) {
      console.error('Failed to delete rule:', e);
    }
  }
}
