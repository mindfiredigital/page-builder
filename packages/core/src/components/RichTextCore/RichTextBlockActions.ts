import {
  createBlockContent,
  createChecklistItem,
  createHeadingContent,
  createListContent,
} from './RichTextBlockCreators';

export function applyAlignment(block: HTMLElement, align: string): void {
  const content = block.querySelector<HTMLElement>('.rt-block-content');
  if (content) content.style.textAlign = align;
  block.dataset.align = align;
}

export function extractBlockText(
  content: HTMLElement | null,
  fromType: string
): string {
  if (!content) return '';
  switch (fromType) {
    case 'list':
      return Array.from(content.querySelectorAll('li'))
        .map(li => li.textContent?.trim() ?? '')
        .filter(Boolean)
        .join('\n');
    case 'quote':
      return content.querySelector('.rt-quote-text')?.textContent?.trim() ?? '';
    case 'checklist':
      return Array.from(content.querySelectorAll('.rt-checklist-text'))
        .map(el => el.textContent?.trim() ?? '')
        .filter(Boolean)
        .join('\n');
    case 'warning': {
      const t =
        content.querySelector('.rt-warning-title')?.textContent?.trim() ?? '';
      const m =
        content.querySelector('.rt-warning-message')?.textContent?.trim() ?? '';
      return [t, m].filter(Boolean).join('\n');
    }
    default:
      return content.textContent?.trim() ?? '';
  }
}

export function injectTextIntoBlock(
  content: HTMLElement,
  toType: string,
  text: string
): void {
  const lines = text.split('\n').filter(l => l.trim());
  const firstLine = lines[0] ?? text;

  switch (toType) {
    case 'heading':
      content.textContent = firstLine;
      break;
    case 'list': {
      content.innerHTML = '';
      (lines.length ? lines : [text]).forEach(line => {
        const li = document.createElement('li');
        li.setAttribute('contenteditable', 'true');
        li.textContent = line;
        content.appendChild(li);
      });
      break;
    }
    case 'quote': {
      const quoteText = content.querySelector<HTMLElement>('.rt-quote-text');
      if (quoteText) quoteText.textContent = firstLine;
      break;
    }
    case 'checklist': {
      content.innerHTML = '';
      (lines.length ? lines : [text]).forEach(line => {
        const item = createChecklistItem();
        const span = item.querySelector<HTMLElement>('.rt-checklist-text');
        if (span) span.textContent = line;
        content.appendChild(item);
      });
      break;
    }
    default: {
      const editable =
        content.querySelector<HTMLElement>('[contenteditable="true"]') ??
        (content.getAttribute('contenteditable') === 'true' ? content : null);
      if (editable) editable.textContent = text;
    }
  }
}

export function convertBlock(block: HTMLElement, toType: string): void {
  const oldContent = block.querySelector<HTMLElement>('.rt-block-content');
  const fromType = block.dataset.blockType ?? 'text';
  const preservedText = extractBlockText(oldContent, fromType);

  const newContent = createBlockContent(toType);
  oldContent?.replaceWith(newContent);
  block.dataset.blockType = toType;
  delete block.dataset.align;

  if (preservedText) {
    injectTextIntoBlock(newContent, toType, preservedText);
  }
}

export function changeHeadingLevel(block: HTMLElement, level: number): void {
  const oldHeading = block.querySelector<HTMLElement>('.rt-heading-block');
  const preservedText = oldHeading?.textContent?.trim() ?? '';
  const newHeading = createHeadingContent(level);
  if (preservedText) newHeading.textContent = preservedText;
  oldHeading?.replaceWith(newHeading);
}

export function toggleImageOption(
  block: HTMLElement,
  option: 'border' | 'stretch' | 'background'
): void {
  const imageBlock = block.querySelector<HTMLElement>('.rt-image-block');
  if (!imageBlock) return;
  const isOn = imageBlock.dataset[option] === 'true';
  imageBlock.dataset[option] = isOn ? 'false' : 'true';
  const img = imageBlock.querySelector<HTMLElement>('.rt-image-preview');
  switch (option) {
    case 'border':
      if (img) img.style.border = isOn ? '' : '3px solid #e2e8f0';
      break;
    case 'stretch':
      if (img) img.style.width = isOn ? '' : '100%';
      break;
    case 'background':
      imageBlock.style.backgroundColor = isOn ? '' : '#f1f5f9';
      imageBlock.style.padding = isOn ? '' : '12px';
      break;
  }
}

export function toggleCodeTheme(
  block: HTMLElement,
  theme: 'light' | 'dark'
): void {
  const wrapper = block.querySelector<HTMLElement>('.rt-code-block');
  if (wrapper) wrapper.dataset.theme = theme;
}

export function toggleListStyle(
  block: HTMLElement,
  style: 'unordered' | 'ordered'
): void {
  const oldList = block.querySelector<HTMLElement>('.rt-list-block');
  if (!oldList) return;

  const texts = Array.from(oldList.querySelectorAll('li')).map(
    li => li.textContent?.trim() ?? ''
  );

  const newList = createListContent(style);
  newList.innerHTML = '';
  (texts.length ? texts : ['']).forEach(text => {
    const li = document.createElement('li');
    li.setAttribute('contenteditable', 'true');
    li.textContent = text;
    newList.appendChild(li);
  });

  oldList.replaceWith(newList);
}

export function moveBlockUp(block: HTMLElement, root: HTMLElement): void {
  const siblings = Array.from(root.children).filter(el =>
    el.classList.contains('rt-block')
  ) as HTMLElement[];
  const idx = siblings.indexOf(block);
  if (idx > 0) siblings[idx - 1].insertAdjacentElement('beforebegin', block);
}

export function moveBlockDown(block: HTMLElement, root: HTMLElement): void {
  const siblings = Array.from(root.children).filter(el =>
    el.classList.contains('rt-block')
  ) as HTMLElement[];
  const idx = siblings.indexOf(block);
  if (idx < siblings.length - 1)
    siblings[idx + 1].insertAdjacentElement('afterend', block);
}

export function deleteBlock(
  block: HTMLElement,
  root: HTMLElement,
  createBlockFn: (type: string) => HTMLElement
): void {
  block.remove();
  if (root.querySelectorAll('.rt-block').length === 0) {
    root.prepend(createBlockFn('text'));
  }
}
