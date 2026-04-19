import { Canvas } from '../../canvas/Canvas.js';
import { debounce } from '../../utils/utilityFunctions.js';
import { populateCssControls } from './SidebarCssControls.js';
/* Attaches every CSS-property change/input listener to the sidebar controls */
export function addControlListeners(
  component,
  controlsContainer,
  addListenersFn /* recursive ref for re-populate */
) {
  var _a,
    _b,
    _c,
    _d,
    _e,
    _f,
    _g,
    _h,
    _j,
    _k,
    _l,
    _m,
    _o,
    _p,
    _q,
    _r,
    _s,
    _t,
    _u,
    _v;
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
  (_e = get('margin')) === null || _e === void 0
    ? void 0
    : _e.addEventListener('input', () => {
        var _a;
        const unit =
          ((_a = get('margin-unit')) === null || _a === void 0
            ? void 0
            : _a.value) || 'px';
        component.style.margin = `${get('margin').value}${unit}`;
        captureStateDebounced();
      });
  (_f = get('padding')) === null || _f === void 0
    ? void 0
    : _f.addEventListener('input', () => {
        var _a;
        const unit =
          ((_a = get('padding-unit')) === null || _a === void 0
            ? void 0
            : _a.value) || 'px';
        component.style.padding = `${get('padding').value}${unit}`;
        captureStateDebounced();
      });
  /* ── Typography ──────────────────────────────────────────────────────────── */
  (_g = get('alignment')) === null || _g === void 0
    ? void 0
    : _g.addEventListener('change', () => {
        component.style.textAlign = get('alignment').value;
        captureStateDebounced();
      });
  (_h = get('font-size')) === null || _h === void 0
    ? void 0
    : _h.addEventListener('input', () => {
        var _a;
        const unit =
          ((_a = get('font-size-unit')) === null || _a === void 0
            ? void 0
            : _a.value) || 'px';
        component.style.fontSize = `${get('font-size').value}${unit}`;
        captureStateDebounced();
      });
  (_j = get('font-weight')) === null || _j === void 0
    ? void 0
    : _j.addEventListener('change', () => {
        component.style.fontWeight = get('font-weight').value;
        captureStateDebounced();
      });
  (_k = get('font-family')) === null || _k === void 0
    ? void 0
    : _k.addEventListener('change', () => {
        component.style.fontFamily = get('font-family').value;
        captureStateDebounced();
      });
  /* ── Text color — two-way sync ───────────────────────────────────────────── */
  (_l = get('text-color')) === null || _l === void 0
    ? void 0
    : _l.addEventListener('input', () => {
        const val = get('text-color').value;
        component.style.color = val;
        const hexInput = get('text-color-value');
        if (hexInput) hexInput.value = val;
        captureStateDebounced();
      });
  (_m = get('text-color-value')) === null || _m === void 0
    ? void 0
    : _m.addEventListener('input', e => {
        const val = e.target.value;
        component.style.color = val;
        const picker = get('text-color');
        if (picker) picker.value = val;
        captureStateDebounced();
      });
  /* ── Border ──────────────────────────────────────────────────────────────── */
  (_o = get('border-width')) === null || _o === void 0
    ? void 0
    : _o.addEventListener('input', () => {
        var _a;
        const unit =
          ((_a = get('border-width-unit')) === null || _a === void 0
            ? void 0
            : _a.value) || 'px';
        component.style.borderWidth = `${get('border-width').value}${unit}`;
        captureStateDebounced();
      });
  (_p = get('border-style')) === null || _p === void 0
    ? void 0
    : _p.addEventListener('change', () => {
        component.style.borderStyle = get('border-style').value;
        captureStateDebounced();
      });
  (_q = get('border-color')) === null || _q === void 0
    ? void 0
    : _q.addEventListener('input', () => {
        const val = get('border-color').value;
        component.style.borderColor = val;
        const hexInput = get('border-color-value');
        if (hexInput) hexInput.value = val;
        captureStateDebounced();
      });
  (_r = get('border-color-value')) === null || _r === void 0
    ? void 0
    : _r.addEventListener('input', e => {
        const val = e.target.value;
        component.style.borderColor = val;
        const picker = get('border-color');
        if (picker) picker.value = val;
        captureStateDebounced();
      });
  /* ── Display — special inline→inline-block mapping + re-populate ─────────── */
  (_s = get('display')) === null || _s === void 0
    ? void 0
    : _s.addEventListener('change', () => {
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
          populateCssControls(component, controlsContainer, addListenersFn)
        );
      });
  /* ── Flex sub-controls ───────────────────────────────────────────────────── */
  (_t = get('flex-direction')) === null || _t === void 0
    ? void 0
    : _t.addEventListener('change', () => {
        component.style.flexDirection = get('flex-direction').value;
        captureStateDebounced();
      });
  (_u = get('align-items')) === null || _u === void 0
    ? void 0
    : _u.addEventListener('change', () => {
        component.style.alignItems = get('align-items').value;
        captureStateDebounced();
      });
  (_v = get('justify-content')) === null || _v === void 0
    ? void 0
    : _v.addEventListener('change', () => {
        component.style.justifyContent = get('justify-content').value;
        captureStateDebounced();
      });
}
