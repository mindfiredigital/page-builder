import { buildSidebarItem, buildCustomSidebarItem } from './SidebarItemBuilder';

/* Renders a single category block (Basic, Extra, or Custom) into the menu div */
export function renderCategory(
  category: string,
  components: CategoryComponents,
  templatesMenu: HTMLElement
): void {
  /* Skip empty categories to avoid blank section headings */
  if (Array.isArray(components) && components.length === 0) return;

  const categoryMenu = document.createElement('div');
  categoryMenu.classList.add('category');

  const categoryHeading = document.createElement('h4');
  categoryHeading.classList.add('categoryHeading');
  categoryHeading.innerHTML = category;
  categoryMenu.prepend(categoryHeading);

  if (category === 'Basic') {
    /* Basic components come as objects with a `name` property */
    (components as BasicComponent[]).forEach((component: BasicComponent) => {
      if (
        typeof component === 'object' &&
        component !== null &&
        'name' in component
      ) {
        categoryMenu.appendChild(buildSidebarItem(component.name));
      }
    });
  } else if (Array.isArray(components)) {
    /* Extra and other array categories come as plain id strings */
    (components as string[]).forEach((componentId: string) => {
      categoryMenu.appendChild(buildSidebarItem(componentId));
    });
  } else if (category === 'Custom' && typeof components === 'object') {
    /* Custom components are keyed objects with config values */
    Object.entries(components as CustomComponentConfig).forEach(
      ([keyName, config]) => {
        categoryMenu.appendChild(buildCustomSidebarItem(keyName, config));
      }
    );
  }

  templatesMenu.appendChild(categoryMenu);
}
