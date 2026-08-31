import { renderCategory } from './CreateSidebarCore/index.js';
/* Default component set used when no custom config is provided */
const DEFAULT_DYNAMIC_COMPONENTS = {
    Basic: [
        { name: 'button' },
        { name: 'header' },
        { name: 'text' },
        { name: 'image' },
        { name: 'video' },
        { name: 'container' },
        { name: 'twoCol' },
        { name: 'threeCol' },
        { name: 'table' },
        { name: 'link' },
        { name: 'richtext' },
    ],
    Extra: ['landingpage'],
    Custom: {},
};
export function createSidebar(dynamicComponents, editable) {
    /* Fall back to defaults when nothing is passed in */
    const isEmptyConfig = !dynamicComponents ||
        (dynamicComponents.Basic.length === 0 &&
            dynamicComponents.Extra.length === 0 &&
            Object.keys(dynamicComponents.Custom).length === 0);
    if (isEmptyConfig) {
        dynamicComponents = DEFAULT_DYNAMIC_COMPONENTS;
    }
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
        console.error('Sidebar element not found');
        return;
    }
    sidebar.classList.add('visible');
    /* Hide the sidebar entirely in non-editable (preview/export) mode */
    if (editable === false) {
        sidebar.style.display = 'none';
    }
    /* Single menu wrapper that holds all category blocks */
    const templatesMenu = document.createElement('div');
    templatesMenu.classList.add('menu');
    /* Delegate each category to the category renderer */
    Object.entries(dynamicComponents).forEach(([category, components]) => {
        renderCategory(category, components, templatesMenu);
    });
    sidebar.appendChild(templatesMenu);
}
