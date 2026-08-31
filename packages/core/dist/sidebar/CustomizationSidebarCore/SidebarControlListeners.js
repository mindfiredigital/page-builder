import { Canvas } from '../../canvas/Canvas.js';
import { debounce } from '../../utils/utilityFunctions.js';
import { populateCssControls } from './SidebarCssControls.js';
function attachDimensionListeners(component, get, captureStateDebounced) {
    var _a, _b;
    (_a = get('width')) === null || _a === void 0 ? void 0 : _a.addEventListener('input', () => {
        var _a;
        const unit = ((_a = get('width-unit')) === null || _a === void 0 ? void 0 : _a.value) || 'px';
        component.style.width = `${get('width').value}${unit}`;
        captureStateDebounced();
    });
    (_b = get('height')) === null || _b === void 0 ? void 0 : _b.addEventListener('input', () => {
        var _a;
        const unit = ((_a = get('height-unit')) === null || _a === void 0 ? void 0 : _a.value) || 'px';
        component.style.height = `${get('height').value}${unit}`;
        captureStateDebounced();
    });
}
function attachImageAltTextListener(component, get, captureStateDebounced) {
    var _a;
    (_a = get('image-alt-text')) === null || _a === void 0 ? void 0 : _a.addEventListener('input', () => {
        const img = component.querySelector('img');
        if (img)
            img.alt = get('image-alt-text').value;
        captureStateDebounced();
    });
}
function attachBackgroundColorListeners(component, get, captureStateDebounced) {
    var _a, _b;
    /* Background color — two-way sync between picker and hex input */
    (_a = get('background-color')) === null || _a === void 0 ? void 0 : _a.addEventListener('input', () => {
        const val = get('background-color').value;
        component.style.backgroundColor = val;
        const hexInput = get('background-color-value');
        if (hexInput)
            hexInput.value = val;
        captureStateDebounced();
    });
    (_b = get('background-color-value')) === null || _b === void 0 ? void 0 : _b.addEventListener('input', e => {
        const val = e.target.value;
        component.style.backgroundColor = val;
        const picker = get('background-color');
        if (picker)
            picker.value = val;
        captureStateDebounced();
    });
}
function attachSpacingListeners(component, get, captureStateDebounced) {
    /* Margin — all sides: capture element refs once so the handler never re-queries */
    const marginInput = get('margin');
    const marginUnitSel = get('margin-unit');
    if (marginInput) {
        const applyMarginAll = () => {
            const val = marginInput.value || '0';
            const unit = (marginUnitSel === null || marginUnitSel === void 0 ? void 0 : marginUnitSel.value) || 'px';
            /* Clear individual overrides first so the shorthand is never shadowed */
            component.style.marginTop = '';
            component.style.marginRight = '';
            component.style.marginBottom = '';
            component.style.marginLeft = '';
            component.style.margin = `${val}${unit}`;
            captureStateDebounced();
        };
        marginInput.addEventListener('input', applyMarginAll);
        marginUnitSel === null || marginUnitSel === void 0 ? void 0 : marginUnitSel.addEventListener('change', applyMarginAll);
    }
    /* Margin — individual sides */
    ['top', 'right', 'bottom', 'left'].forEach(side => {
        const sideInput = get(`margin-${side}`);
        const sideUnit = get(`margin-${side}-unit`);
        const prop = `margin${side.charAt(0).toUpperCase()}${side.slice(1)}`;
        if (sideInput) {
            const apply = () => {
                const unit = (sideUnit === null || sideUnit === void 0 ? void 0 : sideUnit.value) || 'px';
                component.style[prop] =
                    `${sideInput.value || '0'}${unit}`;
                captureStateDebounced();
            };
            sideInput.addEventListener('input', apply);
            sideUnit === null || sideUnit === void 0 ? void 0 : sideUnit.addEventListener('change', apply);
        }
    });
    /* Padding — all sides */
    const paddingInput = get('padding');
    const paddingUnitSel = get('padding-unit');
    if (paddingInput) {
        const applyPaddingAll = () => {
            const val = paddingInput.value || '0';
            const unit = (paddingUnitSel === null || paddingUnitSel === void 0 ? void 0 : paddingUnitSel.value) || 'px';
            component.style.paddingTop = '';
            component.style.paddingRight = '';
            component.style.paddingBottom = '';
            component.style.paddingLeft = '';
            component.style.padding = `${val}${unit}`;
            captureStateDebounced();
        };
        paddingInput.addEventListener('input', applyPaddingAll);
        paddingUnitSel === null || paddingUnitSel === void 0 ? void 0 : paddingUnitSel.addEventListener('change', applyPaddingAll);
    }
    /* Padding — individual sides */
    ['top', 'right', 'bottom', 'left'].forEach(side => {
        const sideInput = get(`padding-${side}`);
        const sideUnit = get(`padding-${side}-unit`);
        const prop = `padding${side.charAt(0).toUpperCase()}${side.slice(1)}`;
        if (sideInput) {
            const apply = () => {
                const unit = (sideUnit === null || sideUnit === void 0 ? void 0 : sideUnit.value) || 'px';
                component.style[prop] =
                    `${sideInput.value || '0'}${unit}`;
                captureStateDebounced();
            };
            sideInput.addEventListener('input', apply);
            sideUnit === null || sideUnit === void 0 ? void 0 : sideUnit.addEventListener('change', apply);
        }
    });
}
function attachAlignmentListener(component, get, captureStateDebounced) {
    var _a;
    (_a = get('alignment')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', () => {
        const val = get('alignment').value;
        component.style.textAlign = val;
        component.querySelectorAll('.rt-block-content').forEach(el => {
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
function attachFontSizeListeners(component, get, captureStateDebounced) {
    let savedRangeFS = null;
    let activeFontSizeSpan = null;
    function saveSelectionForFontSize() {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0 || sel.isCollapsed)
            return;
        const range = sel.getRangeAt(0);
        if (!component.contains(range.commonAncestorContainer))
            return;
        savedRangeFS = range.cloneRange();
        if (!activeFontSizeSpan ||
            !activeFontSizeSpan.contains(range.commonAncestorContainer)) {
            activeFontSizeSpan = null;
        }
    }
    function restoreVisualSelectionFS(span) {
        var _a;
        const editableEl = (_a = span.closest('[contenteditable="true"]')) !== null && _a !== void 0 ? _a : component.querySelector('[contenteditable="true"]');
        if (!editableEl)
            return;
        editableEl.focus({ preventScroll: true });
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(span);
        sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
        sel === null || sel === void 0 ? void 0 : sel.addRange(range);
    }
    function applyFontSize(size) {
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
            }
            catch (_a) {
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
        component.querySelectorAll('.rt-block-content').forEach(el => {
            el.style.fontSize = size;
        });
    }
    const fontSizeInput = get('font-size');
    const fontSizeUnit = get('font-size-unit');
    fontSizeInput === null || fontSizeInput === void 0 ? void 0 : fontSizeInput.addEventListener('mousedown', saveSelectionForFontSize);
    fontSizeInput === null || fontSizeInput === void 0 ? void 0 : fontSizeInput.addEventListener('input', () => {
        if (!fontSizeInput)
            return;
        const unit = (fontSizeUnit === null || fontSizeUnit === void 0 ? void 0 : fontSizeUnit.value) || 'px';
        applyFontSize(`${fontSizeInput.value}${unit}`);
        captureStateDebounced();
    });
    fontSizeUnit === null || fontSizeUnit === void 0 ? void 0 : fontSizeUnit.addEventListener('change', () => {
        if (!fontSizeInput)
            return;
        const unit = (fontSizeUnit === null || fontSizeUnit === void 0 ? void 0 : fontSizeUnit.value) || 'px';
        applyFontSize(`${fontSizeInput.value}${unit}`);
        captureStateDebounced();
    });
}
/* ── Font weight — selection-aware ──────────────────────────────────────────
 *
 * Same mechanism as font size above.
 * ─────────────────────────────────────────────────────────────────────────── */
function attachFontWeightListeners(component, get, captureStateDebounced) {
    let savedRangeFW = null;
    let activeFontWeightSpan = null;
    function saveSelectionForFontWeight() {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0 || sel.isCollapsed)
            return;
        const range = sel.getRangeAt(0);
        if (!component.contains(range.commonAncestorContainer))
            return;
        savedRangeFW = range.cloneRange();
        if (!activeFontWeightSpan ||
            !activeFontWeightSpan.contains(range.commonAncestorContainer)) {
            activeFontWeightSpan = null;
        }
    }
    function restoreVisualSelectionFW(span) {
        var _a;
        const editableEl = (_a = span.closest('[contenteditable="true"]')) !== null && _a !== void 0 ? _a : component.querySelector('[contenteditable="true"]');
        if (!editableEl)
            return;
        editableEl.focus({ preventScroll: true });
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(span);
        sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
        sel === null || sel === void 0 ? void 0 : sel.addRange(range);
    }
    function applyFontWeight(weight) {
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
            }
            catch (_a) {
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
        component.querySelectorAll('.rt-block-content').forEach(el => {
            el.style.fontWeight = weight;
        });
    }
    const fontWeightSel = get('font-weight');
    fontWeightSel === null || fontWeightSel === void 0 ? void 0 : fontWeightSel.addEventListener('mousedown', saveSelectionForFontWeight);
    fontWeightSel === null || fontWeightSel === void 0 ? void 0 : fontWeightSel.addEventListener('change', () => {
        if (!fontWeightSel)
            return;
        applyFontWeight(fontWeightSel.value);
        captureStateDebounced();
    });
}
function attachFontFamilyListener(component, get, captureStateDebounced) {
    var _a;
    (_a = get('font-family')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', () => {
        const val = get('font-family').value;
        component.style.fontFamily = val;
        component.querySelectorAll('.rt-block-content').forEach(el => {
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
function attachTextColorListeners(component, get, captureStateDebounced) {
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
        if (!sel || sel.rangeCount === 0 || sel.isCollapsed)
            return;
        const range = sel.getRangeAt(0);
        if (!component.contains(range.commonAncestorContainer))
            return;
        savedRange = range.cloneRange();
        /* New user selection outside the active span → fresh session */
        if (!activeColorSpan ||
            !activeColorSpan.contains(range.commonAncestorContainer)) {
            activeColorSpan = null;
        }
    }
    /**
     * Re-focuses the contenteditable child and selects the span's contents so
     * the colored text stays visually highlighted while the user drags the
     * color picker slider.
     */
    function restoreVisualSelection(span) {
        var _a;
        const editableEl = (_a = span.closest('[contenteditable="true"]')) !== null && _a !== void 0 ? _a : component.querySelector('[contenteditable="true"]');
        if (!editableEl)
            return;
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
            }
            catch (_a) {
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
        component.querySelectorAll('.rt-block-content').forEach(el => {
            el.style.color = color;
        });
    }
    const textColorPicker = get('text-color');
    const textColorHex = get('text-color-value');
    /* Capture selection before the picker steals focus */
    textColorPicker === null || textColorPicker === void 0 ? void 0 : textColorPicker.addEventListener('mousedown', saveSelectionInsideComponent);
    textColorHex === null || textColorHex === void 0 ? void 0 : textColorHex.addEventListener('mousedown', saveSelectionInsideComponent);
    textColorPicker === null || textColorPicker === void 0 ? void 0 : textColorPicker.addEventListener('input', () => {
        const val = textColorPicker.value;
        applyTextColor(val);
        if (textColorHex)
            textColorHex.value = val;
        captureStateDebounced();
    });
    textColorHex === null || textColorHex === void 0 ? void 0 : textColorHex.addEventListener('input', e => {
        const val = e.target.value;
        applyTextColor(val);
        if (textColorPicker)
            textColorPicker.value = val;
        captureStateDebounced();
    });
}
function attachBorderListeners(component, get, captureStateDebounced) {
    var _a, _b, _c, _d, _e;
    (_a = get('border-width')) === null || _a === void 0 ? void 0 : _a.addEventListener('input', () => {
        var _a;
        const unit = ((_a = get('border-width-unit')) === null || _a === void 0 ? void 0 : _a.value) || 'px';
        component.style.borderWidth = `${get('border-width').value}${unit}`;
        captureStateDebounced();
    });
    (_b = get('border-style')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', () => {
        component.style.borderStyle = get('border-style').value;
        captureStateDebounced();
    });
    (_c = get('border-color')) === null || _c === void 0 ? void 0 : _c.addEventListener('input', () => {
        const val = get('border-color').value;
        component.style.borderColor = val;
        const hexInput = get('border-color-value');
        if (hexInput)
            hexInput.value = val;
        captureStateDebounced();
    });
    (_d = get('border-color-value')) === null || _d === void 0 ? void 0 : _d.addEventListener('input', e => {
        const val = e.target.value;
        component.style.borderColor = val;
        const picker = get('border-color');
        if (picker)
            picker.value = val;
        captureStateDebounced();
    });
    (_e = get('border-radius')) === null || _e === void 0 ? void 0 : _e.addEventListener('input', () => {
        var _a;
        const unit = ((_a = get('border-radius-unit')) === null || _a === void 0 ? void 0 : _a.value) || 'px';
        component.style.borderRadius = `${get('border-radius').value}${unit}`;
        captureStateDebounced();
    });
}
function attachDisplayListener(component, controlsContainer, addListenersFn, customizeComponentTagName, get, captureStateDebounced) {
    var _a;
    (_a = get('display')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', () => {
        const selectedValue = get('display').value;
        if (selectedValue === 'inline') {
            /* Store user intent as "inline" but apply inline-block to the DOM.
               Pure inline ignores width/height/vertical spacing in the builder. */
            component.style.display = 'inline-block';
            component.dataset.displayIntent = 'inline';
        }
        else {
            component.style.display = selectedValue;
            /* Clear the intent flag for all non-inline selections */
            delete component.dataset.displayIntent;
        }
        captureStateDebounced();
        /* Defer re-populate so the inline style is committed before being read back */
        requestAnimationFrame(() => populateCssControls(component, controlsContainer, addListenersFn, customizeComponentTagName));
    });
}
function attachFlexSubControlListeners(component, get, captureStateDebounced) {
    var _a, _b, _c;
    (_a = get('flex-direction')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', () => {
        component.style.flexDirection =
            get('flex-direction').value;
        captureStateDebounced();
    });
    (_b = get('align-items')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', () => {
        component.style.alignItems = get('align-items').value;
        captureStateDebounced();
    });
    (_c = get('justify-content')) === null || _c === void 0 ? void 0 : _c.addEventListener('change', () => {
        component.style.justifyContent =
            get('justify-content').value;
        captureStateDebounced();
    });
}
/* Attaches every CSS-property change/input listener to the sidebar controls */
export function addControlListeners(component, controlsContainer, addListenersFn /* recursive ref for re-populate */, customizeComponentTagName) {
    /* Single debounced handler shared by all controls to batch history captures */
    const captureStateDebounced = debounce(() => {
        Canvas.dispatchDesignChange();
        Canvas.historyManager.captureState();
    }, 300);
    const get = (id) => document.getElementById(id);
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
    attachDisplayListener(component, controlsContainer, addListenersFn, customizeComponentTagName, get, captureStateDebounced);
    attachFlexSubControlListeners(component, get, captureStateDebounced);
}
