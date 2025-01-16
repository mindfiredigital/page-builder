export function createSidebar() {
  const sidebar = document.getElementById('sidebar')!;

  // Define your components, icons, and titles as before
  const icons: { [key: string]: string } = {
    button: 'dist/icons/button.png',
    header: 'dist/icons/header.png',
    image: 'dist/icons/image.png',
    text: 'dist/icons/text.png',
    container: 'dist/icons/square.png',
    twoCol: 'dist/icons/column.png',
    threeCol: 'dist/icons/threecolumn.png',
    portfolio: 'dist/icons/portfolio.png',
    landingpage: 'dist/icons/landingpage.png',
  };

  const titles: { [key: string]: string } = {
    button: 'Button',
    header: 'Header',
    image: 'Image',
    text: 'Text',
    container: 'Container',
    twoCol: 'Two Column Layout',
    threeCol: 'Three Column Layout',
    portfolio: 'Portfolio Template',
    landingpage: 'Landing Page Template',
  };

  // Create the Templates menu section
  const templatesMenu = document.createElement('div');
  templatesMenu.classList.add('menu');
  // Categories under Templates
  const categories = {
    Basic: [
      'button',
      'header',
      'text',
      'image',
      'container',
      'twoCol',
      'threeCol',
    ],
    Extra: ['portfolio', 'landingpage'],
  };

  Object.entries(categories).forEach(([category, components]) => {
    const categoryMenu = document.createElement('div');
    categoryMenu.classList.add('category');
    categoryMenu.innerHTML = `<h4>${category}</h4>`;

    components.forEach(componentId => {
      const iconElement = document.createElement('div');
      iconElement.classList.add('draggable');
      iconElement.id = componentId;
      iconElement.setAttribute('draggable', 'true');
      iconElement.setAttribute('data-component', componentId);

      const customTitle = titles[componentId] || `Drag to add ${componentId}`;
      iconElement.setAttribute('title', customTitle);

      const img = document.createElement('img');
      img.src = icons[componentId];
      img.alt = `${componentId} icon`;
      iconElement.appendChild(img);

      categoryMenu.appendChild(iconElement);
    });

    templatesMenu.appendChild(categoryMenu);
  });

  sidebar.appendChild(templatesMenu);
}
