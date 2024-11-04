// Function to create the navbar
export function createNavbar() {
  const navbar = document.createElement('nav');
  navbar.id = 'preview-navbar';

  const icons = {
    desktop: '/dist/icons/computer.png',
    tablet: '/dist/icons/tablet.png',
    mobile: '/dist/icons/mobile.png',
    save: '/dist/icons/file.png',
    export: '/dist/icons/code.png',
  };

  // Array of button data with only titles
  const leftButtons = [
    { id: 'preview-desktop', icon: icons.desktop, title: 'Preview in Desktop' },
    { id: 'preview-tablet', icon: icons.tablet, title: 'Preview in Tablet' },
    { id: 'preview-mobile', icon: icons.mobile, title: 'Preview in Mobile' },
  ];

  const rightButtons = [
    { id: 'save-btn', icon: icons.save, title: 'Save Layout' },
    { id: 'export-html-btn', icon: icons.export, title: 'Export HTML' },
  ];

  const leftContainer = document.createElement('div');
  leftContainer.classList.add('left-buttons');

  leftButtons.forEach(({ id, icon, title }) => {
    const button = document.createElement('button');
    button.id = id;
    button.classList.add('preview-btn');
    button.title = title;

    const img = document.createElement('img');
    img.src = icon;
    img.alt = `${title}`;
    img.classList.add('nav-icon');

    button.appendChild(img);
    leftContainer.appendChild(button);
  });

  const centerText = document.createElement('div');
  centerText.classList.add('center-text');
  centerText.textContent = 'Page Builder';

  const rightContainer = document.createElement('div');
  rightContainer.classList.add('right-buttons');

  rightButtons.forEach(({ id, icon, title }) => {
    const button = document.createElement('button');
    button.id = id;
    button.classList.add('preview-btn');
    button.title = title;

    const img = document.createElement('img');
    img.src = icon;
    img.alt = `${title}`;
    img.classList.add('nav-icon');

    button.appendChild(img);
    rightContainer.appendChild(button);
  });

  navbar.appendChild(leftContainer);
  navbar.appendChild(centerText);
  navbar.appendChild(rightContainer);

  return navbar;
}
