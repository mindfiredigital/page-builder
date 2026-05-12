interface BlockTypeDef {
  type: string;
  label: string;
  icon: string;
}

interface TuneItem {
  label: string;
  icon: string;
  action?: () => void;
  danger?: boolean;
  active?: boolean;
  submenu?: TuneItem[];
}

export class RichTextComponent {
  private static blockCounter = 0;
  private root: HTMLElement | null = null;
  private activePopover: HTMLElement | null = null;
  private activeBlock: HTMLElement | null = null;
  private boundCloseHandler!: (e: MouseEvent) => void;

  private static readonly BLOCK_TYPES: BlockTypeDef[] = [
    {
      type: 'text',
      label: 'Text',
      icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="9" y1="20" x2="15" y2="20"/></svg>`,
    },
    {
      type: 'heading',
      label: 'Heading',
      icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 12h12M6 4v16M18 4v16"/></svg>`,
    },
    {
      type: 'image',
      label: 'Image',
      icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    },
    {
      type: 'list',
      label: 'List',
      icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><line x1="4" y1="6" x2="4.01" y2="6"/><line x1="4" y1="12" x2="4.01" y2="12"/><line x1="4" y1="18" x2="4.01" y2="18"/></svg>`,
    },
    {
      type: 'code',
      label: 'Code',
      icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    },
    {
      type: 'quote',
      label: 'Quote',
      icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>`,
    },
    {
      type: 'delimiter',
      label: 'Delimiter',
      icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></svg>`,
    },
    {
      type: 'rawhtml',
      label: 'Raw HTML',
      icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 20l4-16M8 8l-4 4 4 4M16 8l4 4-4 4"/></svg>`,
    },
    {
      type: 'warning',
      label: 'Warning',
      icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    },
    {
      type: 'checklist',
      label: 'Checklist',
      icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    },
  ];

  private generateBlockId(): string {
    return `rt-block-${Date.now()}-${++RichTextComponent.blockCounter}`;
  }

  create(): HTMLElement {
    const root = document.createElement('div');
    root.classList.add('rich-text-component');
    this.root = root;

    root.appendChild(this.createBlock('text'));

    this.boundCloseHandler = (e: MouseEvent) => {
      if (
        this.activePopover &&
        !this.activePopover.contains(e.target as Node)
      ) {
        this.hidePopover();
      }
    };
    document.addEventListener('click', this.boundCloseHandler);

    return root;
  }

  // ── Block assembly ──────────────────────────────────────────

  private createBlock(type: string): HTMLElement {
    const block = document.createElement('div');
    block.classList.add('rt-block');
    block.dataset.blockId = this.generateBlockId();
    block.dataset.blockType = type;

    const controls = document.createElement('div');
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
    block.appendChild(this.createBlockContent(type));

    return block;
  }

  private createBlockContent(type: string): HTMLElement {
    switch (type) {
      case 'heading':
        return this.createHeadingContent(2);
      case 'image':
        return this.createImageContent();
      case 'list':
        return this.createListContent('unordered');
      case 'code':
        return this.createCodeContent();
      case 'quote':
        return this.createQuoteContent();
      case 'delimiter':
        return this.createDelimiterContent();
      case 'rawhtml':
        return this.createRawHtmlContent();
      case 'warning':
        return this.createWarningContent();
      case 'checklist':
        return this.createChecklistContent();
      default:
        return this.createTextContent();
    }
  }

  // ── Block content creators ──────────────────────────────────

  private createTextContent(): HTMLElement {
    const div = document.createElement('div');
    div.classList.add('rt-block-content', 'rt-text-block');
    div.setAttribute('contenteditable', 'true');
    div.dataset.placeholder = 'Type text or paste a link';
    return div;
  }

  private createHeadingContent(level: number): HTMLElement {
    const heading = document.createElement(`h${level}`) as HTMLElement;
    heading.classList.add('rt-block-content', 'rt-heading-block');
    heading.setAttribute('contenteditable', 'true');
    heading.dataset.placeholder = 'Heading';
    heading.dataset.level = String(level);
    return heading;
  }

  private createImageContent(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('rt-block-content', 'rt-image-block');
    wrapper.setAttribute('contenteditable', 'false');

    const btn = document.createElement('button');
    btn.classList.add('rt-image-select-btn');
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>&nbsp;Select an Image`;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    btn.addEventListener('click', e => {
      e.stopPropagation();
      fileInput.click();
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const img = document.createElement('img');
        img.src = ev.target?.result as string;
        img.classList.add('rt-image-preview');
        wrapper.innerHTML = '';
        wrapper.appendChild(img);
        wrapper.appendChild(fileInput);
      };
      reader.readAsDataURL(file);
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(fileInput);
    return wrapper;
  }

  private createListContent(style: 'unordered' | 'ordered'): HTMLElement {
    const tag = style === 'ordered' ? 'ol' : 'ul';
    const list = document.createElement(tag) as HTMLElement;
    list.classList.add('rt-block-content', 'rt-list-block');
    list.dataset.listStyle = style;

    const li = document.createElement('li');
    li.setAttribute('contenteditable', 'true');
    list.appendChild(li);

    list.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const newLi = document.createElement('li');
        newLi.setAttribute('contenteditable', 'true');
        list.appendChild(newLi);
        newLi.focus();
      }
    });

    return list;
  }

  private createCodeContent(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('rt-block-content', 'rt-code-block');
    wrapper.setAttribute('contenteditable', 'false');
    wrapper.dataset.theme = 'light';

    const textarea = document.createElement('textarea');
    textarea.classList.add('rt-code-textarea');
    textarea.placeholder = 'Enter a code';
    wrapper.appendChild(textarea);
    return wrapper;
  }

  private createQuoteContent(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('rt-block-content', 'rt-quote-block');
    wrapper.setAttribute('contenteditable', 'false');
    wrapper.dataset.align = 'left';

    const quoteText = document.createElement('div');
    quoteText.classList.add('rt-quote-text');
    quoteText.setAttribute('contenteditable', 'true');
    quoteText.dataset.placeholder = 'Enter a quote';

    const caption = document.createElement('div');
    caption.classList.add('rt-quote-caption');
    caption.setAttribute('contenteditable', 'true');
    caption.dataset.placeholder = 'Enter a caption';

    wrapper.appendChild(quoteText);
    wrapper.appendChild(caption);
    return wrapper;
  }

  private createDelimiterContent(): HTMLElement {
    const div = document.createElement('div');
    div.classList.add('rt-block-content', 'rt-delimiter-block');
    div.setAttribute('contenteditable', 'false');
    div.textContent = '* * *';
    return div;
  }

  private createRawHtmlContent(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('rt-block-content', 'rt-rawhtml-block');
    wrapper.setAttribute('contenteditable', 'false');

    const textarea = document.createElement('textarea');
    textarea.classList.add('rt-rawhtml-textarea');
    textarea.placeholder = 'Enter HTML code';
    wrapper.appendChild(textarea);
    return wrapper;
  }

  private createWarningContent(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('rt-block-content', 'rt-warning-block');
    wrapper.setAttribute('contenteditable', 'false');

    const title = document.createElement('input');
    title.type = 'text';
    title.classList.add('rt-warning-title');
    title.placeholder = 'Title';

    const message = document.createElement('textarea');
    message.classList.add('rt-warning-message');
    message.placeholder = 'Message';

    wrapper.appendChild(title);
    wrapper.appendChild(message);
    return wrapper;
  }

  private createChecklistContent(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('rt-block-content', 'rt-checklist-block');
    wrapper.setAttribute('contenteditable', 'false');
    wrapper.appendChild(this.createChecklistItem());

    wrapper.addEventListener('keydown', (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === 'Enter' && target.classList.contains('rt-checklist-text')) {
        e.preventDefault();
        const newItem = this.createChecklistItem();
        wrapper.appendChild(newItem);
        newItem.querySelector<HTMLElement>('.rt-checklist-text')?.focus();
      }
    });

    return wrapper;
  }

  private createChecklistItem(): HTMLElement {
    const item = document.createElement('div');
    item.classList.add('rt-checklist-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('rt-checklist-checkbox');

    const text = document.createElement('span');
    text.classList.add('rt-checklist-text');
    text.setAttribute('contenteditable', 'true');

    item.appendChild(checkbox);
    item.appendChild(text);
    return item;
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
      RichTextComponent.BLOCK_TYPES.filter(bt =>
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

  private toggleAddPopover(block: HTMLElement, anchor: HTMLElement): void {
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

    const rootRect = this.root!.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    popover.style.top = `${anchorRect.bottom - rootRect.top + 4}px`;
    popover.style.left = `${anchorRect.left - rootRect.left}px`;

    this.root!.appendChild(popover);
    setTimeout(
      () =>
        popover.querySelector<HTMLInputElement>('.rt-popover-filter')?.focus(),
      0
    );
  }

  private hidePopover(): void {
    if (this.activePopover) {
      this.activePopover.remove();
      this.activePopover = null;
      this.activeBlock = null;
    }
  }

  private insertBlock(type: string, afterBlock: HTMLElement): void {
    afterBlock.insertAdjacentElement('afterend', this.createBlock(type));
  }

  // ── Tune popover ────────────────────────────────────────────

  private static readonly TUNE_ICONS = {
    moveUp: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>`,
    delete: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    moveDown: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`,
    alignLeft: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>`,
    alignCenter: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="18" y1="12" x2="6" y2="12"/><line x1="21" y1="18" x2="3" y2="18"/></svg>`,
    alignRight: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/></svg>`,
    convertTo: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
    unordered: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><line x1="4" y1="6" x2="4.01" y2="6"/><line x1="4" y1="12" x2="4.01" y2="12"/><line x1="4" y1="18" x2="4.01" y2="18"/></svg>`,
    ordered: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><polyline points="3 8 3 3 5 3"/><line x1="3" y1="8" x2="5" y2="8"/><path d="M5 13H3l2 3H3"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    moon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  };

  private toggleTunePopover(block: HTMLElement, anchor: HTMLElement): void {
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

    const rootRect = this.root!.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    popover.style.top = `${anchorRect.bottom - rootRect.top + 4}px`;
    popover.style.left = `${anchorRect.left - rootRect.left}px`;

    this.root!.appendChild(popover);
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
    const specific = this.getBlockSpecificTunes(block, blockType);
    const defaults = this.getDefaultTunes(block);

    const render = (query: string) => {
      list.innerHTML = '';
      const q = query.toLowerCase();

      const visibleSpecific = specific.filter(t =>
        t.label.toLowerCase().includes(q)
      );
      const visibleDefaults = defaults.filter(t =>
        t.label.toLowerCase().includes(q)
      );

      visibleSpecific.forEach(t => list.appendChild(this.buildTuneItem(t)));
      if (visibleSpecific.length > 0 && visibleDefaults.length > 0) {
        list.appendChild(this.buildSeparator());
      }
      visibleDefaults.forEach(t => list.appendChild(this.buildTuneItem(t)));
    };

    render('');
    filterInput.addEventListener('input', () => render(filterInput.value));

    popover.appendChild(filterInput);
    popover.appendChild(list);
    return popover;
  }

  private buildTuneItem(item: TuneItem): HTMLElement {
    if (item.submenu) {
      return this.buildSubmenuItem(item);
    }
    const el = document.createElement('div');
    el.classList.add('rt-popover-item');
    if (item.danger) el.classList.add('rt-popover-item--danger');
    if (item.active) el.classList.add('rt-popover-item--active');
    el.setAttribute('contenteditable', 'false');
    el.innerHTML = `<span class="rt-popover-icon">${item.icon}</span><span class="rt-popover-label">${item.label}</span>`;
    if (item.action) {
      el.addEventListener('mousedown', e => {
        e.preventDefault();
        e.stopPropagation();
        item.action!();
        this.hidePopover();
      });
    }
    return el;
  }

  private buildSubmenuItem(item: TuneItem): HTMLElement {
    const el = document.createElement('div');
    el.classList.add('rt-popover-item', 'rt-popover-item--submenu');
    el.setAttribute('contenteditable', 'false');
    el.innerHTML = `<span class="rt-popover-icon">${item.icon}</span><span class="rt-popover-label">${item.label}</span><span class="rt-popover-arrow">›</span>`;

    const submenu = document.createElement('div');
    submenu.classList.add('rt-convert-submenu');
    (item.submenu ?? []).forEach(sub => {
      const subEl = document.createElement('div');
      subEl.classList.add('rt-popover-item');
      subEl.setAttribute('contenteditable', 'false');
      subEl.innerHTML = `<span class="rt-popover-icon">${sub.icon}</span><span class="rt-popover-label">${sub.label}</span>`;
      subEl.addEventListener('mousedown', e => {
        e.preventDefault();
        e.stopPropagation();
        sub.action?.();
        this.hidePopover();
      });
      submenu.appendChild(subEl);
    });

    el.appendChild(submenu);
    return el;
  }

  private buildSeparator(): HTMLElement {
    const hr = document.createElement('hr');
    hr.classList.add('rt-popover-separator');
    return hr;
  }

  // ── Block-specific tunes ────────────────────────────────────

  private getBlockSpecificTunes(
    block: HTMLElement,
    blockType: string
  ): TuneItem[] {
    const icons = RichTextComponent.TUNE_ICONS;

    switch (blockType) {
      case 'text': {
        const currentAlign = block.dataset.align || 'left';
        return [
          {
            label: 'Align Left',
            icon: icons.alignLeft,
            active: currentAlign === 'left',
            action: () => this.applyAlignment(block, 'left'),
          },
          {
            label: 'Align Center',
            icon: icons.alignCenter,
            active: currentAlign === 'center',
            action: () => this.applyAlignment(block, 'center'),
          },
          {
            label: 'Align Right',
            icon: icons.alignRight,
            active: currentAlign === 'right',
            action: () => this.applyAlignment(block, 'right'),
          },
          {
            label: 'Convert to',
            icon: icons.convertTo,
            submenu: [
              {
                label: 'Heading',
                icon: RichTextComponent.BLOCK_TYPES[1].icon,
                action: () => this.convertBlock(block, 'heading'),
              },
              {
                label: 'List',
                icon: RichTextComponent.BLOCK_TYPES[3].icon,
                action: () => this.convertBlock(block, 'list'),
              },
              {
                label: 'Quote',
                icon: RichTextComponent.BLOCK_TYPES[5].icon,
                action: () => this.convertBlock(block, 'quote'),
              },
              {
                label: 'Checklist',
                icon: RichTextComponent.BLOCK_TYPES[9].icon,
                action: () => this.convertBlock(block, 'checklist'),
              },
            ],
          },
        ];
      }
      case 'heading': {
        const headingEl = block.querySelector<HTMLElement>('.rt-heading-block');
        const currentLevel = parseInt(headingEl?.dataset.level ?? '2', 10);
        const levelItems: TuneItem[] = [1, 2, 3, 4, 5, 6].map(level => ({
          label: `Heading ${level}`,
          icon: `<span style="font-weight:700;font-size:12px;line-height:1">H${level}</span>`,
          active: currentLevel === level,
          action: () => this.changeHeadingLevel(block, level),
        }));
        return [
          ...levelItems,
          {
            label: 'Convert to',
            icon: icons.convertTo,
            submenu: [
              {
                label: 'Text',
                icon: RichTextComponent.BLOCK_TYPES[0].icon,
                action: () => this.convertBlock(block, 'text'),
              },
              {
                label: 'List',
                icon: RichTextComponent.BLOCK_TYPES[3].icon,
                action: () => this.convertBlock(block, 'list'),
              },
              {
                label: 'Quote',
                icon: RichTextComponent.BLOCK_TYPES[5].icon,
                action: () => this.convertBlock(block, 'quote'),
              },
              {
                label: 'Checklist',
                icon: RichTextComponent.BLOCK_TYPES[9].icon,
                action: () => this.convertBlock(block, 'checklist'),
              },
            ],
          },
        ];
      }
      case 'code': {
        const codeWrapper = block.querySelector<HTMLElement>('.rt-code-block');
        const currentTheme = codeWrapper?.dataset.theme ?? 'light';
        return [
          {
            label: 'Light mode',
            icon: icons.sun,
            active: currentTheme === 'light',
            action: () => this.toggleCodeTheme(block, 'light'),
          },
          {
            label: 'Dark mode',
            icon: icons.moon,
            active: currentTheme === 'dark',
            action: () => this.toggleCodeTheme(block, 'dark'),
          },
        ];
      }
      case 'list': {
        const listEl = block.querySelector<HTMLElement>('.rt-list-block');
        const currentStyle = listEl?.dataset.listStyle ?? 'unordered';
        return [
          {
            label: 'Unordered',
            icon: icons.unordered,
            active: currentStyle === 'unordered',
            action: () => this.toggleListStyle(block, 'unordered'),
          },
          {
            label: 'Ordered',
            icon: icons.ordered,
            active: currentStyle === 'ordered',
            action: () => this.toggleListStyle(block, 'ordered'),
          },
          {
            label: 'Convert to',
            icon: icons.convertTo,
            submenu: [
              {
                label: 'Text',
                icon: RichTextComponent.BLOCK_TYPES[0].icon,
                action: () => this.convertBlock(block, 'text'),
              },
              {
                label: 'Heading',
                icon: RichTextComponent.BLOCK_TYPES[1].icon,
                action: () => this.convertBlock(block, 'heading'),
              },
              {
                label: 'Quote',
                icon: RichTextComponent.BLOCK_TYPES[5].icon,
                action: () => this.convertBlock(block, 'quote'),
              },
              {
                label: 'Checklist',
                icon: RichTextComponent.BLOCK_TYPES[9].icon,
                action: () => this.convertBlock(block, 'checklist'),
              },
            ],
          },
        ];
      }
      default:
        return [];
    }
  }

  private getDefaultTunes(block: HTMLElement): TuneItem[] {
    const icons = RichTextComponent.TUNE_ICONS;
    return [
      {
        label: 'Move up',
        icon: icons.moveUp,
        action: () => this.moveBlockUp(block),
      },
      {
        label: 'Delete',
        icon: icons.delete,
        danger: true,
        action: () => this.deleteBlock(block),
      },
      {
        label: 'Move down',
        icon: icons.moveDown,
        action: () => this.moveBlockDown(block),
      },
    ];
  }

  // ── Block actions ───────────────────────────────────────────

  private applyAlignment(block: HTMLElement, align: string): void {
    const content = block.querySelector<HTMLElement>('.rt-block-content');
    if (content) content.style.textAlign = align;
    block.dataset.align = align;
  }

  private convertBlock(block: HTMLElement, toType: string): void {
    const oldContent = block.querySelector<HTMLElement>('.rt-block-content');
    const preservedText = oldContent?.textContent?.trim() ?? '';

    const newContent = this.createBlockContent(toType);
    oldContent?.replaceWith(newContent);
    block.dataset.blockType = toType;
    delete block.dataset.align;

    if (preservedText) {
      const editable =
        newContent.querySelector<HTMLElement>('[contenteditable="true"]') ??
        (newContent.getAttribute('contenteditable') === 'true'
          ? newContent
          : null);
      if (editable) editable.textContent = preservedText;
    }
  }

  private changeHeadingLevel(block: HTMLElement, level: number): void {
    const oldHeading = block.querySelector<HTMLElement>('.rt-heading-block');
    const preservedText = oldHeading?.textContent?.trim() ?? '';
    const newHeading = this.createHeadingContent(level);
    if (preservedText) newHeading.textContent = preservedText;
    oldHeading?.replaceWith(newHeading);
  }

  private toggleCodeTheme(block: HTMLElement, theme: 'light' | 'dark'): void {
    const wrapper = block.querySelector<HTMLElement>('.rt-code-block');
    if (wrapper) wrapper.dataset.theme = theme;
  }

  private toggleListStyle(
    block: HTMLElement,
    style: 'unordered' | 'ordered'
  ): void {
    const oldList = block.querySelector<HTMLElement>('.rt-list-block');
    if (!oldList) return;

    const texts = Array.from(oldList.querySelectorAll('li')).map(
      li => li.textContent?.trim() ?? ''
    );

    const newList = this.createListContent(style);
    // createListContent seeds one empty li — replace all with preserved text
    newList.innerHTML = '';
    (texts.length ? texts : ['']).forEach(text => {
      const li = document.createElement('li');
      li.setAttribute('contenteditable', 'true');
      li.textContent = text;
      newList.appendChild(li);
    });

    oldList.replaceWith(newList);
  }

  private moveBlockUp(block: HTMLElement): void {
    const siblings = Array.from(this.root!.children).filter(el =>
      el.classList.contains('rt-block')
    ) as HTMLElement[];
    const idx = siblings.indexOf(block);
    if (idx > 0) siblings[idx - 1].insertAdjacentElement('beforebegin', block);
  }

  private moveBlockDown(block: HTMLElement): void {
    const siblings = Array.from(this.root!.children).filter(el =>
      el.classList.contains('rt-block')
    ) as HTMLElement[];
    const idx = siblings.indexOf(block);
    if (idx < siblings.length - 1)
      siblings[idx + 1].insertAdjacentElement('afterend', block);
  }

  private deleteBlock(block: HTMLElement): void {
    block.remove();
    if (this.root!.querySelectorAll('.rt-block').length === 0) {
      this.root!.prepend(this.createBlock('text'));
    }
  }

  static restore(_container: HTMLElement): void {
    // Implemented in later steps when block data is persisted
  }
}
