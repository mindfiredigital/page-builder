export function createTextContent(): HTMLElement {
  const div = document.createElement('div');
  div.classList.add('rt-block-content', 'rt-text-block');
  div.setAttribute('contenteditable', 'true');
  div.dataset.placeholder = 'Type text or paste a link';
  return div;
}

export function createHeadingContent(level: number): HTMLElement {
  const heading = document.createElement(`h${level}`) as HTMLElement;
  heading.classList.add('rt-block-content', 'rt-heading-block');
  heading.setAttribute('contenteditable', 'true');
  heading.dataset.placeholder = 'Heading';
  heading.dataset.level = String(level);
  return heading;
}

export function createImageContent(): HTMLElement {
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

export function createListContent(style: 'unordered' | 'ordered'): HTMLElement {
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

export function createCodeContent(): HTMLElement {
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

export function createQuoteContent(): HTMLElement {
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

export function createDelimiterContent(): HTMLElement {
  const div = document.createElement('div');
  div.classList.add('rt-block-content', 'rt-delimiter-block');
  div.setAttribute('contenteditable', 'false');
  div.textContent = '* * *';
  return div;
}

export function createRawHtmlContent(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.classList.add('rt-block-content', 'rt-rawhtml-block');
  wrapper.setAttribute('contenteditable', 'false');

  const textarea = document.createElement('textarea');
  textarea.classList.add('rt-rawhtml-textarea');
  textarea.placeholder = 'Enter HTML code';
  wrapper.appendChild(textarea);
  return wrapper;
}

export function createWarningContent(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.classList.add('rt-block-content', 'rt-warning-block');
  wrapper.setAttribute('contenteditable', 'false');

  const icon = document.createElement('div');
  icon.classList.add('rt-warning-icon');
  icon.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  const fields = document.createElement('div');
  fields.classList.add('rt-warning-fields');

  const title = document.createElement('div');
  title.classList.add('rt-warning-title');
  title.setAttribute('contenteditable', 'true');
  title.dataset.placeholder = 'Title';

  const message = document.createElement('div');
  message.classList.add('rt-warning-message');
  message.setAttribute('contenteditable', 'true');
  message.dataset.placeholder = 'Message';

  fields.appendChild(title);
  fields.appendChild(message);
  wrapper.appendChild(icon);
  wrapper.appendChild(fields);
  return wrapper;
}

export function createChecklistItem(): HTMLElement {
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

export function createChecklistContent(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.classList.add('rt-block-content', 'rt-checklist-block');
  wrapper.setAttribute('contenteditable', 'false');
  wrapper.appendChild(createChecklistItem());

  wrapper.addEventListener('keydown', (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (e.key === 'Enter' && target.classList.contains('rt-checklist-text')) {
      e.preventDefault();
      const newItem = createChecklistItem();
      wrapper.appendChild(newItem);
      newItem.querySelector<HTMLElement>('.rt-checklist-text')?.focus();
    }
  });

  return wrapper;
}

export function createBlockContent(type: string): HTMLElement {
  switch (type) {
    case 'heading':
      return createHeadingContent(2);
    case 'image':
      return createImageContent();
    case 'list':
      return createListContent('unordered');
    case 'code':
      return createCodeContent();
    case 'quote':
      return createQuoteContent();
    case 'delimiter':
      return createDelimiterContent();
    case 'rawhtml':
      return createRawHtmlContent();
    case 'warning':
      return createWarningContent();
    case 'checklist':
      return createChecklistContent();
    default:
      return createTextContent();
  }
}
