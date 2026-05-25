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

  /* ── Text color — selection-aware ───────────────────────────────────────────
   *
   * Problem: clicking the color picker input causes the component to lose
   * focus, which clears window.getSelection(). By the time the 'input' event
   * fires the selection is gone, so we can't know what text the user had
   * highlighted.
   *
   * Fix: capture the Range on 'mousedown' (before focus moves to the picker).
   * On 'input', if the saved range is non-collapsed AND sits inside the
   * component, wrap it in a <span style="color: …"> instead of painting the
   * whole component. If there is no selection, fall back to the original
   * whole-component behaviour so the control keeps working normally.
   * ──────────────────────────────────────────────────────────────────────── */

  let savedRange: Range | null = null;
  /* Tracks the <span> created for the current picker session so that
     dragging the hue/saturation slider updates the same span instead of
     falling back to component.style.color on every subsequent input event. */
  let activeColorSpan: HTMLSpanElement | null = null;

  /**
   * Saves the current selection if it is non-collapsed and inside `component`.
   * Only starts a fresh session (resets activeColorSpan) when the selection
   * anchor is OUTSIDE activeColorSpan — a selection that sits inside it means
   * we just restored it programmatically after a color change, so we leave the
   * span reference intact.
   */
  function saveSelectionInsideComponent(): void {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    if (!component.contains(range.commonAncestorContainer)) return;

    savedRange = range.cloneRange();

    /* New user selection outside the active span → fresh session */
    if (
      !activeColorSpan ||
      !activeColorSpan.contains(range.commonAncestorContainer)
    ) {
      activeColorSpan = null;
    }
  }

  /**
   * Re-focuses the contenteditable child and selects the span's contents so
   * the colored text stays visually highlighted while the user drags the
   * color picker slider.
   */
  function restoreVisualSelection(span: HTMLSpanElement): void {
    const editableEl = component.querySelector<HTMLElement>(
      '[contenteditable="true"]'
    );
    if (!editableEl) return;
    editableEl.focus({ preventScroll: true });
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(span);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  /**
   * Applies `color` to either:
   *   1. The activeColorSpan from this session (update in place — no new span),
   *   2. The savedRange, wrapping selected text in a new <span>, or
   *   3. The entire component as a fallback when there is no selection.
   */
  function applyTextColor(color: string): void {
    /* Case 1: span already created — just update its color and re-highlight */
    if (activeColorSpan && component.contains(activeColorSpan)) {
      activeColorSpan.style.color = color;
      restoreVisualSelection(activeColorSpan);
      return;
    }

    /* Case 2: first application — wrap the saved range in a color span */
    if (savedRange && !savedRange.collapsed) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRange);
      }

      const span = document.createElement('span');
      span.style.color = color;

      try {
        savedRange.surroundContents(span);
      } catch {
        const fragment = savedRange.extractContents();
        span.appendChild(fragment);
        savedRange.insertNode(span);
      }

      activeColorSpan = span;
      savedRange = null;
      restoreVisualSelection(span);
      return;
    }

    /* Case 3: no selection — colour the whole component */
    component.style.color = color;
  }

  const textColorPicker = get<HTMLInputElement>('text-color');
  const textColorHex = get<HTMLInputElement>('text-color-value');

  /* Capture selection before the picker steals focus */
  textColorPicker?.addEventListener('mousedown', saveSelectionInsideComponent);
  textColorHex?.addEventListener('mousedown', saveSelectionInsideComponent);

  textColorPicker?.addEventListener('input', () => {
    const val = textColorPicker.value;
    applyTextColor(val);
    if (textColorHex) textColorHex.value = val;
    captureStateDebounced();
  });

  textColorHex?.addEventListener('input', e => {
    const val = (e.target as HTMLInputElement).value;
    applyTextColor(val);
    if (textColorPicker) textColorPicker.value = val;
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
