/* Converts a computed rgb/rgba string to a #RRGGBB hex value */
export function rgbToHex(rgb) {
  const result = rgb.match(
    /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/
  );
  if (!result) return rgb;
  const r = parseInt(result[1], 10);
  const g = parseInt(result[2], 10);
  const b = parseInt(result[3], 10);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}
/* Builds a generic input control (number, color, or plain text) */
export function createControl(
  label,
  id,
  type,
  value,
  controlsContainer,
  attributes = {}
) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('control-wrapper');
  const isNumber = type === 'number';
  if (isNumber && attributes.unit) {
    /* Number input with a px / rem / vh / % unit selector */
    const unit = attributes.unit;
    wrapper.innerHTML = `
      <label for="${id}">${label}:</label>
      <div class="input-wrapper">
        <input type="${type}" id="${id}" value="${value}">
        <select id="${id}-unit">
          <option value="px"  ${unit === 'px' ? 'selected' : ''}>px</option>
          <option value="rem" ${unit === 'rem' ? 'selected' : ''}>rem</option>
          <option value="vh"  ${unit === 'vh' ? 'selected' : ''}>vh</option>
          <option value="%"   ${unit === '%' ? 'selected' : ''}>%</option>
        </select>
      </div>
    `;
  } else if (type === 'color') {
    /* Color picker paired with a hex text input for manual entry */
    wrapper.innerHTML = `
      <label for="${id}">${label}:</label>
      <div class="input-wrapper">
        <input type="color" id="${id}" value="${value}">
        <input type="text"  id="${id}-value" style="font-size:0.8rem;width:200px;margin-left:8px;" value="${value}">
      </div>
    `;
  } else {
    wrapper.innerHTML = `
      <label for="${id}">${label}:</label>
      <div class="input-wrapper">
        <input type="${type}" id="${id}" value="${value}">
      </div>
    `;
  }
  /* Apply any extra HTML attributes (min, max, etc.) to the primary input */
  const input = wrapper.querySelector('input');
  const unitSelect = wrapper.querySelector(`#${id}-unit`);
  if (input) {
    Object.keys(attributes).forEach(key => {
      if (key !== 'unit' && key !== 'parentRef') {
        input.setAttribute(key, attributes[key].toString());
      }
    });
  }
  /* Keep the color picker and the hex text field in sync */
  const colorInput = wrapper.querySelector(`input[type="color"]#${id}`);
  const hexInput = wrapper.querySelector(`#${id}-value`);
  if (colorInput) {
    colorInput.addEventListener('input', () => {
      if (hexInput) hexInput.value = colorInput.value;
    });
  }
  if (hexInput) {
    hexInput.addEventListener('input', () => {
      if (colorInput) colorInput.value = hexInput.value;
    });
  }
  controlsContainer.appendChild(wrapper);
  /* When the unit selector changes, convert the existing value to the new unit */
  if (unitSelect) {
    unitSelect.dataset.prevUnit = attributes.unit || 'px';
    if (attributes.parentRef !== undefined) {
      unitSelect.dataset.parentRef = String(attributes.parentRef);
    }
    unitSelect.addEventListener('change', () => {
      const newUnit = unitSelect.value;
      const oldUnit = unitSelect.dataset.prevUnit || 'px';
      const parentRef = unitSelect.dataset.parentRef
        ? parseFloat(unitSelect.dataset.parentRef)
        : undefined;
      const currentValue = parseFloat(input.value) || 0;
      const converted = convertUnit(currentValue, oldUnit, newUnit, parentRef);
      input.value = String(converted);
      unitSelect.dataset.prevUnit = newUnit;
      /* Notify listeners (e.g. SidebarControlListeners) so the style is applied */
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }
}
function convertUnit(value, from, to, parentRef) {
  if (from === to) return value;
  const BASE_FONT_SIZE = 16;
  const viewportH = window.innerHeight;
  /* % is relative to the parent element's dimension, fall back to viewport if unknown */
  const percentRef =
    parentRef !== null && parentRef !== void 0 ? parentRef : window.innerWidth;
  /* Step 1: normalise to px */
  let px;
  switch (from) {
    case 'rem':
      px = value * BASE_FONT_SIZE;
      break;
    case 'vh':
      px = (value / 100) * viewportH;
      break;
    case '%':
      px = (value / 100) * percentRef;
      break;
    default:
      px = value; /* px */
  }
  /* Step 2: convert px → target unit */
  switch (to) {
    case 'rem':
      return parseFloat((px / BASE_FONT_SIZE).toFixed(4));
    case 'vh':
      return parseFloat(((px / viewportH) * 100).toFixed(4));
    case '%':
      return parseFloat(((px / percentRef) * 100).toFixed(4));
    default:
      return Math.round(px); /* px */
  }
}
/* Builds a labelled <select> control with one <option> per entry */
export function createSelectControl(
  label,
  id,
  currentValue,
  options,
  controlsContainer
) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('control-wrapper');
  /* Mark the currently active option as selected */
  const selectOptions = options
    .map(
      option =>
        `<option value="${option}" ${option === currentValue ? 'selected' : ''}>${option}</option>`
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
