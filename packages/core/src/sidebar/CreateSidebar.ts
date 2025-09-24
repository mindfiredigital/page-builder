import { svgs } from '../icons/svgs';
export function createSidebar(
  dynamicComponents: DynamicComponents,
  editable: boolean | null
) {
  // We have default values if there is no custom components are specified within parameters
  if (
    !dynamicComponents ||
    (dynamicComponents.Basic.length === 0 &&
      dynamicComponents.Extra.length === 0 &&
      Object.keys(dynamicComponents.Custom).length === 0)
  ) {
    dynamicComponents = {
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
      ],

      // Add portfolio for version 2
      Extra: ['landingpage'],
      Custom: {},
    };
  }
  const sidebar = document.getElementById('sidebar')!;
  sidebar.classList.add('visible');
  if (!sidebar) {
    console.error('Sidebar element not found');
    return;
  }
  if (editable === false) {
    sidebar.style.display = 'none';
  }

  // Define your components, icons, and titles as before using it
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
    if (Array.isArray(components)) {
      if (components.length <= 0) {
        return;
      }
    }
    categoryMenu.prepend(categoryHeading);
    if (category === 'Basic') {
      components.forEach((component: BasicComponent) => {
        let componentId!: string;
        if (
          typeof component === 'object' &&
          component !== null &&
          'name' in component
        ) {
          componentId = component.name as string;
        }
        const iconElement = document.createElement('div');
        iconElement.classList.add('draggable');
        iconElement.id = componentId;
        iconElement.setAttribute('draggable', 'true');
        iconElement.setAttribute('data-component', componentId);

        const customTitle = titles[componentId] || `Drag to add ${componentId}`;
        iconElement.setAttribute('title', customTitle);

        // Add SVG as innerHTML
        if (icons[componentId]) {
          iconElement.innerHTML = ` ${icons[componentId]}
          <div class="drag-text">${componentId}</div>`;

          // Optionally style the SVG
          const svgElement = iconElement.querySelector('svg');
          if (svgElement) {
            svgElement.classList.add('component-icon');
          }
        } else {
          console.warn(`Icon not found for component: ${customTitle}`);
        }

        categoryMenu.appendChild(iconElement);
      });
    }
    // Handling standard dynamic components (Basic and Extra)
    else if (Array.isArray(components)) {
      components.forEach((componentId: string) => {
        // let componentId: string;

        const iconElement = document.createElement('div');
        iconElement.classList.add('draggable');
        iconElement.id = componentId;
        iconElement.setAttribute('draggable', 'true');
        iconElement.setAttribute('data-component', componentId);

        const customTitle = titles[componentId] || `Drag to add ${componentId}`;
        iconElement.setAttribute('title', customTitle);

        // Add SVG as innerHTML
        if (icons[componentId]) {
          iconElement.innerHTML = ` ${icons[componentId]}
          <div class="drag-text">${componentId}</div>`;

          // Optionally style the SVG
          const svgElement = iconElement.querySelector('svg');
          if (svgElement) {
            svgElement.classList.add('component-icon');
          }
        } else {
          console.warn(`Icon not found for component: ${customTitle}`);
        }

        categoryMenu.appendChild(iconElement);
      });
    }
    // Handling Custom components (which is an object)
    else if (category === 'Custom' && typeof components === 'object') {
      Object.entries(components).forEach(([keyName, config]) => {
        const iconElement = document.createElement('div');
        iconElement.classList.add('draggable', 'custom-component');
        iconElement.id = keyName;
        iconElement.setAttribute('draggable', 'true');
        iconElement.setAttribute('data-component', keyName);

        // Handle the config object properly - could be old format or new format
        if (typeof config === 'string') {
          // Handle legacy format where config is just the tag name string
          iconElement.setAttribute('data-tag-name', config);
          iconElement.setAttribute('title', `Drag to add ${keyName}`);

          // Create element with first letter of the key name
          const letterSpan = document.createElement('span');
          letterSpan.classList.add('custom-component-letter');
          letterSpan.textContent = keyName.charAt(0).toUpperCase();
          iconElement.appendChild(letterSpan);
        } else {
          // Handling new format with CustomComponentConfig
          const { component, svg, title, settingsComponent }: any = config;

          iconElement.setAttribute('data-tag-name', component);
          iconElement.setAttribute('title', title || `Drag to add ${keyName}`);
          // Store custom settings as a JSON string
          if (settingsComponent) {
            iconElement.setAttribute(
              'data-custom-settings',
              JSON.stringify(settingsComponent)
            );
          }

          if (svg) {
            // Using provided SVG
            iconElement.innerHTML = iconElement.innerHTML = ` ${svg}
          <div class="drag-text">${title}</div>`;

            // Style the SVG
            const svgElement = iconElement.querySelector('svg');
            if (svgElement) {
              svgElement.classList.add('component-icon');
            }
          } else {
            // Fallback to first letter if no SVG provided
            const letterSpan = document.createElement('span');
            letterSpan.classList.add('custom-component-letter');
            letterSpan.textContent = keyName.charAt(0).toUpperCase();
            iconElement.appendChild(letterSpan);
          }
        }

        categoryMenu.appendChild(iconElement);
      });
    }

    templatesMenu.appendChild(categoryMenu);
  });

  sidebar.appendChild(templatesMenu);
}
