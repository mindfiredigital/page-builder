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
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
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
  /* ── Text color — two-way sync ───────────────────────────────────────────── */
  (_j = get('text-color')) === null || _j === void 0
    ? void 0
    : _j.addEventListener('input', () => {
        const val = get('text-color').value;
        component.style.color = val;
        const hexInput = get('text-color-value');
        if (hexInput) hexInput.value = val;
        captureStateDebounced();
      });
  (_k = get('text-color-value')) === null || _k === void 0
    ? void 0
    : _k.addEventListener('input', e => {
        const val = e.target.value;
        component.style.color = val;
        const picker = get('text-color');
        if (picker) picker.value = val;
        captureStateDebounced();
      });
  /* ── Border ──────────────────────────────────────────────────────────────── */
  (_l = get('border-width')) === null || _l === void 0
    ? void 0
    : _l.addEventListener('input', () => {
        var _a;
        const unit =
          ((_a = get('border-width-unit')) === null || _a === void 0
            ? void 0
            : _a.value) || 'px';
        component.style.borderWidth = `${get('border-width').value}${unit}`;
        captureStateDebounced();
      });
  (_m = get('border-style')) === null || _m === void 0
    ? void 0
    : _m.addEventListener('change', () => {
        component.style.borderStyle = get('border-style').value;
        captureStateDebounced();
      });
  (_o = get('border-color')) === null || _o === void 0
    ? void 0
    : _o.addEventListener('input', () => {
        const val = get('border-color').value;
        component.style.borderColor = val;
        const hexInput = get('border-color-value');
        if (hexInput) hexInput.value = val;
        captureStateDebounced();
      });
  (_p = get('border-color-value')) === null || _p === void 0
    ? void 0
    : _p.addEventListener('input', e => {
        const val = e.target.value;
        component.style.borderColor = val;
        const picker = get('border-color');
        if (picker) picker.value = val;
        captureStateDebounced();
      });
  /* ── Display — special inline→inline-block mapping + re-populate ─────────── */
  (_q = get('display')) === null || _q === void 0
    ? void 0
    : _q.addEventListener('change', () => {
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
  (_r = get('flex-direction')) === null || _r === void 0
    ? void 0
    : _r.addEventListener('change', () => {
        component.style.flexDirection = get('flex-direction').value;
        captureStateDebounced();
      });
  (_s = get('align-items')) === null || _s === void 0
    ? void 0
    : _s.addEventListener('change', () => {
        component.style.alignItems = get('align-items').value;
        captureStateDebounced();
      });
  (_t = get('justify-content')) === null || _t === void 0
    ? void 0
    : _t.addEventListener('change', () => {
        component.style.justifyContent = get('justify-content').value;
        captureStateDebounced();
      });
}
