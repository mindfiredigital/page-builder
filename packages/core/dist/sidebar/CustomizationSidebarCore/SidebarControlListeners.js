import { Canvas } from '../../canvas/Canvas.js';
import { debounce } from '../../utils/utilityFunctions.js';
import { populateCssControls } from './SidebarCssControls.js';
/* Attaches every CSS-property change/input listener to the sidebar controls */
export function addControlListeners(
  component,
  controlsContainer,
  addListenersFn /* recursive ref for re-populate */,
  customizeComponentTagName
) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
  /* Single debounced handler shared by all controls to batch history captures */
  const captureStateDebounced = debounce(() => {
    Canvas.dispatchDesignChange();
    Canvas.historyManager.captureState();
  }, 300);
  const get = id => document.getElementById(id);
  /* ── Dimensions ──────────────────────────────────────────────────────────── */
  (_a = get('width')) === null || _a === void 0
    ? void 0
    : _a.addEventListener('input', () => {
        var _a;
        const unit =
          ((_a = get('width-unit')) === null || _a === void 0
            ? void 0
            : _a.value) || 'px';
        component.style.width = `${get('width').value}${unit}`;
        captureStateDebounced();
      });
  (_b = get('height')) === null || _b === void 0
    ? void 0
    : _b.addEventListener('input', () => {
        var _a;
        const unit =
          ((_a = get('height-unit')) === null || _a === void 0
            ? void 0
            : _a.value) || 'px';
        component.style.height = `${get('height').value}${unit}`;
        captureStateDebounced();
      });
  /* ── Background color — two-way sync between picker and hex input ───────── */
  (_c = get('background-color')) === null || _c === void 0
    ? void 0
    : _c.addEventListener('input', () => {
        const val = get('background-color').value;
        component.style.backgroundColor = val;
        const hexInput = get('background-color-value');
        if (hexInput) hexInput.value = val;
        captureStateDebounced();
      });
  (_d = get('background-color-value')) === null || _d === void 0
    ? void 0
    : _d.addEventListener('input', e => {
        const val = e.target.value;
        component.style.backgroundColor = val;
        const picker = get('background-color');
        if (picker) picker.value = val;
        captureStateDebounced();
      });
  /* ── Spacing ─────────────────────────────────────────────────────────────── */
  /* Margin — all sides: capture element refs once so the handler never re-queries */
  const marginInput = get('margin');
  const marginUnitSel = get('margin-unit');
  if (marginInput) {
    const applyMarginAll = () => {
      const val = marginInput.value || '0';
      const unit =
        (marginUnitSel === null || marginUnitSel === void 0
          ? void 0
          : marginUnitSel.value) || 'px';
      /* Clear individual overrides first so the shorthand is never shadowed */
      component.style.marginTop = '';
      component.style.marginRight = '';
      component.style.marginBottom = '';
      component.style.marginLeft = '';
      component.style.margin = `${val}${unit}`;
      captureStateDebounced();
    };
    marginInput.addEventListener('input', applyMarginAll);
    marginUnitSel === null || marginUnitSel === void 0
      ? void 0
      : marginUnitSel.addEventListener('change', applyMarginAll);
  }
  /* Margin — individual sides */
  ['top', 'right', 'bottom', 'left'].forEach(side => {
    const sideInput = get(`margin-${side}`);
    const sideUnit = get(`margin-${side}-unit`);
    const prop = `margin${side.charAt(0).toUpperCase()}${side.slice(1)}`;
    if (sideInput) {
      const apply = () => {
        const unit =
          (sideUnit === null || sideUnit === void 0
            ? void 0
            : sideUnit.value) || 'px';
        component.style[prop] = `${sideInput.value || '0'}${unit}`;
        captureStateDebounced();
      };
      sideInput.addEventListener('input', apply);
      sideUnit === null || sideUnit === void 0
        ? void 0
        : sideUnit.addEventListener('change', apply);
    }
  });
  /* Padding — all sides */
  const paddingInput = get('padding');
  const paddingUnitSel = get('padding-unit');
  if (paddingInput) {
    const applyPaddingAll = () => {
      const val = paddingInput.value || '0';
      const unit =
        (paddingUnitSel === null || paddingUnitSel === void 0
          ? void 0
          : paddingUnitSel.value) || 'px';
      component.style.paddingTop = '';
      component.style.paddingRight = '';
      component.style.paddingBottom = '';
      component.style.paddingLeft = '';
      component.style.padding = `${val}${unit}`;
      captureStateDebounced();
    };
    paddingInput.addEventListener('input', applyPaddingAll);
    paddingUnitSel === null || paddingUnitSel === void 0
      ? void 0
      : paddingUnitSel.addEventListener('change', applyPaddingAll);
  }
  /* Padding — individual sides */
  ['top', 'right', 'bottom', 'left'].forEach(side => {
    const sideInput = get(`padding-${side}`);
    const sideUnit = get(`padding-${side}-unit`);
    const prop = `padding${side.charAt(0).toUpperCase()}${side.slice(1)}`;
    if (sideInput) {
      const apply = () => {
        const unit =
          (sideUnit === null || sideUnit === void 0
            ? void 0
            : sideUnit.value) || 'px';
        component.style[prop] = `${sideInput.value || '0'}${unit}`;
        captureStateDebounced();
      };
      sideInput.addEventListener('input', apply);
      sideUnit === null || sideUnit === void 0
        ? void 0
        : sideUnit.addEventListener('change', apply);
    }
  });
  /* ── Typography ──────────────────────────────────────────────────────────── */
  (_e = get('alignment')) === null || _e === void 0
    ? void 0
    : _e.addEventListener('change', () => {
        component.style.textAlign = get('alignment').value;
        captureStateDebounced();
      });
  (_f = get('font-size')) === null || _f === void 0
    ? void 0
    : _f.addEventListener('input', () => {
        var _a;
        const unit =
          ((_a = get('font-size-unit')) === null || _a === void 0
            ? void 0
            : _a.value) || 'px';
        component.style.fontSize = `${get('font-size').value}${unit}`;
        captureStateDebounced();
      });
  (_g = get('font-weight')) === null || _g === void 0
    ? void 0
    : _g.addEventListener('change', () => {
        component.style.fontWeight = get('font-weight').value;
        captureStateDebounced();
      });
  (_h = get('font-family')) === null || _h === void 0
    ? void 0
    : _h.addEventListener('change', () => {
        component.style.fontFamily = get('font-family').value;
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
  let savedRange = null;
  /* Tracks the <span> created for the current picker session so that
       dragging the hue/saturation slider updates the same span instead of
       falling back to component.style.color on every subsequent input event. */
  let activeColorSpan = null;
  /**
   * Saves the current selection if it is non-collapsed and inside `component`.
   * Only starts a fresh session (resets activeColorSpan) when the selection
   * anchor is OUTSIDE activeColorSpan — a selection that sits inside it means
   * we just restored it programmatically after a color change, so we leave the
   * span reference intact.
   */
  function saveSelectionInsideComponent() {
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
  function restoreVisualSelection(span) {
    const editableEl = component.querySelector('[contenteditable="true"]');
    if (!editableEl) return;
    editableEl.focus({ preventScroll: true });
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(span);
    sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
    sel === null || sel === void 0 ? void 0 : sel.addRange(range);
  }
  /**
   * Applies `color` to either:
   *   1. The activeColorSpan from this session (update in place — no new span),
   *   2. The savedRange, wrapping selected text in a new <span>, or
   *   3. The entire component as a fallback when there is no selection.
   */
  function applyTextColor(color) {
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
      } catch (_a) {
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
  const textColorPicker = get('text-color');
  const textColorHex = get('text-color-value');
  /* Capture selection before the picker steals focus */
  textColorPicker === null || textColorPicker === void 0
    ? void 0
    : textColorPicker.addEventListener(
        'mousedown',
        saveSelectionInsideComponent
      );
  textColorHex === null || textColorHex === void 0
    ? void 0
    : textColorHex.addEventListener('mousedown', saveSelectionInsideComponent);
  textColorPicker === null || textColorPicker === void 0
    ? void 0
    : textColorPicker.addEventListener('input', () => {
        const val = textColorPicker.value;
        applyTextColor(val);
        if (textColorHex) textColorHex.value = val;
        captureStateDebounced();
      });
  textColorHex === null || textColorHex === void 0
    ? void 0
    : textColorHex.addEventListener('input', e => {
        const val = e.target.value;
        applyTextColor(val);
        if (textColorPicker) textColorPicker.value = val;
        captureStateDebounced();
      });
  /* ── Border ──────────────────────────────────────────────────────────────── */
  (_j = get('border-width')) === null || _j === void 0
    ? void 0
    : _j.addEventListener('input', () => {
        var _a;
        const unit =
          ((_a = get('border-width-unit')) === null || _a === void 0
            ? void 0
            : _a.value) || 'px';
        component.style.borderWidth = `${get('border-width').value}${unit}`;
        captureStateDebounced();
      });
  (_k = get('border-style')) === null || _k === void 0
    ? void 0
    : _k.addEventListener('change', () => {
        component.style.borderStyle = get('border-style').value;
        captureStateDebounced();
      });
  (_l = get('border-color')) === null || _l === void 0
    ? void 0
    : _l.addEventListener('input', () => {
        const val = get('border-color').value;
        component.style.borderColor = val;
        const hexInput = get('border-color-value');
        if (hexInput) hexInput.value = val;
        captureStateDebounced();
      });
  (_m = get('border-color-value')) === null || _m === void 0
    ? void 0
    : _m.addEventListener('input', e => {
        const val = e.target.value;
        component.style.borderColor = val;
        const picker = get('border-color');
        if (picker) picker.value = val;
        captureStateDebounced();
      });
  (_o = get('border-radius')) === null || _o === void 0
    ? void 0
    : _o.addEventListener('input', () => {
        var _a;
        const unit =
          ((_a = get('border-radius-unit')) === null || _a === void 0
            ? void 0
            : _a.value) || 'px';
        component.style.borderRadius = `${get('border-radius').value}${unit}`;
        captureStateDebounced();
      });
  /* ── Display — special inline→inline-block mapping + re-populate ─────────── */
  (_p = get('display')) === null || _p === void 0
    ? void 0
    : _p.addEventListener('change', () => {
        const selectedValue = get('display').value;
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
  (_q = get('flex-direction')) === null || _q === void 0
    ? void 0
    : _q.addEventListener('change', () => {
        component.style.flexDirection = get('flex-direction').value;
        captureStateDebounced();
      });
  (_r = get('align-items')) === null || _r === void 0
    ? void 0
    : _r.addEventListener('change', () => {
        component.style.alignItems = get('align-items').value;
        captureStateDebounced();
      });
  (_s = get('justify-content')) === null || _s === void 0
    ? void 0
    : _s.addEventListener('change', () => {
        component.style.justifyContent = get('justify-content').value;
        captureStateDebounced();
      });
}
