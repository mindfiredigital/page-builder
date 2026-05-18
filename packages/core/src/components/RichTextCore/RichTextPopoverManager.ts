import { RICH_TEXT_BLOCK_TYPES } from '../../constants';
import { createBlockContent } from './RichTextBlockCreators';
import {
  applyAlignment,
  convertBlock,
  changeHeadingLevel,
  toggleImageOption,
  toggleCodeTheme,
  toggleListStyle,
  moveBlockUp,
  moveBlockDown,
  deleteBlock,
} from './RichTextBlockActions';
import {
  buildTuneItem,
  buildSeparator,
  getBlockSpecificTunes,
  getDefaultTunes,
} from './RichTextTuneBuilder';

export class RichTextPopoverManager {
  private root: HTMLElement;
  private generateBlockId: () => string;
  private activePopover: HTMLElement | null = null;
  private activeBlock: HTMLElement | null = null;
  private activeSubmenu: HTMLElement | null = null;
  private submenuHideTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(root: HTMLElement, generateBlockId: () => string) {
    this.root = root;
    this.generateBlockId = generateBlockId;
  }

  /** Attaches the document-level click handler that closes open popovers. */
  init(): void {
    document.addEventListener('click', (e: MouseEvent) => {
      if (
        this.activePopover &&
        !this.activePopover.contains(e.target as Node)
      ) {
        this.hidePopover();
      }
    });
  }

  // ── Block creation ──────────────────────────────────────────

  createBlock(type: string): HTMLElement {
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

  private buildAddPopover(): HTMLElement {
    const popover = document.createElement('div');
    popover.classList.add('rt-add-popover');

    const filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.classList.add('rt-popover-filter');
    filterInput.placeholder = 'Filter';
    filterInput.setAttribute('contenteditable', 'false');

    const list = document.createElement('div');
    list.classList.add('rt-popover-list');

    const renderItems = (query: string) => {
      list.innerHTML = '';
      RICH_TEXT_BLOCK_TYPES.filter(bt =>
        bt.label.toLowerCase().includes(query.toLowerCase())
      ).forEach(bt => {
        const item = document.createElement('div');
        item.classList.add('rt-popover-item');
        item.setAttribute('contenteditable', 'false');
        item.innerHTML = `<span class="rt-popover-icon">${bt.icon}</span><span class="rt-popover-label">${bt.label}</span>`;
        item.addEventListener('mousedown', e => {
          e.preventDefault();
          e.stopPropagation();
          if (this.activeBlock) this.insertBlock(bt.type, this.activeBlock);
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

  toggleAddPopover(block: HTMLElement, anchor: HTMLElement): void {
    if (
      this.activePopover &&
      this.activeBlock === block &&
      this.activePopover.dataset.popoverType === 'add'
    ) {
      this.hidePopover();
      return;
    }
    this.hidePopover();
    this.activeBlock = block;

    const popover = this.buildAddPopover();
    popover.dataset.popoverType = 'add';
    this.activePopover = popover;

    const rootRect = this.root.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    popover.style.top = `${anchorRect.bottom - rootRect.top + 4}px`;
    popover.style.left = `${anchorRect.left - rootRect.left}px`;

    this.root.appendChild(popover);
    setTimeout(
      () =>
        popover.querySelector<HTMLInputElement>('.rt-popover-filter')?.focus(),
      0
    );
  }

  hidePopover(): void {
    this.cancelHideSubmenu();
    this.hideSubmenuNow();
    if (this.activePopover) {
      this.activePopover.remove();
      this.activePopover = null;
      this.activeBlock = null;
    }
  }

  insertBlock(type: string, afterBlock: HTMLElement): void {
    afterBlock.insertAdjacentElement('afterend', this.createBlock(type));
  }

  // ── Tune popover ────────────────────────────────────────────

  toggleTunePopover(block: HTMLElement, anchor: HTMLElement): void {
    if (
      this.activePopover &&
      this.activeBlock === block &&
      this.activePopover.dataset.popoverType === 'tune'
    ) {
      this.hidePopover();
      return;
    }
    this.hidePopover();
    this.activeBlock = block;

    const popover = this.buildTunePopover(block);
    popover.dataset.popoverType = 'tune';
    this.activePopover = popover;

    const rootRect = this.root.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    popover.style.top = `${anchorRect.bottom - rootRect.top + 4}px`;
    popover.style.left = `${anchorRect.left - rootRect.left}px`;

    this.root.appendChild(popover);
    setTimeout(
      () =>
        popover.querySelector<HTMLInputElement>('.rt-popover-filter')?.focus(),
      0
    );
  }

  private buildTunePopover(block: HTMLElement): HTMLElement {
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

    const render = (query: string) => {
      list.innerHTML = '';
      const q = query.toLowerCase();
      const visibleSpecific = specific.filter(t =>
        t.label.toLowerCase().includes(q)
      );
      const visibleDefaults = defaults.filter(t =>
        t.label.toLowerCase().includes(q)
      );
      visibleSpecific.forEach(t =>
        list.appendChild(buildTuneItem(t, itemCallbacks))
      );
      if (visibleSpecific.length > 0 && visibleDefaults.length > 0) {
        list.appendChild(buildSeparator());
      }
      visibleDefaults.forEach(t =>
        list.appendChild(buildTuneItem(t, itemCallbacks))
      );
    };

    render('');
    filterInput.addEventListener('input', () => render(filterInput.value));
    popover.appendChild(filterInput);
    popover.appendChild(list);
    return popover;
  }

  // ── Floating convert-to submenu ─────────────────────────────

  showSubmenu(items: TuneItem[], anchor: HTMLElement): void {
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
    const render = (q: string) => {
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
    this.root.appendChild(panel);

    const rootRect = this.root.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    panel.style.top = `${anchorRect.top - rootRect.top}px`;
    panel.style.left = `${anchorRect.right - rootRect.left + 4}px`;
  }

  hideSubmenuNow(): void {
    this.activeSubmenu?.remove();
    this.activeSubmenu = null;
  }

  scheduleHideSubmenu(): void {
    this.submenuHideTimer = setTimeout(() => this.hideSubmenuNow(), 120);
  }

  cancelHideSubmenu(): void {
    if (this.submenuHideTimer !== null) {
      clearTimeout(this.submenuHideTimer);
      this.submenuHideTimer = null;
    }
  }

  // ── Callback factories ──────────────────────────────────────

  private makeTuneItemCallbacks(): TuneItemCallbacks {
    return {
      hidePopover: () => this.hidePopover(),
      showSubmenu: (items, anchor) => this.showSubmenu(items, anchor),
      scheduleHideSubmenu: () => this.scheduleHideSubmenu(),
      cancelHideSubmenu: () => this.cancelHideSubmenu(),
    };
  }

  private makeTuneActions(): TuneActions {
    return {
      applyAlignment: (b, a) => applyAlignment(b, a),
      convertBlock: (b, t) => convertBlock(b, t),
      changeHeadingLevel: (b, l) => changeHeadingLevel(b, l),
      toggleListStyle: (b, s) => toggleListStyle(b, s),
      toggleCodeTheme: (b, t) => toggleCodeTheme(b, t),
      toggleImageOption: (b, o) => toggleImageOption(b, o),
      moveBlockUp: b => moveBlockUp(b, this.root),
      moveBlockDown: b => moveBlockDown(b, this.root),
      deleteBlock: b =>
        deleteBlock(b, this.root, type => this.createBlock(type)),
    };
  }
}
