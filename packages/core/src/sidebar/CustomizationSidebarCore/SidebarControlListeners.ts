import { Canvas } from '../../canvas/Canvas';
import { debounce } from '../../utils/utilityFunctions';
import { populateCssControls } from './SidebarCssControls';

type Getter = <T extends HTMLElement>(id: string) => T | null;
type AddListenersFn = (component: HTMLElement) => void;

function attachDimensionListeners(
  component: HTMLElement,
  get: Getter,
  captureStateDebounced: () => void
): void {
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
}

function attachImageAltTextListener(
  component: HTMLElement,
  get: Getter,
  captureStateDebounced: () => void
): void {
  get<HTMLInputElement>('image-alt-text')?.addEventListener('input', () => {
    const img = component.querySelector('img');
    if (img) img.alt = get<HTMLInputElement>('image-alt-text')!.value;
    captureStateDebounced();
  });
}

function attachBackgroundColorListeners(
  component: HTMLElement,
  get: Getter,
  captureStateDebounced: () => void
): void {
  /* Background color — two-way sync between picker and hex input */
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
}

function attachSpacingListeners(
  component: HTMLElement,
  get: Getter,
  captureStateDebounced: () => void
): void {
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
}

function attachAlignmentListener(
  component: HTMLElement,
  get: Getter,
  captureStateDebounced: () => void
): void {
  get<HTMLSelectElement>('alignment')?.addEventListener('change', () => {
    const val = get<HTMLSelectElement>('alignment')!.value;
    component.style.textAlign = val;
    component.querySelectorAll<HTMLElement>('.rt-block-content').forEach(el => {
      el.style.textAlign = val;
    });
    captureStateDebounced();
  });
}

/* ── Font size — selection-aware ────────────────────────────────────────────
 *
 * Same mechanism as text color:
 *   • Capture the Range on 'mousedown' (before the input steals focus).
 *   • On 'input', if a saved range is non-collapsed and inside the component,
 *     wrap it in <span style="font-size: …"> instead of painting the whole
 *     component.  Subsequent changes update the same span (activeFontSizeSpan)
 *     so the value tracks the slider without creating duplicate wraps.
 * ─────────────────────────────────────────────────────────────────────────── */
function attachFontSizeListeners(
  component: HTMLElement,
  get: Getter,
  captureStateDebounced: () => void
): void {
  let savedRangeFS: Range | null = null;
  let activeFontSizeSpan: HTMLSpanElement | null = null;

  function saveSelectionForFontSize(): void {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    if (!component.contains(range.commonAncestorContainer)) return;
    savedRangeFS = range.cloneRange();
    if (
      !activeFontSizeSpan ||
      !activeFontSizeSpan.contains(range.commonAncestorContainer)
    ) {
      activeFontSizeSpan = null;
    }
  }

  function restoreVisualSelectionFS(span: HTMLSpanElement): void {
    const editableEl =
      span.closest<HTMLElement>('[contenteditable="true"]') ??
      component.querySelector<HTMLElement>('[contenteditable="true"]');
    if (!editableEl) return;
    editableEl.focus({ preventScroll: true });
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(span);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  function applyFontSize(size: string): void {
    if (activeFontSizeSpan && component.contains(activeFontSizeSpan)) {
      activeFontSizeSpan.style.fontSize = size;
      restoreVisualSelectionFS(activeFontSizeSpan);
      return;
    }
    if (savedRangeFS && !savedRangeFS.collapsed) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeFS);
      }
      const span = document.createElement('span');
      span.style.fontSize = size;
      try {
        savedRangeFS.surroundContents(span);
      } catch {
        const fragment = savedRangeFS.extractContents();
        span.appendChild(fragment);
        savedRangeFS.insertNode(span);
      }
      activeFontSizeSpan = span;
      savedRangeFS = null;
      restoreVisualSelectionFS(span);
      return;
    }
    /* Fallback — no selection, apply to whole component + inner rt blocks */
    component.style.fontSize = size;
    component.querySelectorAll<HTMLElement>('.rt-block-content').forEach(el => {
      el.style.fontSize = size;
    });
  }

  const fontSizeInput = get<HTMLInputElement>('font-size');
  const fontSizeUnit = get<HTMLSelectElement>('font-size-unit');

  fontSizeInput?.addEventListener('mousedown', saveSelectionForFontSize);

  fontSizeInput?.addEventListener('input', () => {
    if (!fontSizeInput) return;
    const unit = fontSizeUnit?.value || 'px';
    applyFontSize(`${fontSizeInput.value}${unit}`);
    captureStateDebounced();
  });

  fontSizeUnit?.addEventListener('change', () => {
    if (!fontSizeInput) return;
    const unit = fontSizeUnit?.value || 'px';
    applyFontSize(`${fontSizeInput.value}${unit}`);
    captureStateDebounced();
  });
}

/* ── Font weight — selection-aware ──────────────────────────────────────────
 *
 * Same mechanism as font size above.
 * ─────────────────────────────────────────────────────────────────────────── */
function attachFontWeightListeners(
  component: HTMLElement,
  get: Getter,
  captureStateDebounced: () => void
): void {
  let savedRangeFW: Range | null = null;
  let activeFontWeightSpan: HTMLSpanElement | null = null;

  function saveSelectionForFontWeight(): void {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    if (!component.contains(range.commonAncestorContainer)) return;
    savedRangeFW = range.cloneRange();
    if (
      !activeFontWeightSpan ||
      !activeFontWeightSpan.contains(range.commonAncestorContainer)
    ) {
      activeFontWeightSpan = null;
    }
  }

  function restoreVisualSelectionFW(span: HTMLSpanElement): void {
    const editableEl =
      span.closest<HTMLElement>('[contenteditable="true"]') ??
      component.querySelector<HTMLElement>('[contenteditable="true"]');
    if (!editableEl) return;
    editableEl.focus({ preventScroll: true });
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(span);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  function applyFontWeight(weight: string): void {
    if (activeFontWeightSpan && component.contains(activeFontWeightSpan)) {
      activeFontWeightSpan.style.fontWeight = weight;
      restoreVisualSelectionFW(activeFontWeightSpan);
      return;
    }
    if (savedRangeFW && !savedRangeFW.collapsed) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeFW);
      }
      const span = document.createElement('span');
      span.style.fontWeight = weight;
      try {
        savedRangeFW.surroundContents(span);
      } catch {
        const fragment = savedRangeFW.extractContents();
        span.appendChild(fragment);
        savedRangeFW.insertNode(span);
      }
      activeFontWeightSpan = span;
      savedRangeFW = null;
      restoreVisualSelectionFW(span);
      return;
    }
    /* Fallback — no selection, apply to whole component + inner rt blocks */
    component.style.fontWeight = weight;
    component.querySelectorAll<HTMLElement>('.rt-block-content').forEach(el => {
      el.style.fontWeight = weight;
    });
  }

  const fontWeightSel = get<HTMLSelectElement>('font-weight');

  fontWeightSel?.addEventListener('mousedown', saveSelectionForFontWeight);

  fontWeightSel?.addEventListener('change', () => {
    if (!fontWeightSel) return;
    applyFontWeight(fontWeightSel.value);
    captureStateDebounced();
  });
}

function attachFontFamilyListener(
  component: HTMLElement,
  get: Getter,
  captureStateDebounced: () => void
): void {
  get<HTMLSelectElement>('font-family')?.addEventListener('change', () => {
    const val = get<HTMLSelectElement>('font-family')!.value;
    component.style.fontFamily = val;
    component.querySelectorAll<HTMLElement>('.rt-block-content').forEach(el => {
      el.style.fontFamily = val;
    });
    captureStateDebounced();
  });
}

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
function attachTextColorListeners(
  component: HTMLElement,
  get: Getter,
  captureStateDebounced: () => void
): void {
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
    const editableEl =
      span.closest<HTMLElement>('[contenteditable="true"]') ??
      component.querySelector<HTMLElement>('[contenteditable="true"]');
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

    /* Case 3: no selection — colour the whole component + inner rt blocks */
    component.style.color = color;
    component.querySelectorAll<HTMLElement>('.rt-block-content').forEach(el => {
      el.style.color = color;
    });
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
}

function attachBorderListeners(
  component: HTMLElement,
  get: Getter,
  captureStateDebounced: () => void
): void {
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

  get<HTMLInputElement>('border-radius')?.addEventListener('input', () => {
    const unit = get<HTMLSelectElement>('border-radius-unit')?.value || 'px';
    component.style.borderRadius = `${get<HTMLInputElement>('border-radius')!.value}${unit}`;
    captureStateDebounced();
  });
}

function attachDisplayListener(
  component: HTMLElement,
  controlsContainer: HTMLElement,
  addListenersFn: AddListenersFn,
  customizeComponentTagName: string | undefined,
  get: Getter,
  captureStateDebounced: () => void
): void {
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
}

function attachFlexSubControlListeners(
  component: HTMLElement,
  get: Getter,
  captureStateDebounced: () => void
): void {
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

/* Attaches every CSS-property change/input listener to the sidebar controls */
export function addControlListeners(
  component: HTMLElement,
  controlsContainer: HTMLElement,
  addListenersFn: AddListenersFn /* recursive ref for re-populate */,
  customizeComponentTagName?: string
): void {
  /* Single debounced handler shared by all controls to batch history captures */
  const captureStateDebounced = debounce(() => {
    Canvas.dispatchDesignChange();
    Canvas.historyManager.captureState();
  }, 300);

  const get: Getter = <T extends HTMLElement>(id: string) =>
    document.getElementById(id) as T | null;

  attachDimensionListeners(component, get, captureStateDebounced);
  attachImageAltTextListener(component, get, captureStateDebounced);
  attachBackgroundColorListeners(component, get, captureStateDebounced);
  attachSpacingListeners(component, get, captureStateDebounced);
  attachAlignmentListener(component, get, captureStateDebounced);
  attachFontSizeListeners(component, get, captureStateDebounced);
  attachFontWeightListeners(component, get, captureStateDebounced);
  attachFontFamilyListener(component, get, captureStateDebounced);
  attachTextColorListeners(component, get, captureStateDebounced);
  attachBorderListeners(component, get, captureStateDebounced);
  attachDisplayListener(
    component,
    controlsContainer,
    addListenersFn,
    customizeComponentTagName,
    get,
    captureStateDebounced
  );
  attachFlexSubControlListeners(component, get, captureStateDebounced);
}
