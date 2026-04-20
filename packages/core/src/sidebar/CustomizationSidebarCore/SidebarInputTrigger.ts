import { Canvas } from '../../canvas/Canvas';
import { TableComponent } from '../../components/TableComponent';
import { TextComponent } from '../../components/TextComponent';
import { HeaderComponent } from '../../components/HeaderComponent';

/* Reads all attribute inputs from the panel and fires the globalExecuteFunction */
export async function handleInputTrigger(
  selectedComponent: HTMLElement | null,
  basicComponentsConfig: BasicComponent[] | null,
  functionsPanel: HTMLElement
): Promise<void> {
  if (!selectedComponent) return;

  /* Resolve the config for the currently selected component type */
  let componentConfig: BasicComponent | undefined;

  if (selectedComponent.classList.contains('table-component')) {
    componentConfig = basicComponentsConfig?.find(c => c.name === 'table');
  } else if (selectedComponent.classList.contains('text-component')) {
    componentConfig = basicComponentsConfig?.find(c => c.name === 'text');
  } else if (selectedComponent.classList.contains('header-component')) {
    componentConfig = basicComponentsConfig?.find(c => c.name === 'header');
  }

  if (!componentConfig?.globalExecuteFunction) return;

  /* Collect every attribute input value from the panel */
  const inputValues: { [key: string]: string | boolean } = {};
  functionsPanel.querySelectorAll('.attribute-input').forEach(input => {
    const inputEl = input as HTMLInputElement;
    /* Checkboxes return 'true'/'false' strings to stay consistent with text inputs */
    inputValues[inputEl.id] =
      inputEl.type === 'checkbox'
        ? inputEl.checked
          ? 'true'
          : 'false'
        : inputEl.value;
  });

  const result = (await componentConfig.globalExecuteFunction(inputValues)) as
    | AttributeValues
    | null
    | undefined;

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
}
