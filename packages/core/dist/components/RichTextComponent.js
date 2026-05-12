export class RichTextComponent {
  constructor() {
    this.root = null;
    this.activePopover = null;
    this.activeBlock = null;
  }
  generateBlockId() {
    return `rt-block-${Date.now()}-${++RichTextComponent.blockCounter}`;
  }
  create() {
    const root = document.createElement('div');
    root.classList.add('rich-text-component');
    this.root = root;
    root.appendChild(this.createBlock('text'));
    this.boundCloseHandler = e => {
      if (this.activePopover && !this.activePopover.contains(e.target)) {
        this.hidePopover();
      }
    };
    document.addEventListener('click', this.boundCloseHandler);
    return root;
  }
  // ── Block assembly ──────────────────────────────────────────
  createBlock(type) {
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
    controls.appendChild(addBtn);
    controls.appendChild(tuneBtn);
    block.appendChild(controls);
    block.appendChild(this.createBlockContent(type));
    return block;
  }
  createBlockContent(type) {
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
  createTextContent() {
    const div = document.createElement('div');
    div.classList.add('rt-block-content', 'rt-text-block');
    div.setAttribute('contenteditable', 'true');
    div.dataset.placeholder = 'Type text or paste a link';
    return div;
  }
  createHeadingContent(level) {
    const heading = document.createElement(`h${level}`);
    heading.classList.add('rt-block-content', 'rt-heading-block');
    heading.setAttribute('contenteditable', 'true');
    heading.dataset.placeholder = 'Heading';
    heading.dataset.level = String(level);
    return heading;
  }
  createImageContent() {
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
      var _a;
      const file =
        (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        var _a;
        const img = document.createElement('img');
        img.src =
          (_a = ev.target) === null || _a === void 0 ? void 0 : _a.result;
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
  createListContent(style) {
    const tag = style === 'ordered' ? 'ol' : 'ul';
    const list = document.createElement(tag);
    list.classList.add('rt-block-content', 'rt-list-block');
    list.dataset.listStyle = style;
    const li = document.createElement('li');
    li.setAttribute('contenteditable', 'true');
    list.appendChild(li);
    list.addEventListener('keydown', e => {
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
  createCodeContent() {
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
  createQuoteContent() {
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
  createDelimiterContent() {
    const div = document.createElement('div');
    div.classList.add('rt-block-content', 'rt-delimiter-block');
    div.setAttribute('contenteditable', 'false');
    div.textContent = '* * *';
    return div;
  }
  createRawHtmlContent() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('rt-block-content', 'rt-rawhtml-block');
    wrapper.setAttribute('contenteditable', 'false');
    const textarea = document.createElement('textarea');
    textarea.classList.add('rt-rawhtml-textarea');
    textarea.placeholder = 'Enter HTML code';
    wrapper.appendChild(textarea);
    return wrapper;
  }
  createWarningContent() {
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
  createChecklistContent() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('rt-block-content', 'rt-checklist-block');
    wrapper.setAttribute('contenteditable', 'false');
    wrapper.appendChild(this.createChecklistItem());
    wrapper.addEventListener('keydown', e => {
      var _a;
      const target = e.target;
      if (e.key === 'Enter' && target.classList.contains('rt-checklist-text')) {
        e.preventDefault();
        const newItem = this.createChecklistItem();
        wrapper.appendChild(newItem);
        (_a = newItem.querySelector('.rt-checklist-text')) === null ||
        _a === void 0
          ? void 0
          : _a.focus();
      }
    });
    return wrapper;
  }
  createChecklistItem() {
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
    const renderItems = query => {
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
  toggleAddPopover(block, anchor) {
    if (this.activePopover && this.activeBlock === block) {
      this.hidePopover();
      return;
    }
    this.hidePopover();
    this.activeBlock = block;
    const popover = this.buildAddPopover();
    this.activePopover = popover;
    const rootRect = this.root.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    popover.style.top = `${anchorRect.bottom - rootRect.top + 4}px`;
    popover.style.left = `${anchorRect.left - rootRect.left}px`;
    this.root.appendChild(popover);
    setTimeout(() => {
      var _a;
      return (_a = popover.querySelector('.rt-popover-filter')) === null ||
        _a === void 0
        ? void 0
        : _a.focus();
    }, 0);
  }
  hidePopover() {
    if (this.activePopover) {
      this.activePopover.remove();
      this.activePopover = null;
      this.activeBlock = null;
    }
  }
  insertBlock(type, afterBlock) {
    afterBlock.insertAdjacentElement('afterend', this.createBlock(type));
  }
  static restore(_container) {
    // Implemented in later steps when block data is persisted
  }
}
RichTextComponent.blockCounter = 0;
RichTextComponent.BLOCK_TYPES = [
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
