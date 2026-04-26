import { SidebarUtils } from '../../utils/customizationSidebarHelper.js';
/* Parses an inline CSS value like "64rem" or "4.3165vh" into its number + unit parts */
function parseStyleValue(cssVal, fallbackPx) {
  if (cssVal) {
    const match = cssVal.match(/^(-?[\d.]+)(px|rem|vh|%)$/);
    if (match) return { value: parseFloat(match[1]), unit: match[2] };
  }
  return { value: fallbackPx, unit: 'px' };
}
/* Greys out a control wrapper and disables its inputs */
export function disableControlWrapper(
  controlId,
  reason = 'Not supported for inline display'
) {
  const el = document.getElementById(controlId);
  if (!el) return;
  /* Walk up to the nearest .control-wrapper ancestor */
  const wrapper = el.closest('.control-wrapper');
  if (!wrapper) return;
  wrapper.style.opacity = '0.45';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.cursor = 'not-allowed';
  wrapper.title = reason;
  /* Append a ⊘ badge next to the label so the user knows why it's locked */
  const label = wrapper.querySelector('label');
  if (label && !label.querySelector('.inline-disabled-badge')) {
    const badge = document.createElement('span');
    badge.className = 'inline-disabled-badge';
    badge.title = reason;
    badge.style.cssText = `
      display: inline-flex; align-items: center; justify-content: center;
      margin-left: 6px; width: 14px; height: 14px; border-radius: 50%;
      background-color: #94a3b8; color: #ffffff; font-size: 9px;
      font-weight: 700; cursor: not-allowed; vertical-align: middle;
      flex-shrink: 0; line-height: 1;
    `;
    badge.textContent = '⊘';
    label.appendChild(badge);
  }
  /* Also disable every input/select so keyboard interaction is blocked */
  wrapper.querySelectorAll('input, select').forEach(input => {
    input.disabled = true;
    input.style.cursor = 'not-allowed';
    input.style.backgroundColor = '#f1f5f9';
    input.style.color = '#94a3b8';
  });
}
/* Rebuilds the entire CSS controls panel for the given component */
export function populateCssControls(
  component,
  controlsContainer,
  addListenersFn
) {
  var _a, _b;
  controlsContainer.innerHTML = '';
  const styles = getComputedStyle(component);
  const isCanvas = component.id.toLowerCase() === 'canvas';
  /* Prefer inline style over computed — avoids browser-resolved values losing "inline" */
  const displayIntent = component.dataset.displayIntent;
  const displayValue =
    displayIntent || component.style.display || styles.display || 'block';
  const isInline = displayValue === 'inline';
  SidebarUtils.createSelectControl(
    'Display',
    'display',
    displayValue,
    ['block', 'inline', 'inline-block', 'flex', 'grid', 'none'],
    controlsContainer
  );
  /* Show flex sub-controls only when the current display is flex */
  if (styles.display === 'flex' || component.style.display === 'flex') {
    SidebarUtils.createSelectControl(
      'Flex Direction',
      'flex-direction',
      styles.flexDirection || 'row',
      ['row', 'row-reverse', 'column', 'column-reverse'],
      controlsContainer
    );
    SidebarUtils.createSelectControl(
      'Align Items',
      'align-items',
      styles.alignItems || 'stretch',
      ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
      controlsContainer
    );
    SidebarUtils.createSelectControl(
      'Justify Content',
      'justify-content',
      styles.justifyContent || 'flex-start',
      [
        'flex-start',
        'flex-end',
        'center',
        'space-between',
        'space-around',
        'space-evenly',
      ],
      controlsContainer
    );
  }
  if (isCanvas) {
    SidebarUtils.createPageSizeSelect(controlsContainer, component);
    SidebarUtils.createControl(
      'Width',
      'width',
      'number',
      component.offsetWidth,
      controlsContainer,
      { min: 300, max: 2000, unit: 'px' }
    );
    SidebarUtils.createControl(
      'Min Height',
      'min-height',
      'number',
      parseInt(styles.minHeight) || 100,
      controlsContainer,
      { min: 0, max: 2000, unit: 'px' }
    );
    SidebarUtils.createControl(
      'Margin',
      'margin',
      'number',
      parseInt(styles.margin) || 0,
      controlsContainer,
      { min: 0, max: 100, unit: 'px' }
    );
  }
  if (!isCanvas) {
    const parentEl = component.parentElement;
    const parentW =
      (_a =
        parentEl === null || parentEl === void 0
          ? void 0
          : parentEl.offsetWidth) !== null && _a !== void 0
        ? _a
        : window.innerWidth;
    const parentH =
      (_b =
        parentEl === null || parentEl === void 0
          ? void 0
          : parentEl.offsetHeight) !== null && _b !== void 0
        ? _b
        : window.innerHeight;
    /* Width — disabled for inline elements */
    const wStyle = parseStyleValue(
      component.style.width,
      component.offsetWidth
    );
    SidebarUtils.createControl(
      'Width',
      'width',
      'number',
      wStyle.value,
      controlsContainer,
      { min: 0, max: 1000, unit: wStyle.unit, parentRef: parentW }
    );
    if (isInline)
      disableControlWrapper(
        'width',
        'Width is not supported for inline display'
      );
    /* Height — disabled for inline elements */
    const hStyle = parseStyleValue(
      component.style.height,
      component.offsetHeight
    );
    SidebarUtils.createControl(
      'Height',
      'height',
      'number',
      hStyle.value,
      controlsContainer,
      { min: 0, max: 1000, unit: hStyle.unit, parentRef: parentH }
    );
    if (isInline)
      disableControlWrapper(
        'height',
        'Height is not supported for inline display'
      );
    /* Margin — disabled for inline elements (top/bottom ignored by browser) */
    const mStyle = parseStyleValue(
      component.style.margin,
      parseInt(styles.margin) || 0
    );
    SidebarUtils.createControl(
      'Margin',
      'margin',
      'number',
      mStyle.value,
      controlsContainer,
      { min: 0, max: 1000, unit: mStyle.unit, parentRef: parentW }
    );
    if (isInline)
      disableControlWrapper(
        'margin',
        'Top/bottom margin is not supported for inline display'
      );
    /* Padding — disabled for inline elements */
    const pStyle = parseStyleValue(
      component.style.padding,
      parseInt(styles.padding) || 0
    );
    SidebarUtils.createControl(
      'Padding',
      'padding',
      'number',
      pStyle.value,
      controlsContainer,
      { min: 0, max: 1000, unit: pStyle.unit, parentRef: parentW }
    );
    if (isInline)
      disableControlWrapper(
        'padding',
        'Top/bottom padding is not supported for inline display'
      );
  }
  SidebarUtils.createControl(
    'Background Color',
    'background-color',
    'color',
    styles.backgroundColor,
    controlsContainer
  );
  SidebarUtils.createSelectControl(
    'Text Alignment',
    'alignment',
    styles.textAlign,
    ['left', 'center', 'right'],
    controlsContainer
  );
  SidebarUtils.createSelectControl(
    'Font Family',
    'font-family',
    styles.fontFamily,
    [
      'Arial',
      'Verdana',
      'Helvetica',
      'Times New Roman',
      'Georgia',
      'Courier New',
      'sans-serif',
      'serif',
    ],
    controlsContainer
  );
  SidebarUtils.createControl(
    'Font Size',
    'font-size',
    'number',
    parseInt(styles.fontSize) || 16,
    controlsContainer,
    { min: 0, max: 100, unit: 'px' }
  );
  SidebarUtils.createSelectControl(
    'Font Weight',
    'font-weight',
    styles.fontWeight,
    [
      'normal',
      'bold',
      'bolder',
      'lighter',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
    ],
    controlsContainer
  );
  SidebarUtils.createControl(
    'Text Color',
    'text-color',
    'color',
    styles.color || '#000000',
    controlsContainer
  );
  SidebarUtils.createControl(
    'Border Width',
    'border-width',
    'number',
    parseInt(styles.borderWidth) || 0,
    controlsContainer,
    { min: 0, max: 20, unit: 'px' }
  );
  SidebarUtils.createSelectControl(
    'Border Style',
    'border-style',
    styles.borderStyle || 'none',
    [
      'none',
      'solid',
      'dashed',
      'dotted',
      'double',
      'groove',
      'ridge',
      'inset',
      'outset',
    ],
    controlsContainer
  );
  SidebarUtils.createControl(
    'Border Color',
    'border-color',
    'color',
    styles.borderColor || '#000000',
    controlsContainer
  );
  /* Sync hex color pickers to the computed RGB values */
  const bgColorInput = document.getElementById('background-color');
  const textColorInput = document.getElementById('text-color');
  const borderColorInput = document.getElementById('border-color');
  if (bgColorInput)
    bgColorInput.value = SidebarUtils.rgbToHex(styles.backgroundColor);
  if (textColorInput)
    textColorInput.value = SidebarUtils.rgbToHex(styles.color);
  if (borderColorInput)
    borderColorInput.value = SidebarUtils.rgbToHex(styles.borderColor);
  /* Attach all change/input listeners after controls are in the DOM */
  addListenersFn(component);
}
