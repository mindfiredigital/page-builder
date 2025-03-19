import { svgs } from '../icons/svgs';
export function createSidebar(dynamicComponents: DynamicComponents) {
  // We have default values if there is no custom components are specified within parameters
  if (
    !dynamicComponents ||
    (dynamicComponents.Basic.length === 0 &&
      dynamicComponents.Extra.length === 0 &&
      dynamicComponents.Custom.length === 0)
  ) {
    dynamicComponents = {
      Basic: [
        'button',
        'header',
        'text',
        'image',
        'video',
        'container',
        'twoCol',
        'threeCol',
        'table',
        'link',
      ],
      // Add portfolio for version 2
      Extra: ['landingpage'],
      Custom: [],
    };
  }
  const sidebar = document.getElementById('sidebar')!;
  if (!sidebar) {
    console.error('Sidebar element not found');
    return;
  }

  // Define your components, icons, and titles as before
  const icons: { [key: string]: string } = {
    button: svgs.button,
    header: svgs.header,
    image: svgs.image,
    video: svgs.video,
    text: svgs.text,
    container: svgs.container,
    twoCol: svgs.twocol,
    threeCol: svgs.threecol,
    table: svgs.table,
    // portfolio: 'dist/icons/portfolio.png',
    landingpage: svgs.landing,
    link: svgs.hyperlink,
  };

  const titles: { [key: string]: string } = {
    button: 'Button',
    header: 'Header',
    image: 'Image',
    video: 'Link Video',
    text: 'Text',
    container: 'Container',
    twoCol: 'Two Column Layout',
    threeCol: 'Three Column Layout',
    table: 'Table',
    // portfolio: 'Portfolio Template',
    landingpage: 'Landing Page Template',
    link: 'Link',
  };

  // Create the Templates menu section
  const templatesMenu = document.createElement('div');
  templatesMenu.classList.add('menu');

  // Depending upon the config object of the dynamic components, it will add components to the sidebar
  Object.entries(dynamicComponents).forEach(([category, components]) => {
    const categoryMenu = document.createElement('div');
    categoryMenu.classList.add('category');

    const categoryHeading = document.createElement('h4');
    categoryHeading.classList.add('categoryHeading');
    categoryHeading.innerHTML = category;
    categoryMenu.prepend(categoryHeading);

    components.forEach((componentId: any) => {
      const iconElement = document.createElement('div');
      iconElement.classList.add('draggable');
      iconElement.id = componentId;
      iconElement.setAttribute('draggable', 'true');
      iconElement.setAttribute('data-component', componentId);

      const customTitle = titles[componentId] || `Drag to add ${componentId}`;
      iconElement.setAttribute('title', customTitle);

      // Add SVG as innerHTML
      if (icons[componentId]) {
        iconElement.innerHTML = icons[componentId];

        // Optionally style the SVG
        const svgElement = iconElement.querySelector('svg');
        if (svgElement) {
          svgElement.classList.add('component-icon');
        }
      } else {
        console.warn(`Icon not found for component: ${componentId}`);
      }

      categoryMenu.appendChild(iconElement);
    });

    templatesMenu.appendChild(categoryMenu);
  });

  sidebar.appendChild(templatesMenu);
}
