var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { Canvas } from '../../canvas/Canvas.js';
import { TableComponent } from '../../components/TableComponent.js';
import { TextComponent } from '../../components/TextComponent.js';
import { HeaderComponent } from '../../components/HeaderComponent.js';
/* Reads all attribute inputs from the panel and fires the globalExecuteFunction */
export function handleInputTrigger(
  selectedComponent,
  basicComponentsConfig,
  functionsPanel
) {
  return __awaiter(this, void 0, void 0, function* () {
    if (!selectedComponent) return;
    /* Resolve the config for the currently selected component type */
    let componentConfig;
    if (selectedComponent.classList.contains('table-component')) {
      componentConfig =
        basicComponentsConfig === null || basicComponentsConfig === void 0
          ? void 0
          : basicComponentsConfig.find(c => c.name === 'table');
    } else if (selectedComponent.classList.contains('text-component')) {
      componentConfig =
        basicComponentsConfig === null || basicComponentsConfig === void 0
          ? void 0
          : basicComponentsConfig.find(c => c.name === 'text');
    } else if (selectedComponent.classList.contains('header-component')) {
      componentConfig =
        basicComponentsConfig === null || basicComponentsConfig === void 0
          ? void 0
          : basicComponentsConfig.find(c => c.name === 'header');
    }
    if (
      !(componentConfig === null || componentConfig === void 0
        ? void 0
        : componentConfig.globalExecuteFunction)
    )
      return;
    /* Collect every attribute input value from the panel */
    const inputValues = {};
    functionsPanel.querySelectorAll('.attribute-input').forEach(input => {
      const inputEl = input;
      /* Checkboxes return 'true'/'false' strings to stay consistent with text inputs */
      inputValues[inputEl.id] =
        inputEl.type === 'checkbox'
          ? inputEl.checked
            ? 'true'
            : 'false'
          : inputEl.value;
    });
    const result = yield componentConfig.globalExecuteFunction(inputValues);
    const tableInstance = new TableComponent();
    const textInstance = new TextComponent();
    const headerInstance = new HeaderComponent();
    if (result) {
      /* Seed formula cells with the returned computed values */
      textInstance.seedFormulaValues(result);
      tableInstance.seedFormulaValues(result);
      headerInstance.seedFormulaValues(result);
      Canvas.historyManager.captureState();
    }
    /* Push raw input values into every matching Input-type cell/component */
    textInstance.updateInputValues(inputValues);
    tableInstance.updateInputValues(inputValues);
    headerInstance.updateInputValues(inputValues);
    tableInstance.evaluateRowVisibility(inputValues);
    Canvas.historyManager.captureState();
  });
}
