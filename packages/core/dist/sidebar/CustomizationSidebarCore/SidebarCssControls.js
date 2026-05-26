import { SidebarUtils } from '../../utils/customizationSidebarHelper.js';
/* Parses an inline CSS value like "64rem" or "4.3165vh" into its number + unit parts */
function parseStyleValue(cssVal, fallbackPx) {
  if (cssVal) {
    const match = cssVal.match(/^(-?[\d.]+)(px|rem|vh|%)$/);
    if (match) return { value: parseFloat(match[1]), unit: match[2] };
  }
  return { value: fallbackPx, unit: 'px' };
}
function getReliableWidth(el) {
  if (!el) return window.innerWidth;
  const inlineW = parseFloat(el.style.width);
  if (!isNaN(inlineW) && inlineW > 0 && el.style.width.endsWith('px')) {
    return inlineW;
  }
  return el.offsetWidth;
}
/* Greys out a control wrapper and disables its inputs */
export function disableControlWrapper(
  controlId,
  reason = 'Not supported for inline display'
) {
  const el = document.getElementById(controlId);
  if (!el) return;
  const wrapper = el.closest('.control-wrapper');
  if (!wrapper) return;
  wrapper.style.opacity = '0.45';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.cursor = 'not-allowed';
  wrapper.title = reason;
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
  addListenersFn,
  customizeComponentTagName
) {
  var _a;
  controlsContainer.innerHTML = '';
  const styles = getComputedStyle(component);
  const isCanvas = component.id.toLowerCase() === 'canvas';
  let cssContainer = controlsContainer;
  if (customizeComponentTagName) {
    const modeToggle = document.createElement('div');
    modeToggle.className = 'customize-mode-toggle';
    const defaultBtn = document.createElement('button');
    defaultBtn.className = 'mode-btn active';
    defaultBtn.textContent = 'Default';
    const customBtn = document.createElement('button');
    customBtn.className = 'mode-btn';
    customBtn.textContent = 'Custom';
    modeToggle.appendChild(defaultBtn);
    modeToggle.appendChild(customBtn);
    controlsContainer.appendChild(modeToggle);
    const defaultPanel = document.createElement('div');
    defaultPanel.className = 'default-css-panel';
    controlsContainer.appendChild(defaultPanel);
    cssContainer = defaultPanel;
    const customPanel = document.createElement('div');
    customPanel.className = 'custom-settings-panel';
    customPanel.style.display = 'none';
    const customEl = document.createElement(customizeComponentTagName);
    customEl.setAttribute(
      'data-settings',
      JSON.stringify({ targetComponentId: component.id })
    );
    customPanel.appendChild(customEl);
    controlsContainer.appendChild(customPanel);
    defaultBtn.addEventListener('click', () => {
      defaultBtn.classList.add('active');
      customBtn.classList.remove('active');
      defaultPanel.style.display = 'block';
      customPanel.style.display = 'none';
    });
    customBtn.addEventListener('click', () => {
      customBtn.classList.add('active');
      defaultBtn.classList.remove('active');
      customPanel.style.display = 'block';
      defaultPanel.style.display = 'none';
    });
  }
  const displayIntent = component.dataset.displayIntent;
  const displayValue =
    displayIntent || component.style.display || styles.display || 'block';
  const isInline = displayValue === 'inline';
  SidebarUtils.createSelectControl(
    'Display',
    'display',
    displayValue,
    ['block', 'inline', 'inline-block', 'flex', 'grid', 'none'],
    cssContainer
  );
  if (styles.display === 'flex' || component.style.display === 'flex') {
    SidebarUtils.createSelectControl(
      'Flex Direction',
      'flex-direction',
      styles.flexDirection || 'row',
      ['row', 'row-reverse', 'column', 'column-reverse'],
      cssContainer
    );
    SidebarUtils.createSelectControl(
      'Align Items',
      'align-items',
      styles.alignItems || 'stretch',
      ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
      cssContainer
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
      cssContainer
    );
  }
  if (isCanvas) {
    SidebarUtils.createPageSizeSelect(cssContainer, component);
    SidebarUtils.createControl(
      'Width',
      'width',
      'number',
      component.offsetWidth,
      cssContainer,
      { min: 300, max: 2000, unit: 'px' }
    );
    SidebarUtils.createControl(
      'Min Height',
      'min-height',
      'number',
      parseInt(styles.minHeight) || 100,
      cssContainer,
      { min: 0, max: 2000, unit: 'px' }
    );
    SidebarUtils.createControl(
      'Margin',
      'margin',
      'number',
      parseInt(styles.margin) || 0,
      cssContainer,
      { min: 0, max: 100, unit: 'px' }
    );
  }
  if (!isCanvas) {
    const parentEl = component.parentElement;
    const parentW = getReliableWidth(parentEl);
    const parentH =
      (_a =
        parentEl === null || parentEl === void 0
          ? void 0
          : parentEl.offsetHeight) !== null && _a !== void 0
        ? _a
        : window.innerHeight;
    const wStyle = parseStyleValue(
      component.style.width,
      component.offsetWidth
    );
    SidebarUtils.createControl(
      'Width',
      'width',
      'number',
      wStyle.value,
      cssContainer,
      {
        min: 0,
        unit: wStyle.unit,
        parentRef: parentW,
      }
    );
    if (isInline)
      disableControlWrapper(
        'width',
        'Width is not supported for inline display'
      );
    const hStyle = parseStyleValue(
      component.style.height,
      component.offsetHeight
    );
    SidebarUtils.createControl(
      'Height',
      'height',
      'number',
      hStyle.value,
      cssContainer,
      {
        min: 0,
        unit: hStyle.unit,
        parentRef: parentH,
      }
    );
    if (isInline)
      disableControlWrapper(
        'height',
        'Height is not supported for inline display'
      );
    const hasCustomMargin = !!(
      component.style.marginTop ||
      component.style.marginRight ||
      component.style.marginBottom ||
      component.style.marginLeft
    );
    const mStyle = parseStyleValue(
      component.style.margin,
      parseInt(styles.margin) || 0
    );
    const mTop = parseStyleValue(component.style.marginTop, 0);
    const mRight = parseStyleValue(component.style.marginRight, 0);
    const mBottom = parseStyleValue(component.style.marginBottom, 0);
    const mLeft = parseStyleValue(component.style.marginLeft, 0);
    SidebarUtils.createSpacingControl(
      'Margin',
      'margin',
      hasCustomMargin ? 'custom' : 'all',
      mStyle.value,
      mStyle.unit,
      { top: mTop, right: mRight, bottom: mBottom, left: mLeft },
      cssContainer,
      { min: 0, max: 1000 }
    );
    if (isInline)
      disableControlWrapper(
        'margin',
        'Top/bottom margin is not supported for inline display'
      );
    const hasCustomPadding = !!(
      component.style.paddingTop ||
      component.style.paddingRight ||
      component.style.paddingBottom ||
      component.style.paddingLeft
    );
    const pStyle = parseStyleValue(
      component.style.padding,
      parseInt(styles.padding) || 0
    );
    const pTop = parseStyleValue(component.style.paddingTop, 0);
    const pRight = parseStyleValue(component.style.paddingRight, 0);
    const pBottom = parseStyleValue(component.style.paddingBottom, 0);
    const pLeft = parseStyleValue(component.style.paddingLeft, 0);
    SidebarUtils.createSpacingControl(
      'Padding',
      'padding',
      hasCustomPadding ? 'custom' : 'all',
      pStyle.value,
      pStyle.unit,
      { top: pTop, right: pRight, bottom: pBottom, left: pLeft },
      cssContainer,
      { min: 0, max: 1000 }
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
    cssContainer
  );
  SidebarUtils.createSelectControl(
    'Text Alignment',
    'alignment',
    styles.textAlign,
    ['left', 'center', 'right'],
    cssContainer
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
    cssContainer
  );
  SidebarUtils.createControl(
    'Font Size',
    'font-size',
    'number',
    parseInt(styles.fontSize) || 16,
    cssContainer,
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
    cssContainer
  );
  SidebarUtils.createControl(
    'Text Color',
    'text-color',
    'color',
    styles.color || '#000000',
    cssContainer
  );
  SidebarUtils.createControl(
    'Border Width',
    'border-width',
    'number',
    parseInt(styles.borderWidth) || 0,
    cssContainer,
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
    cssContainer
  );
  SidebarUtils.createControl(
    'Border Color',
    'border-color',
    'color',
    styles.borderColor || '#000000',
    cssContainer
  );
  SidebarUtils.createControl(
    'Border Radius',
    'border-radius',
    'number',
    parseInt(styles.borderRadius) || 0,
    cssContainer,
    { min: 0, max: 500, unit: 'px' }
  );
  /* Sync hex color pickers to the computed RGB values */
  const bgColorInput = document.getElementById('background-color');
  const textColorInput = document.getElementById('text-color');
  const borderColorInput = document.getElementById('border-color');
  if (bgColorInput)
    bgColorInput.value = SidebarUtils.rgbToHex(styles.backgroundColor);
  if (textColorInput) {
    /*
     * Show the color of whichever span the cursor is currently sitting inside.
     * When the user clicks on cyan text, the cursor lands in the cyan <span>
     * and we walk up from the anchor node to find it. Falls back to the
     * component's own computed color when the cursor is not inside a colored span.
     */
    let displayColor = styles.color;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      let node = sel.getRangeAt(0).startContainer;
      while (node && node !== component) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.tagName === 'SPAN' &&
          !!node.style.color
        ) {
          displayColor = node.style.color;
          break;
        }
        node = node.parentNode;
      }
    }
    const hexColor = SidebarUtils.rgbToHex(displayColor);
    textColorInput.value = hexColor;
    const textColorHexInput = document.getElementById('text-color-value');
    if (textColorHexInput) textColorHexInput.value = hexColor;
  }
  if (borderColorInput)
    borderColorInput.value = SidebarUtils.rgbToHex(styles.borderColor);
  /* Attach all change/input listeners after controls are in the DOM */
  addListenersFn(component);
}
