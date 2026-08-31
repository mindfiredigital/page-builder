import { RICH_TEXT_BLOCK_TYPES, RICH_TEXT_TUNE_ICONS } from '../../constants';

export function buildSeparator(): HTMLElement {
  const hr = document.createElement('hr');
  hr.classList.add('rt-popover-separator');
  return hr;
}

export function buildTuneItem(
  item: TuneItem,
  callbacks: TuneItemCallbacks
): HTMLElement {
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
      item.action!();
      callbacks.hidePopover();
    });
  }
  return el;
}

export function buildSubmenuItem(
  item: TuneItem,
  callbacks: TuneItemCallbacks
): HTMLElement {
  const el = document.createElement('div');
  el.classList.add('rt-popover-item', 'rt-popover-item--submenu');
  el.setAttribute('contenteditable', 'false');
  el.innerHTML = `<span class="rt-popover-icon">${item.icon}</span><span class="rt-popover-label">${item.label}</span><span class="rt-popover-arrow">›</span>`;

  el.addEventListener('mouseenter', () => {
    callbacks.cancelHideSubmenu();
    callbacks.showSubmenu(item.submenu ?? [], el);
  });
  el.addEventListener('mouseleave', () => callbacks.scheduleHideSubmenu());
  return el;
}

export function getBlockSpecificTunes(
  block: HTMLElement,
  blockType: string,
  actions: TuneActions
): TuneItem[] {
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
      const headingEl = block.querySelector<HTMLElement>('.rt-heading-block');
      const currentLevel = parseInt(headingEl?.dataset.level ?? '2', 10);
      const levelItems: TuneItem[] = [1, 2, 3, 4, 5, 6].map(level => ({
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
      const codeWrapper = block.querySelector<HTMLElement>('.rt-code-block');
      const currentTheme = codeWrapper?.dataset.theme ?? 'light';
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
      const listEl = block.querySelector<HTMLElement>('.rt-list-block');
      const currentStyle = listEl?.dataset.listStyle ?? 'unordered';
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
      const imageBlock = block.querySelector<HTMLElement>('.rt-image-block');
      return [
        {
          label: 'With border',
          icon: icons.imgBorder,
          active: imageBlock?.dataset.border === 'true',
          action: () => actions.toggleImageOption(block, 'border'),
        },
        {
          label: 'Stretch image',
          icon: icons.imgStretch,
          active: imageBlock?.dataset.stretch === 'true',
          action: () => actions.toggleImageOption(block, 'stretch'),
        },
        {
          label: 'With background',
          icon: icons.imgBackground,
          active: imageBlock?.dataset.background === 'true',
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
      const currentAlign = block.dataset.align ?? 'left';
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

export function getDefaultTunes(
  block: HTMLElement,
  actions: TuneActions
): TuneItem[] {
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
