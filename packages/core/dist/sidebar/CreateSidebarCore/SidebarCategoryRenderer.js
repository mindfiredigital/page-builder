import { buildSidebarItem, buildCustomSidebarItem } from './SidebarItemBuilder.js';
/* Renders a single category block (Basic, Extra, or Custom) into the menu div */
export function renderCategory(category, components, templatesMenu) {
    /* Skip empty categories to avoid blank section headings */
    if (Array.isArray(components) && components.length === 0)
        return;
    const categoryMenu = document.createElement('div');
    categoryMenu.classList.add('category');
    const categoryHeading = document.createElement('h4');
    categoryHeading.classList.add('categoryHeading');
    categoryHeading.innerHTML = category;
    categoryMenu.prepend(categoryHeading);
    if (category === 'Basic') {
        /* Basic components come as objects with a `name` property */
        components.forEach((component) => {
            if (typeof component === 'object' &&
                component !== null &&
                'name' in component) {
                categoryMenu.appendChild(buildSidebarItem(component.name));
            }
        });
    }
    else if (Array.isArray(components)) {
        /* Extra and other array categories come as plain id strings */
        components.forEach((componentId) => {
            categoryMenu.appendChild(buildSidebarItem(componentId));
        });
    }
    else if (category === 'Custom' && typeof components === 'object') {
        /* Custom components are keyed objects with config values */
        Object.entries(components).forEach(([keyName, config]) => {
            categoryMenu.appendChild(buildCustomSidebarItem(keyName, config));
        });
    }
    templatesMenu.appendChild(categoryMenu);
}
