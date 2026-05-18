import {
  createBlockContent,
  createChecklistItem,
  createHeadingContent,
  createListContent,
} from './RichTextBlockCreators.js';
export function applyAlignment(block, align) {
  const content = block.querySelector('.rt-block-content');
  if (content) content.style.textAlign = align;
  block.dataset.align = align;
}
export function extractBlockText(content, fromType) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
  if (!content) return '';
  switch (fromType) {
    case 'list':
      return Array.from(content.querySelectorAll('li'))
        .map(li => {
          var _a, _b;
          return (_b =
            (_a = li.textContent) === null || _a === void 0
              ? void 0
              : _a.trim()) !== null && _b !== void 0
            ? _b
            : '';
        })
        .filter(Boolean)
        .join('\n');
    case 'quote':
      return (_c =
        (_b =
          (_a = content.querySelector('.rt-quote-text')) === null ||
          _a === void 0
            ? void 0
            : _a.textContent) === null || _b === void 0
          ? void 0
          : _b.trim()) !== null && _c !== void 0
        ? _c
        : '';
    case 'checklist':
      return Array.from(content.querySelectorAll('.rt-checklist-text'))
        .map(el => {
          var _a, _b;
          return (_b =
            (_a = el.textContent) === null || _a === void 0
              ? void 0
              : _a.trim()) !== null && _b !== void 0
            ? _b
            : '';
        })
        .filter(Boolean)
        .join('\n');
    case 'warning': {
      const t =
        (_f =
          (_e =
            (_d = content.querySelector('.rt-warning-title')) === null ||
            _d === void 0
              ? void 0
              : _d.textContent) === null || _e === void 0
            ? void 0
            : _e.trim()) !== null && _f !== void 0
          ? _f
          : '';
      const m =
        (_j =
          (_h =
            (_g = content.querySelector('.rt-warning-message')) === null ||
            _g === void 0
              ? void 0
              : _g.textContent) === null || _h === void 0
            ? void 0
            : _h.trim()) !== null && _j !== void 0
          ? _j
          : '';
      return [t, m].filter(Boolean).join('\n');
    }
    default:
      return (_l =
        (_k = content.textContent) === null || _k === void 0
          ? void 0
          : _k.trim()) !== null && _l !== void 0
        ? _l
        : '';
  }
}
export function injectTextIntoBlock(content, toType, text) {
  var _a, _b;
  const lines = text.split('\n').filter(l => l.trim());
  const firstLine = (_a = lines[0]) !== null && _a !== void 0 ? _a : text;
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
      const quoteText = content.querySelector('.rt-quote-text');
      if (quoteText) quoteText.textContent = firstLine;
      break;
    }
    case 'checklist': {
      content.innerHTML = '';
      (lines.length ? lines : [text]).forEach(line => {
        const item = createChecklistItem();
        const span = item.querySelector('.rt-checklist-text');
        if (span) span.textContent = line;
        content.appendChild(item);
      });
      break;
    }
    default: {
      const editable =
        (_b = content.querySelector('[contenteditable="true"]')) !== null &&
        _b !== void 0
          ? _b
          : content.getAttribute('contenteditable') === 'true'
            ? content
            : null;
      if (editable) editable.textContent = text;
    }
  }
}
export function convertBlock(block, toType) {
  var _a;
  const oldContent = block.querySelector('.rt-block-content');
  const fromType =
    (_a = block.dataset.blockType) !== null && _a !== void 0 ? _a : 'text';
  const preservedText = extractBlockText(oldContent, fromType);
  const newContent = createBlockContent(toType);
  oldContent === null || oldContent === void 0
    ? void 0
    : oldContent.replaceWith(newContent);
  block.dataset.blockType = toType;
  delete block.dataset.align;
  if (preservedText) {
    injectTextIntoBlock(newContent, toType, preservedText);
  }
}
export function changeHeadingLevel(block, level) {
  var _a, _b;
  const oldHeading = block.querySelector('.rt-heading-block');
  const preservedText =
    (_b =
      (_a =
        oldHeading === null || oldHeading === void 0
          ? void 0
          : oldHeading.textContent) === null || _a === void 0
        ? void 0
        : _a.trim()) !== null && _b !== void 0
      ? _b
      : '';
  const newHeading = createHeadingContent(level);
  if (preservedText) newHeading.textContent = preservedText;
  oldHeading === null || oldHeading === void 0
    ? void 0
    : oldHeading.replaceWith(newHeading);
}
export function toggleImageOption(block, option) {
  const imageBlock = block.querySelector('.rt-image-block');
  if (!imageBlock) return;
  const isOn = imageBlock.dataset[option] === 'true';
  imageBlock.dataset[option] = isOn ? 'false' : 'true';
  const img = imageBlock.querySelector('.rt-image-preview');
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
export function toggleCodeTheme(block, theme) {
  const wrapper = block.querySelector('.rt-code-block');
  if (wrapper) wrapper.dataset.theme = theme;
}
export function toggleListStyle(block, style) {
  const oldList = block.querySelector('.rt-list-block');
  if (!oldList) return;
  const texts = Array.from(oldList.querySelectorAll('li')).map(li => {
    var _a, _b;
    return (_b =
      (_a = li.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !==
      null && _b !== void 0
      ? _b
      : '';
  });
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
export function moveBlockUp(block, root) {
  const siblings = Array.from(root.children).filter(el =>
    el.classList.contains('rt-block')
  );
  const idx = siblings.indexOf(block);
  if (idx > 0) siblings[idx - 1].insertAdjacentElement('beforebegin', block);
}
export function moveBlockDown(block, root) {
  const siblings = Array.from(root.children).filter(el =>
    el.classList.contains('rt-block')
  );
  const idx = siblings.indexOf(block);
  if (idx < siblings.length - 1)
    siblings[idx + 1].insertAdjacentElement('afterend', block);
}
export function deleteBlock(block, root, createBlockFn) {
  block.remove();
  if (root.querySelectorAll('.rt-block').length === 0) {
    root.prepend(createBlockFn('text'));
  }
}
