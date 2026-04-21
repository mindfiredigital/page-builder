import { svgs } from '../../icons/svgs';
import { Canvas } from '../../canvas/Canvas';

/* All button icon references */
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

/* Returns the left-side button list filtered by layout mode and editable state */
export function getLeftButtons(editable: boolean | null): NavButton[] {
  const isGridMode = Canvas.layoutMode === 'grid';

  const allLeftButtons: NavButton[] = editable
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

  /* Preview buttons are only shown in grid mode; non-preview buttons always show */
  return allLeftButtons.filter(btn => (btn.isPreview ? isGridMode : true));
}

/* Returns the right-side button list based on editable state and attribute tab flag */
export function getRightButtons(
  editable: boolean | null,
  showAttributeTab?: boolean
): NavButton[] {
  if (editable === true || editable === null) {
    return [
      { id: 'view-btn', icon: icons.view, title: 'View' },
      { id: 'save-btn', icon: icons.save, title: 'Save Layout' },
      { id: 'reset-btn', icon: icons.reset, title: 'Reset' },
      { id: 'export-btn', icon: icons.export, title: 'Export' },
      { id: 'menu-btn', icon: icons.menu, title: 'Customization Menu' },
    ];
  }

  if (editable === false && showAttributeTab === true) {
    return [
      { id: 'view-btn', icon: icons.view, title: 'View' },
      { id: 'export-btn', icon: icons.export, title: 'Export' },
      { id: 'menu-btn', icon: icons.menu, title: 'Customization Menu' },
    ];
  }

  /* View-only mode without attribute tab — minimum set */
  return [
    { id: 'view-btn', icon: icons.view, title: 'View' },
    { id: 'export-btn', icon: icons.export, title: 'Export' },
  ];
}
