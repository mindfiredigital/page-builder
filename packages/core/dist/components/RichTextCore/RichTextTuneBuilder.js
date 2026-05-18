import {
  RICH_TEXT_BLOCK_TYPES,
  RICH_TEXT_TUNE_ICONS,
} from '../../constants/index.js';
export function buildSeparator() {
  const hr = document.createElement('hr');
  hr.classList.add('rt-popover-separator');
  return hr;
}
export function buildTuneItem(item, callbacks) {
  if (item.submenu) return buildSubmenuItem(item, callbacks);
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
      item.action();
      callbacks.hidePopover();
    });
  }
  return el;
}
export function buildSubmenuItem(item, callbacks) {
  const el = document.createElement('div');
  el.classList.add('rt-popover-item', 'rt-popover-item--submenu');
  el.setAttribute('contenteditable', 'false');
  el.innerHTML = `<span class="rt-popover-icon">${item.icon}</span><span class="rt-popover-label">${item.label}</span><span class="rt-popover-arrow">›</span>`;
  el.addEventListener('mouseenter', () => {
    var _a;
    callbacks.cancelHideSubmenu();
    callbacks.showSubmenu(
      (_a = item.submenu) !== null && _a !== void 0 ? _a : [],
      el
    );
  });
  el.addEventListener('mouseleave', () => callbacks.scheduleHideSubmenu());
  return el;
}
export function getBlockSpecificTunes(block, blockType, actions) {
  var _a, _b, _c, _d;
  const icons = RICH_TEXT_TUNE_ICONS;
  switch (blockType) {
    case 'text': {
      const currentAlign = block.dataset.align || 'left';
      return [
        {
          label: 'Align Left',
          icon: icons.alignLeft,
          active: currentAlign === 'left',
          action: () => actions.applyAlignment(block, 'left'),
        },
        {
          label: 'Align Center',
          icon: icons.alignCenter,
          active: currentAlign === 'center',
          action: () => actions.applyAlignment(block, 'center'),
        },
        {
          label: 'Align Right',
          icon: icons.alignRight,
          active: currentAlign === 'right',
          action: () => actions.applyAlignment(block, 'right'),
        },
        {
          label: 'Convert to',
          icon: icons.convertTo,
          submenu: [
            {
              label: 'Heading',
              icon: RICH_TEXT_BLOCK_TYPES[1].icon,
              action: () => actions.convertBlock(block, 'heading'),
            },
            {
              label: 'List',
              icon: RICH_TEXT_BLOCK_TYPES[3].icon,
              action: () => actions.convertBlock(block, 'list'),
            },
            {
              label: 'Quote',
              icon: RICH_TEXT_BLOCK_TYPES[5].icon,
              action: () => actions.convertBlock(block, 'quote'),
            },
            {
              label: 'Checklist',
              icon: RICH_TEXT_BLOCK_TYPES[9].icon,
              action: () => actions.convertBlock(block, 'checklist'),
            },
          ],
        },
      ];
    }
    case 'heading': {
      const headingEl = block.querySelector('.rt-heading-block');
      const currentLevel = parseInt(
        (_a =
          headingEl === null || headingEl === void 0
            ? void 0
            : headingEl.dataset.level) !== null && _a !== void 0
          ? _a
          : '2',
        10
      );
      const levelItems = [1, 2, 3, 4, 5, 6].map(level => ({
        label: `Heading ${level}`,
        icon: `<span style="font-weight:700;font-size:12px;line-height:1">H${level}</span>`,
        active: currentLevel === level,
        action: () => actions.changeHeadingLevel(block, level),
      }));
      return [
        ...levelItems,
        {
          label: 'Convert to',
          icon: icons.convertTo,
          submenu: [
            {
              label: 'Text',
              icon: RICH_TEXT_BLOCK_TYPES[0].icon,
              action: () => actions.convertBlock(block, 'text'),
            },
            {
              label: 'List',
              icon: RICH_TEXT_BLOCK_TYPES[3].icon,
              action: () => actions.convertBlock(block, 'list'),
            },
            {
              label: 'Quote',
              icon: RICH_TEXT_BLOCK_TYPES[5].icon,
              action: () => actions.convertBlock(block, 'quote'),
            },
            {
              label: 'Checklist',
              icon: RICH_TEXT_BLOCK_TYPES[9].icon,
              action: () => actions.convertBlock(block, 'checklist'),
            },
          ],
        },
      ];
    }
    case 'code': {
      const codeWrapper = block.querySelector('.rt-code-block');
      const currentTheme =
        (_b =
          codeWrapper === null || codeWrapper === void 0
            ? void 0
            : codeWrapper.dataset.theme) !== null && _b !== void 0
          ? _b
          : 'light';
      return [
        {
          label: 'Light mode',
          icon: icons.sun,
          active: currentTheme === 'light',
          action: () => actions.toggleCodeTheme(block, 'light'),
        },
        {
          label: 'Dark mode',
          icon: icons.moon,
          active: currentTheme === 'dark',
          action: () => actions.toggleCodeTheme(block, 'dark'),
        },
      ];
    }
    case 'list': {
      const listEl = block.querySelector('.rt-list-block');
      const currentStyle =
        (_c =
          listEl === null || listEl === void 0
            ? void 0
            : listEl.dataset.listStyle) !== null && _c !== void 0
          ? _c
          : 'unordered';
      return [
        {
          label: 'Unordered',
          icon: icons.unordered,
          active: currentStyle === 'unordered',
          action: () => actions.toggleListStyle(block, 'unordered'),
        },
        {
          label: 'Ordered',
          icon: icons.ordered,
          active: currentStyle === 'ordered',
          action: () => actions.toggleListStyle(block, 'ordered'),
        },
        {
          label: 'Convert to',
          icon: icons.convertTo,
          submenu: [
            {
              label: 'Text',
              icon: RICH_TEXT_BLOCK_TYPES[0].icon,
              action: () => actions.convertBlock(block, 'text'),
            },
            {
              label: 'Heading',
              icon: RICH_TEXT_BLOCK_TYPES[1].icon,
              action: () => actions.convertBlock(block, 'heading'),
            },
            {
              label: 'Quote',
              icon: RICH_TEXT_BLOCK_TYPES[5].icon,
              action: () => actions.convertBlock(block, 'quote'),
            },
            {
              label: 'Checklist',
              icon: RICH_TEXT_BLOCK_TYPES[9].icon,
              action: () => actions.convertBlock(block, 'checklist'),
            },
          ],
        },
      ];
    }
    case 'image': {
      const imageBlock = block.querySelector('.rt-image-block');
      return [
        {
          label: 'With border',
          icon: icons.imgBorder,
          active:
            (imageBlock === null || imageBlock === void 0
              ? void 0
              : imageBlock.dataset.border) === 'true',
          action: () => actions.toggleImageOption(block, 'border'),
        },
        {
          label: 'Stretch image',
          icon: icons.imgStretch,
          active:
            (imageBlock === null || imageBlock === void 0
              ? void 0
              : imageBlock.dataset.stretch) === 'true',
          action: () => actions.toggleImageOption(block, 'stretch'),
        },
        {
          label: 'With background',
          icon: icons.imgBackground,
          active:
            (imageBlock === null || imageBlock === void 0
              ? void 0
              : imageBlock.dataset.background) === 'true',
          action: () => actions.toggleImageOption(block, 'background'),
        },
      ];
    }
    case 'delimiter': {
      return [
        {
          label: 'Convert to',
          icon: icons.convertTo,
          submenu: [
            {
              label: 'Text',
              icon: RICH_TEXT_BLOCK_TYPES[0].icon,
              action: () => actions.convertBlock(block, 'text'),
            },
            {
              label: 'Heading',
              icon: RICH_TEXT_BLOCK_TYPES[1].icon,
              action: () => actions.convertBlock(block, 'heading'),
            },
            {
              label: 'List',
              icon: RICH_TEXT_BLOCK_TYPES[3].icon,
              action: () => actions.convertBlock(block, 'list'),
            },
            {
              label: 'Quote',
              icon: RICH_TEXT_BLOCK_TYPES[5].icon,
              action: () => actions.convertBlock(block, 'quote'),
            },
            {
              label: 'Checklist',
              icon: RICH_TEXT_BLOCK_TYPES[9].icon,
              action: () => actions.convertBlock(block, 'checklist'),
            },
          ],
        },
      ];
    }
    case 'quote': {
      const currentAlign =
        (_d = block.dataset.align) !== null && _d !== void 0 ? _d : 'left';
      return [
        {
          label: 'Align Left',
          icon: icons.alignLeft,
          active: currentAlign === 'left',
          action: () => actions.applyAlignment(block, 'left'),
        },
        {
          label: 'Align Center',
          icon: icons.alignCenter,
          active: currentAlign === 'center',
          action: () => actions.applyAlignment(block, 'center'),
        },
        {
          label: 'Convert to',
          icon: icons.convertTo,
          submenu: [
            {
              label: 'Text',
              icon: RICH_TEXT_BLOCK_TYPES[0].icon,
              action: () => actions.convertBlock(block, 'text'),
            },
            {
              label: 'Heading',
              icon: RICH_TEXT_BLOCK_TYPES[1].icon,
              action: () => actions.convertBlock(block, 'heading'),
            },
            {
              label: 'List',
              icon: RICH_TEXT_BLOCK_TYPES[3].icon,
              action: () => actions.convertBlock(block, 'list'),
            },
            {
              label: 'Checklist',
              icon: RICH_TEXT_BLOCK_TYPES[9].icon,
              action: () => actions.convertBlock(block, 'checklist'),
            },
          ],
        },
      ];
    }
    case 'checklist':
    case 'rawhtml':
    case 'warning':
    default:
      return [];
  }
}
export function getDefaultTunes(block, actions) {
  return [
    {
      label: 'Move up',
      icon: RICH_TEXT_TUNE_ICONS.moveUp,
      action: () => actions.moveBlockUp(block),
    },
    {
      label: 'Delete',
      icon: RICH_TEXT_TUNE_ICONS.delete,
      danger: true,
      action: () => actions.deleteBlock(block),
    },
    {
      label: 'Move down',
      icon: RICH_TEXT_TUNE_ICONS.moveDown,
      action: () => actions.moveBlockDown(block),
    },
  ];
}
