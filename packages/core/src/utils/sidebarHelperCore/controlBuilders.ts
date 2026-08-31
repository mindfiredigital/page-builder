/* Converts a computed rgb/rgba string to a #RRGGBB hex value */
export function rgbToHex(rgb: string): string {
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
  label: string,
  id: string,
  type: string,
  value: string | number,
  controlsContainer: HTMLElement,
  attributes: Record<string, string | number> = {}
): void {
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
  const input = wrapper.querySelector('input') as HTMLInputElement;
  const unitSelect = wrapper.querySelector(`#${id}-unit`) as HTMLSelectElement;

  if (input) {
    Object.keys(attributes).forEach(key => {
      if (key !== 'unit' && key !== 'parentRef') {
        input.setAttribute(key, attributes[key].toString());
      }
    });
  }

  /* Keep the color picker and the hex text field in sync */
  const colorInput = wrapper.querySelector(
    `input[type="color"]#${id}`
  ) as HTMLInputElement;
  const hexInput = wrapper.querySelector(`#${id}-value`) as HTMLInputElement;

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
    unitSelect.dataset.prevUnit = (attributes.unit as string) || 'px';
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
      /* If the converted px value exceeds the input's max, expand max so
         spinner arrows (+/-) still work correctly after switching back to px */
      if (input.max !== '' && !isNaN(parseFloat(input.max))) {
        const currentMax = parseFloat(input.max);
        if (converted > currentMax) {
          input.max = String(Math.ceil(converted) + 1000);
        }
      }
      unitSelect.dataset.prevUnit = newUnit;
      /* Notify listeners (e.g. SidebarControlListeners) so the style is applied */
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }
}

function convertUnit(
  value: number,
  from: string,
  to: string,
  parentRef?: number
): number {
  if (from === to) return value;

  const BASE_FONT_SIZE = 16;
  const viewportH = window.innerHeight;
  /* % is relative to the parent element's dimension, fall back to viewport if unknown */
  const percentRef = parentRef ?? window.innerWidth;

  /* Step 1: normalise to px */
  let px: number;
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
  label: string,
  id: string,
  currentValue: string,
  options: string[],
  controlsContainer: HTMLElement
): void {
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

/* Builds a spacing control (margin / padding) with all-sides and custom-sides toggle */
export function createSpacingControl(
  label: string,
  id: string,
  mode: 'all' | 'custom',
  allValue: number,
  allUnit: string,
  sides: {
    top: { value: number; unit: string };
    right: { value: number; unit: string };
    bottom: { value: number; unit: string };
    left: { value: number; unit: string };
  },
  controlsContainer: HTMLElement,
  attributes: { min?: number; max?: number } = {}
): void {
  const { min = 0, max = 1000 } = attributes;

  const unitOpts = (sel: string) =>
    ['px', 'rem', 'vh', '%']
      .map(
        u => `<option value="${u}"${u === sel ? ' selected' : ''}>${u}</option>`
      )
      .join('');

  /* All-sides icon: solid-border square */
  const allIcon = `<svg width="14" height="14" viewBox="0 0 14 14"><rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" stroke-width="2" fill="none"/></svg>`;

  /* Custom icon: four separate edge segments */
  const customIcon = `<svg width="14" height="14" viewBox="0 0 14 14">
    <line x1="3" y1="1" x2="11" y2="1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="3" y1="13" x2="11" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="1" y1="3" x2="1" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <line x1="13" y1="3" x2="13" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`;

  const wrapper = document.createElement('div');
  wrapper.classList.add('control-wrapper', 'spacing-control');

  wrapper.innerHTML = `
    <div class="spacing-header">
      <label>${label}:</label>
      <div class="spacing-toggle">
        <button type="button" class="spacing-mode-btn${mode === 'all' ? ' active' : ''}" data-mode="all" title="All sides">${allIcon}</button>
        <button type="button" class="spacing-mode-btn${mode === 'custom' ? ' active' : ''}" data-mode="custom" title="Individual sides">${customIcon}</button>
      </div>
    </div>
    <div class="spacing-all" style="display:${mode === 'all' ? 'flex' : 'none'}">
      <input type="number" id="${id}" value="${allValue}" min="${min}" max="${max}">
      <select id="${id}-unit">${unitOpts(allUnit)}</select>
    </div>
    <div class="spacing-custom" style="display:${mode === 'custom' ? 'flex' : 'none'}">
      <div class="spacing-row">
        <span class="spacing-side-label">Top</span>
        <input type="number" id="${id}-top" value="${sides.top.value}" min="${min}" max="${max}">
        <select id="${id}-top-unit">${unitOpts(sides.top.unit)}</select>
      </div>
      <div class="spacing-row">
        <span class="spacing-side-label">Left</span>
        <input type="number" id="${id}-left" value="${sides.left.value}" min="${min}" max="${max}">
        <select id="${id}-left-unit">${unitOpts(sides.left.unit)}</select>
      </div>
      <div class="spacing-row">
        <span class="spacing-side-label">Right</span>
        <input type="number" id="${id}-right" value="${sides.right.value}" min="${min}" max="${max}">
        <select id="${id}-right-unit">${unitOpts(sides.right.unit)}</select>
      </div>
      <div class="spacing-row">
        <span class="spacing-side-label">Bottom</span>
        <input type="number" id="${id}-bottom" value="${sides.bottom.value}" min="${min}" max="${max}">
        <select id="${id}-bottom-unit">${unitOpts(sides.bottom.unit)}</select>
      </div>
    </div>
  `;

  controlsContainer.appendChild(wrapper);

  const allBtn = wrapper.querySelector<HTMLButtonElement>('[data-mode="all"]')!;
  const customBtn = wrapper.querySelector<HTMLButtonElement>(
    '[data-mode="custom"]'
  )!;
  const allDiv = wrapper.querySelector<HTMLElement>('.spacing-all')!;
  const customDiv = wrapper.querySelector<HTMLElement>('.spacing-custom')!;

  allBtn.addEventListener('click', () => {
    allBtn.classList.add('active');
    customBtn.classList.remove('active');
    allDiv.style.display = 'flex';
    customDiv.style.display = 'none';
  });

  customBtn.addEventListener('click', () => {
    customBtn.classList.add('active');
    allBtn.classList.remove('active');
    allDiv.style.display = 'none';
    customDiv.style.display = 'flex';
  });
}
