import { Canvas } from '../canvas/Canvas';
import { svgs } from '../icons/svgs';

export function createNavbar(
  editable: boolean | null,
  brandTitle = 'Page Builder',
  showAttributeTab?: boolean
) {
  const navbar = document.createElement('nav');
  navbar.id = 'preview-navbar';

  const icons = {
    desktop: svgs.desktop,
    tablet: svgs.tablet,
    mobile: svgs.mobile,
    save: svgs.save,
    export: svgs.code,
    view: svgs.view,
    undo: svgs.undo,
    redo: svgs.redo,
    reset: svgs.reset,
    menu: svgs.customizationMenu,
    sidebarMenu: svgs.sidebarMenu,
  };
  const isGridMode = Canvas.layoutMode === 'grid';

  // Array of button data with only titles
  const allLeftButtons = editable
    ? [
        {
          id: 'preview-desktop',
          icon: icons.desktop,
          title: 'Preview in Desktop',
          isPreview: true,
        },
        {
          id: 'preview-tablet',
          icon: icons.tablet,
          title: 'Preview in Tablet',
          isPreview: true,
        },
        {
          id: 'preview-mobile',
          icon: icons.mobile,
          title: 'Preview in Mobile',
          isPreview: true,
        },
        {
          id: 'undo-btn',
          icon: icons.undo,
          title: 'Undo button',
          isPreview: false,
        },
        {
          id: 'redo-btn',
          icon: icons.redo,
          title: 'Redo button',
          isPreview: false,
        },
        {
          id: 'sidebar-menu',
          icon: icons.sidebarMenu,
          title: 'Sidebar Menu',
          isPreview: false,
        },
      ]
    : [
        {
          id: 'preview-desktop',
          icon: icons.desktop,
          title: 'Preview in Desktop',
          isPreview: true,
        },
        {
          id: 'preview-tablet',
          icon: icons.tablet,
          title: 'Preview in Tablet',
          isPreview: true,
        },
        {
          id: 'preview-mobile',
          icon: icons.mobile,
          title: 'Preview in Mobile',
          isPreview: true,
        },
      ];
  const leftButtons = allLeftButtons.filter(button => {
    if (button.isPreview) {
      return isGridMode;
    }
    // Always show non-preview buttons (undo/redo/sidebar menu).
    return true;
  });

  const rightButtons =
    editable === true || editable === null
      ? [
          { id: 'view-btn', icon: icons.view, title: 'View' },
          { id: 'save-btn', icon: icons.save, title: 'Save Layout' },
          { id: 'reset-btn', icon: icons.reset, title: 'Reset' },
          { id: 'export-btn', icon: icons.export, title: 'Export' },
          { id: 'menu-btn', icon: icons.menu, title: 'Customization Menu' },
        ]
      : editable === false && showAttributeTab === true
        ? [
            { id: 'view-btn', icon: icons.view, title: 'View' },
            { id: 'export-btn', icon: icons.export, title: 'Export' },
            { id: 'menu-btn', icon: icons.menu, title: 'Customization Menu' },
          ]
        : [
            { id: 'view-btn', icon: icons.view, title: 'View' },
            { id: 'export-btn', icon: icons.export, title: 'Export' },
          ];

  const leftContainer = document.createElement('div');
  leftContainer.classList.add('left-buttons');

  leftButtons.forEach(({ id, icon, title }) => {
    const button = document.createElement('button');
    button.id = id;
    button.classList.add('preview-btn');
    button.title = title;
    button.style.color = '#000';

    // Insert the SVG directly as innerHTML
    button.innerHTML = icon;

    const svgElement = button.querySelector('svg');
    if (svgElement) {
      svgElement.classList.add('nav-icon');
    }
    if (button.id === 'sidebar-menu') {
      button.style.backgroundColor = '#e2e8f0';
      button.style.borderColor = '#cbd5e1';
      button.onclick = () => {
        const sidebar = document.getElementById('sidebar');
        const hasClass = sidebar?.classList.contains('visible');
        if (sidebar) {
          if (hasClass) {
            sidebar.classList.remove('visible');
            sidebar.style.display = 'none';
            button.style.backgroundColor = '#ffffff';
            button.style.border = 'none';
            button.style.border = '1px solid #ffffff';
          } else {
            sidebar.style.display = 'block';
            sidebar.classList.add('visible');
            button.style.backgroundColor = '#e2e8f0';
            button.style.borderColor = '#cbd5e1';
          }
        }
      };
    }
    leftContainer.appendChild(button);
  });

  const centerText = document.createElement('div');
  centerText.classList.add('center-text');
  centerText.textContent = brandTitle;

  const rightContainer = document.createElement('div');
  rightContainer.classList.add('right-buttons');

  rightButtons.forEach(({ id, icon, title }) => {
    const button = document.createElement('button');
    button.id = id;
    button.classList.add('preview-btn');
    button.title = title;
    button.style.color = '#000';

    // Insert the SVG directly as innerHTML
    button.innerHTML = icon;

    const svgElement = button.querySelector('svg');
    if (svgElement) {
      svgElement.classList.add('nav-icon');
    }
    rightContainer.appendChild(button);
    if (id === 'menu-btn') {
      if (button) {
        button.onclick = () => {
          const customizeTab = document.getElementById('customization');
          const classList = customizeTab?.classList;
          const hasClass = classList?.contains('visible');
          if (customizeTab) {
            if (hasClass) {
              customizeTab.classList.remove('visible');
              customizeTab.style.display = 'none';
              button.style.backgroundColor = '#ffffff';
              button.style.border = 'none';
              button.style.border = '1px solid #ffffff';
            } else {
              customizeTab.style.display = 'block';
              customizeTab.classList.add('visible');
              button.style.backgroundColor = '#e2e8f0';
              button.style.borderColor = '#cbd5e1';
            }
          }
        };
      }
    }
  });

  navbar.appendChild(leftContainer);
  navbar.appendChild(centerText);
  navbar.appendChild(rightContainer);

  return navbar;
}
