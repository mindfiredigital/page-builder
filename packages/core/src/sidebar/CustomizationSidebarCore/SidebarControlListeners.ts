import { Canvas } from '../../canvas/Canvas';
import { debounce } from '../../utils/utilityFunctions';
import { populateCssControls } from './SidebarCssControls';

/* Attaches every CSS-property change/input listener to the sidebar controls */
export function addControlListeners(
  component: HTMLElement,
  controlsContainer: HTMLElement,
  addListenersFn: (
    component: HTMLElement
  ) => void /* recursive ref for re-populate */,
  customizeComponentTagName?: string
): void {
  /* Single debounced handler shared by all controls to batch history captures */
  const captureStateDebounced = debounce(() => {
    Canvas.dispatchDesignChange();
    Canvas.historyManager.captureState();
  }, 300);

  const get = <T extends HTMLElement>(id: string) =>
    document.getElementById(id) as T | null;

  /* ── Dimensions ──────────────────────────────────────────────────────────── */
  get<HTMLInputElement>('width')?.addEventListener('input', () => {
    const unit = get<HTMLSelectElement>('width-unit')?.value || 'px';
    component.style.width = `${get<HTMLInputElement>('width')!.value}${unit}`;
    captureStateDebounced();
  });

  get<HTMLInputElement>('height')?.addEventListener('input', () => {
    const unit = get<HTMLSelectElement>('height-unit')?.value || 'px';
    component.style.height = `${get<HTMLInputElement>('height')!.value}${unit}`;
    captureStateDebounced();
  });

  /* ── Background color — two-way sync between picker and hex input ───────── */
  get<HTMLInputElement>('background-color')?.addEventListener('input', () => {
    const val = get<HTMLInputElement>('background-color')!.value;
    component.style.backgroundColor = val;
    const hexInput = get<HTMLInputElement>('background-color-value');
    if (hexInput) hexInput.value = val;
    captureStateDebounced();
  });

  get<HTMLInputElement>('background-color-value')?.addEventListener(
    'input',
    e => {
      const val = (e.target as HTMLInputElement).value;
      component.style.backgroundColor = val;
      const picker = get<HTMLInputElement>('background-color');
      if (picker) picker.value = val;
      captureStateDebounced();
    }
  );

  /* ── Spacing ─────────────────────────────────────────────────────────────── */

  /* Margin — all sides: capture element refs once so the handler never re-queries */
  const marginInput = get<HTMLInputElement>('margin');
  const marginUnitSel = get<HTMLSelectElement>('margin-unit');
  if (marginInput) {
    const applyMarginAll = () => {
      const val = marginInput.value || '0';
      const unit = marginUnitSel?.value || 'px';
      /* Clear individual overrides first so the shorthand is never shadowed */
      component.style.marginTop = '';
      component.style.marginRight = '';
      component.style.marginBottom = '';
      component.style.marginLeft = '';
      component.style.margin = `${val}${unit}`;
      captureStateDebounced();
    };
    marginInput.addEventListener('input', applyMarginAll);
    marginUnitSel?.addEventListener('change', applyMarginAll);
  }

  /* Margin — individual sides */
  (['top', 'right', 'bottom', 'left'] as const).forEach(side => {
    const sideInput = get<HTMLInputElement>(`margin-${side}`);
    const sideUnit = get<HTMLSelectElement>(`margin-${side}-unit`);
    const prop = `margin${side.charAt(0).toUpperCase()}${side.slice(1)}`;
    if (sideInput) {
      const apply = () => {
        const unit = sideUnit?.value || 'px';
        (component.style as unknown as Record<string, string>)[prop] =
          `${sideInput.value || '0'}${unit}`;
        captureStateDebounced();
      };
      sideInput.addEventListener('input', apply);
      sideUnit?.addEventListener('change', apply);
    }
  });

  /* Padding — all sides */
  const paddingInput = get<HTMLInputElement>('padding');
  const paddingUnitSel = get<HTMLSelectElement>('padding-unit');
  if (paddingInput) {
    const applyPaddingAll = () => {
      const val = paddingInput.value || '0';
      const unit = paddingUnitSel?.value || 'px';
      component.style.paddingTop = '';
      component.style.paddingRight = '';
      component.style.paddingBottom = '';
      component.style.paddingLeft = '';
      component.style.padding = `${val}${unit}`;
      captureStateDebounced();
    };
    paddingInput.addEventListener('input', applyPaddingAll);
    paddingUnitSel?.addEventListener('change', applyPaddingAll);
  }

  /* Padding — individual sides */
  (['top', 'right', 'bottom', 'left'] as const).forEach(side => {
    const sideInput = get<HTMLInputElement>(`padding-${side}`);
    const sideUnit = get<HTMLSelectElement>(`padding-${side}-unit`);
    const prop = `padding${side.charAt(0).toUpperCase()}${side.slice(1)}`;
    if (sideInput) {
      const apply = () => {
        const unit = sideUnit?.value || 'px';
        (component.style as unknown as Record<string, string>)[prop] =
          `${sideInput.value || '0'}${unit}`;
        captureStateDebounced();
      };
      sideInput.addEventListener('input', apply);
      sideUnit?.addEventListener('change', apply);
    }
  });

  /* ── Typography ──────────────────────────────────────────────────────────── */
  get<HTMLSelectElement>('alignment')?.addEventListener('change', () => {
    component.style.textAlign = get<HTMLSelectElement>('alignment')!.value;
    captureStateDebounced();
  });

  get<HTMLInputElement>('font-size')?.addEventListener('input', () => {
    const unit = get<HTMLSelectElement>('font-size-unit')?.value || 'px';
    component.style.fontSize = `${get<HTMLInputElement>('font-size')!.value}${unit}`;
    captureStateDebounced();
  });

  get<HTMLSelectElement>('font-weight')?.addEventListener('change', () => {
    component.style.fontWeight = get<HTMLSelectElement>('font-weight')!.value;
    captureStateDebounced();
  });

  get<HTMLSelectElement>('font-family')?.addEventListener('change', () => {
    component.style.fontFamily = get<HTMLSelectElement>('font-family')!.value;
    captureStateDebounced();
  });

  /* ── Text color — two-way sync ───────────────────────────────────────────── */
  get<HTMLInputElement>('text-color')?.addEventListener('input', () => {
    const val = get<HTMLInputElement>('text-color')!.value;
    component.style.color = val;
    const hexInput = get<HTMLInputElement>('text-color-value');
    if (hexInput) hexInput.value = val;
    captureStateDebounced();
  });

  get<HTMLInputElement>('text-color-value')?.addEventListener('input', e => {
    const val = (e.target as HTMLInputElement).value;
    component.style.color = val;
    const picker = get<HTMLInputElement>('text-color');
    if (picker) picker.value = val;
    captureStateDebounced();
  });

  /* ── Border ──────────────────────────────────────────────────────────────── */
  get<HTMLInputElement>('border-width')?.addEventListener('input', () => {
    const unit = get<HTMLSelectElement>('border-width-unit')?.value || 'px';
    component.style.borderWidth = `${get<HTMLInputElement>('border-width')!.value}${unit}`;
    captureStateDebounced();
  });

  get<HTMLSelectElement>('border-style')?.addEventListener('change', () => {
    component.style.borderStyle = get<HTMLSelectElement>('border-style')!.value;
    captureStateDebounced();
  });

  get<HTMLInputElement>('border-color')?.addEventListener('input', () => {
    const val = get<HTMLInputElement>('border-color')!.value;
    component.style.borderColor = val;
    const hexInput = get<HTMLInputElement>('border-color-value');
    if (hexInput) hexInput.value = val;
    captureStateDebounced();
  });

  get<HTMLInputElement>('border-color-value')?.addEventListener('input', e => {
    const val = (e.target as HTMLInputElement).value;
    component.style.borderColor = val;
    const picker = get<HTMLInputElement>('border-color');
    if (picker) picker.value = val;
    captureStateDebounced();
  });

  /* ── Display — special inline→inline-block mapping + re-populate ─────────── */
  get<HTMLSelectElement>('display')?.addEventListener('change', () => {
    const selectedValue = get<HTMLSelectElement>('display')!.value;

    if (selectedValue === 'inline') {
      /* Store user intent as "inline" but apply inline-block to the DOM.
         Pure inline ignores width/height/vertical spacing in the builder. */
      component.style.display = 'inline-block';
      component.dataset.displayIntent = 'inline';
    } else {
      component.style.display = selectedValue;
      /* Clear the intent flag for all non-inline selections */
      delete component.dataset.displayIntent;
    }

    captureStateDebounced();
    /* Defer re-populate so the inline style is committed before being read back */
    requestAnimationFrame(() =>
      populateCssControls(
        component,
        controlsContainer,
        addListenersFn,
        customizeComponentTagName
      )
    );
  });

  /* ── Flex sub-controls ───────────────────────────────────────────────────── */
  get<HTMLSelectElement>('flex-direction')?.addEventListener('change', () => {
    component.style.flexDirection =
      get<HTMLSelectElement>('flex-direction')!.value;
    captureStateDebounced();
  });

  get<HTMLSelectElement>('align-items')?.addEventListener('change', () => {
    component.style.alignItems = get<HTMLSelectElement>('align-items')!.value;
    captureStateDebounced();
  });

  get<HTMLSelectElement>('justify-content')?.addEventListener('change', () => {
    component.style.justifyContent =
      get<HTMLSelectElement>('justify-content')!.value;
    captureStateDebounced();
  });
}
