export class RichTextComponent {
  generateBlockId() {
    return `rt-block-${Date.now()}-${++RichTextComponent.blockCounter}`;
  }
  create() {
    const root = document.createElement('div');
    root.classList.add('rich-text-component');
    const block = this.createBlock('text');
    root.appendChild(block);
    return root;
  }
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
    const tuneBtn = document.createElement('button');
    tuneBtn.classList.add('rt-tune-btn');
    tuneBtn.setAttribute('contenteditable', 'false');
    tuneBtn.setAttribute('title', 'Click to tune');
    tuneBtn.textContent = '⠿';
    controls.appendChild(addBtn);
    controls.appendChild(tuneBtn);
    const content = document.createElement('div');
    content.classList.add('rt-block-content', 'rt-text-block');
    content.setAttribute('contenteditable', 'true');
    content.dataset.placeholder = 'Type text or paste a link';
    block.appendChild(controls);
    block.appendChild(content);
    return block;
  }
  static restore(_container) {
    // Implemented in later steps when block data is persisted
  }
}
RichTextComponent.blockCounter = 0;
