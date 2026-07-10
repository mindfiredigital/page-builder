import { RICH_TEXT_BLOCK_TYPES } from '../../constants/index.js';
import { createBlockContent } from './RichTextBlockCreators.js';
import { applyAlignment, convertBlock, changeHeadingLevel, toggleImageOption, toggleCodeTheme, toggleListStyle, moveBlockUp, moveBlockDown, deleteBlock, } from './RichTextBlockActions.js';
import { buildTuneItem, buildSeparator, getBlockSpecificTunes, getDefaultTunes, } from './RichTextTuneBuilder.js';
export class RichTextPopoverManager {
    constructor(root, generateBlockId) {
        this.activePopover = null;
        this.activeBlock = null;
        this.activeSubmenu = null;
        this.submenuHideTimer = null;
        this.root = root;
        this.generateBlockId = generateBlockId;
    }
    /** Attaches the document-level click handler that closes open popovers. */
    init() {
        document.addEventListener('click', (e) => {
            if (this.activePopover &&
                !this.activePopover.contains(e.target)) {
                this.hidePopover();
            }
        });
    }
    // ── Block creation ──────────────────────────────────────────
    createBlock(type) {
        const block = document.createElement('div');
        block.classList.add('rt-block');
        block.dataset.blockId = this.generateBlockId();
        block.dataset.blockType = type;
        const controls = document.createElement('aside');
        controls.classList.add('rt-block-controls');
        controls.setAttribute('contenteditable', 'false');
        const addBtn = document.createElement('button');
        addBtn.classList.add('rt-add-btn');
        addBtn.setAttribute('contenteditable', 'false');
        addBtn.setAttribute('title', 'Add block');
        addBtn.textContent = '+';
        addBtn.addEventListener('click', e => {
            e.stopPropagation();
            this.toggleAddPopover(block, addBtn);
        });
        const tuneBtn = document.createElement('button');
        tuneBtn.classList.add('rt-tune-btn');
        tuneBtn.setAttribute('contenteditable', 'false');
        tuneBtn.setAttribute('title', 'Click to tune');
        tuneBtn.textContent = '⠿';
        tuneBtn.addEventListener('click', e => {
            e.stopPropagation();
            this.toggleTunePopover(block, tuneBtn);
        });
        controls.appendChild(addBtn);
        controls.appendChild(tuneBtn);
        block.appendChild(controls);
        block.appendChild(createBlockContent(type));
        return block;
    }
    // ── Add-block popover ───────────────────────────────────────
    buildAddPopover() {
        const popover = document.createElement('div');
        popover.classList.add('rt-add-popover');
        const filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.classList.add('rt-popover-filter');
        filterInput.placeholder = 'Filter';
        filterInput.setAttribute('contenteditable', 'false');
        const list = document.createElement('div');
        list.classList.add('rt-popover-list');
        const renderItems = (query) => {
            list.innerHTML = '';
            RICH_TEXT_BLOCK_TYPES.filter(bt => bt.label.toLowerCase().includes(query.toLowerCase())).forEach(bt => {
                const item = document.createElement('div');
                item.classList.add('rt-popover-item');
                item.setAttribute('contenteditable', 'false');
                item.innerHTML = `<span class="rt-popover-icon">${bt.icon}</span><span class="rt-popover-label">${bt.label}</span>`;
                item.addEventListener('mousedown', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (this.activeBlock)
                        this.insertBlock(bt.type, this.activeBlock);
                    this.hidePopover();
                });
                list.appendChild(item);
            });
        };
        renderItems('');
        filterInput.addEventListener('input', () => renderItems(filterInput.value));
        filterInput.addEventListener('click', e => e.stopPropagation());
        popover.appendChild(filterInput);
        popover.appendChild(list);
        return popover;
    }
    toggleAddPopover(block, anchor) {
        if (this.activePopover &&
            this.activeBlock === block &&
            this.activePopover.dataset.popoverType === 'add') {
            this.hidePopover();
            return;
        }
        this.hidePopover();
        this.activeBlock = block;
        const popover = this.buildAddPopover();
        popover.dataset.popoverType = 'add';
        this.activePopover = popover;
        const anchorRect = anchor.getBoundingClientRect();
        popover.style.position = 'fixed';
        popover.style.top = `${anchorRect.bottom + 4}px`;
        popover.style.left = `${anchorRect.left}px`;
        document.body.appendChild(popover);
        setTimeout(() => { var _a; return (_a = popover.querySelector('.rt-popover-filter')) === null || _a === void 0 ? void 0 : _a.focus(); }, 0);
    }
    hidePopover() {
        this.cancelHideSubmenu();
        this.hideSubmenuNow();
        if (this.activePopover) {
            this.activePopover.remove();
            this.activePopover = null;
            this.activeBlock = null;
        }
    }
    insertBlock(type, afterBlock) {
        afterBlock.insertAdjacentElement('afterend', this.createBlock(type));
    }
    // ── Tune popover ────────────────────────────────────────────
    toggleTunePopover(block, anchor) {
        if (this.activePopover &&
            this.activeBlock === block &&
            this.activePopover.dataset.popoverType === 'tune') {
            this.hidePopover();
            return;
        }
        this.hidePopover();
        this.activeBlock = block;
        const popover = this.buildTunePopover(block);
        popover.dataset.popoverType = 'tune';
        this.activePopover = popover;
        const anchorRect = anchor.getBoundingClientRect();
        popover.style.position = 'fixed';
        popover.style.top = `${anchorRect.bottom + 4}px`;
        popover.style.left = `${anchorRect.left}px`;
        document.body.appendChild(popover);
        setTimeout(() => { var _a; return (_a = popover.querySelector('.rt-popover-filter')) === null || _a === void 0 ? void 0 : _a.focus(); }, 0);
    }
    buildTunePopover(block) {
        const popover = document.createElement('div');
        popover.classList.add('rt-add-popover');
        const filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.classList.add('rt-popover-filter');
        filterInput.placeholder = 'Filter';
        filterInput.setAttribute('contenteditable', 'false');
        filterInput.addEventListener('click', e => e.stopPropagation());
        const list = document.createElement('div');
        list.classList.add('rt-popover-list');
        const blockType = block.dataset.blockType || 'text';
        const actions = this.makeTuneActions();
        const specific = getBlockSpecificTunes(block, blockType, actions);
        const defaults = getDefaultTunes(block, actions);
        const itemCallbacks = this.makeTuneItemCallbacks();
        const render = (query) => {
            list.innerHTML = '';
            const q = query.toLowerCase();
            const visibleSpecific = specific.filter(t => t.label.toLowerCase().includes(q));
            const visibleDefaults = defaults.filter(t => t.label.toLowerCase().includes(q));
            visibleSpecific.forEach(t => list.appendChild(buildTuneItem(t, itemCallbacks)));
            if (visibleSpecific.length > 0 && visibleDefaults.length > 0) {
                list.appendChild(buildSeparator());
            }
            visibleDefaults.forEach(t => list.appendChild(buildTuneItem(t, itemCallbacks)));
        };
        render('');
        filterInput.addEventListener('input', () => render(filterInput.value));
        popover.appendChild(filterInput);
        popover.appendChild(list);
        return popover;
    }
    // ── Floating convert-to submenu ─────────────────────────────
    showSubmenu(items, anchor) {
        this.cancelHideSubmenu();
        this.hideSubmenuNow();
        const panel = document.createElement('div');
        panel.classList.add('rt-add-popover');
        const filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.classList.add('rt-popover-filter');
        filterInput.placeholder = 'Filter';
        filterInput.setAttribute('contenteditable', 'false');
        filterInput.addEventListener('click', e => e.stopPropagation());
        const list = document.createElement('div');
        list.classList.add('rt-popover-list');
        const callbacks = this.makeTuneItemCallbacks();
        const render = (q) => {
            list.innerHTML = '';
            items
                .filter(it => it.label.toLowerCase().includes(q.toLowerCase()))
                .forEach(it => list.appendChild(buildTuneItem(it, callbacks)));
        };
        render('');
        filterInput.addEventListener('input', () => render(filterInput.value));
        panel.appendChild(filterInput);
        panel.appendChild(list);
        panel.addEventListener('mouseenter', () => this.cancelHideSubmenu());
        panel.addEventListener('mouseleave', () => this.scheduleHideSubmenu());
        this.activeSubmenu = panel;
        document.body.appendChild(panel);
        const anchorRect = anchor.getBoundingClientRect();
        panel.style.position = 'fixed';
        panel.style.top = `${anchorRect.top}px`;
        panel.style.left = `${anchorRect.right + 4}px`;
    }
    hideSubmenuNow() {
        var _a;
        (_a = this.activeSubmenu) === null || _a === void 0 ? void 0 : _a.remove();
        this.activeSubmenu = null;
    }
    scheduleHideSubmenu() {
        this.submenuHideTimer = setTimeout(() => this.hideSubmenuNow(), 120);
    }
    cancelHideSubmenu() {
        if (this.submenuHideTimer !== null) {
            clearTimeout(this.submenuHideTimer);
            this.submenuHideTimer = null;
        }
    }
    // ── Callback factories ──────────────────────────────────────
    makeTuneItemCallbacks() {
        return {
            hidePopover: () => this.hidePopover(),
            showSubmenu: (items, anchor) => this.showSubmenu(items, anchor),
            scheduleHideSubmenu: () => this.scheduleHideSubmenu(),
            cancelHideSubmenu: () => this.cancelHideSubmenu(),
        };
    }
    makeTuneActions() {
        return {
            applyAlignment: (b, a) => applyAlignment(b, a),
            convertBlock: (b, t) => convertBlock(b, t),
            changeHeadingLevel: (b, l) => changeHeadingLevel(b, l),
            toggleListStyle: (b, s) => toggleListStyle(b, s),
            toggleCodeTheme: (b, t) => toggleCodeTheme(b, t),
            toggleImageOption: (b, o) => toggleImageOption(b, o),
            moveBlockUp: b => moveBlockUp(b, this.root),
            moveBlockDown: b => moveBlockDown(b, this.root),
            deleteBlock: b => deleteBlock(b, this.root, type => this.createBlock(type)),
        };
    }
}
