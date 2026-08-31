import { Canvas } from '../../canvas/Canvas.js';
const ADD_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M5 12h14M12 5v14"/></svg>`;
const DELETE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>`;
/** Populates the functions panel with a visibility-rule builder for a table row */
export function populateRowVisibilityControls(row, inputs) {
    const functionsPanel = document.getElementById('functions-panel');
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
            ${ADD_ICON}
            <span>Add Rule</span>
          </button>
        </div>
      </div>
    </div>
  `;
    /** Populate the input-key dropdown from the passed Input-type attributes */
    const inputKeySelect = document.getElementById('rule-input-key-select');
    if (inputKeySelect && inputs) {
        inputs.forEach(attr => {
            if (attr.type === 'Input') {
                const option = document.createElement('option');
                option.value = attr.key;
                option.textContent = attr.title;
                inputKeySelect.appendChild(option);
            }
        });
    }
    const rulesList = document.getElementById('rules-list');
    const addRuleBtn = document.getElementById('add-rule-btn');
    const ruleValueInput = document.getElementById('rule-value-input');
    const ruleOperatorSelect = document.getElementById('rule-operator-select');
    const ruleActionSelect = document.getElementById('rule-action-select');
    /** Re-renders the entire rule list from the row's data attribute */
    const renderRules = () => {
        rulesList.innerHTML = '';
        const rules = JSON.parse(row.getAttribute('data-visibility-rules') || '[]');
        rules.forEach((rule, index) => {
            const ruleItem = document.createElement('div');
            ruleItem.className = 'rule-item';
            /* Built via DOM APIs (not innerHTML) — rule.inputKey/value/action are
               attacker-controllable (round-trip through data-visibility-rules,
               which import/export/restore can populate from untrusted JSON), so
               they must never be concatenated into an HTML string. */
            const textSpan = document.createElement('span');
            textSpan.className = 'rule-item-text';
            const appendStrong = (text, className) => {
                const strong = document.createElement('strong');
                strong.className = className;
                strong.textContent = text;
                textSpan.appendChild(strong);
            };
            textSpan.appendChild(document.createTextNode('If '));
            appendStrong(rule.inputKey, 'text-blue-600');
            textSpan.appendChild(document.createTextNode(` ${rule.operator} '`));
            appendStrong(rule.value, 'text-green-600');
            textSpan.appendChild(document.createTextNode("', then "));
            appendStrong(rule.action, 'text-purple-600');
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-rule-btn';
            deleteBtn.innerHTML = DELETE_ICON; // static trusted constant, not user data
            ruleItem.appendChild(textSpan);
            ruleItem.appendChild(deleteBtn);
            /** Each rule row gets its own scoped delete handler */
            deleteBtn.addEventListener('click', () => {
                deleteRule(row, index);
                renderRules();
                Canvas.dispatchDesignChange();
            });
            rulesList.appendChild(ruleItem);
        });
    };
    /** Add rule on button click then refresh the list */
    addRuleBtn.addEventListener('click', () => {
        addRule(row, {
            inputKey: inputKeySelect.value,
            operator: ruleOperatorSelect.value,
            value: ruleValueInput.value,
            action: ruleActionSelect.value,
        });
        renderRules();
        Canvas.dispatchDesignChange();
    });
    renderRules();
}
/** Appends a new rule object to the row's data-visibility-rules JSON attribute */
function addRule(row, rule) {
    try {
        const existingRules = JSON.parse(row.getAttribute('data-visibility-rules') || '[]');
        existingRules.push(rule);
        row.setAttribute('data-visibility-rules', JSON.stringify(existingRules));
    }
    catch (e) {
        console.error('Failed to add rule:', e);
    }
}
/** Removes the rule at the given index from the row's data-visibility-rules */
function deleteRule(row, index) {
    try {
        const existingRules = JSON.parse(row.getAttribute('data-visibility-rules') || '[]');
        existingRules.splice(index, 1);
        row.setAttribute('data-visibility-rules', JSON.stringify(existingRules));
    }
    catch (e) {
        console.error('Failed to delete rule:', e);
    }
}
