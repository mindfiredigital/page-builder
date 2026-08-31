/* Predefined canvas sizes in pixels */
export const PAGE_SIZES: Record<string, { width: number; height: number }> = {
  A4_P: { width: 794, height: 1123 },
  A4_L: { width: 1123, height: 794 },
  LETTER_P: { width: 816, height: 1056 },
};

/* Option list shown in the page-size dropdown */
export const PAGE_SIZES_OPTIONS = [
  { value: 'A4_P', label: 'A4 Portrait (794x1123 px)' },
  { value: 'A4_L', label: 'A4 Landscape (1123x794 px)' },
  { value: 'LETTER_P', label: 'Letter Portrait (816x1056 px)' },
  { value: 'CUSTOM', label: 'Custom Size' },
];

/* Builds and appends the page-size preset select control */
export function createPageSizeSelect(
  container: HTMLElement,
  canvasElement: HTMLElement
): void {
  const wrapper = document.createElement('div');
  wrapper.classList.add('control-wrapper', 'vertical');

  const label = document.createElement('label');
  label.textContent = 'Page Size Preset';

  const select = document.createElement('select');
  select.id = 'page-size-select';
  select.classList.add('form-input');

  /* Read current canvas dimensions to pre-select the matching preset */
  const currentMaxWidth = canvasElement.style.maxWidth.match(/\d+/)
    ? parseInt(canvasElement.style.maxWidth.match(/\d+/)?.[0] || '0')
    : canvasElement.offsetWidth;

  const currentMinHeight = canvasElement.style.minHeight.match(/\d+/)
    ? parseInt(canvasElement.style.minHeight.match(/\d+/)?.[0] || '0')
    : 0;

  let defaultValue = 'CUSTOM';

  PAGE_SIZES_OPTIONS.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option.value;
    opt.textContent = option.label;
    select.appendChild(opt);

    /* Auto-select when the canvas already matches a known preset (within 5 px) */
    if (option.value !== 'CUSTOM') {
      const size = PAGE_SIZES[option.value];
      if (
        size &&
        Math.abs(size.width - currentMaxWidth) < 5 &&
        Math.abs(size.height - currentMinHeight) < 5
      ) {
        defaultValue = option.value;
      }
    }
  });

  select.value = defaultValue;

  wrapper.appendChild(label);
  wrapper.appendChild(select);
  container.appendChild(wrapper);
}
