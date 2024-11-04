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
  const buttons = [
    { id: 'preview-desktop', icon: icons.desktop, title: 'Preview in Desktop' },
    { id: 'preview-tablet', icon: icons.tablet, title: 'Preview in Tablet' },
    { id: 'preview-mobile', icon: icons.mobile, title: 'Preview in Mobile' },
    { id: 'save-btn', icon: icons.save, title: 'Save Layout' },
    { id: 'export-html-btn', icon: icons.export, title: 'Export HTML' },
  ];

  // Create buttons
  buttons.forEach(({ id, icon, title }) => {
    const button = document.createElement('button');
    button.id = id;
    button.classList.add('preview-btn');
    button.title = title; // Set the title for tooltip

    const img = document.createElement('img');
    img.src = icon; // Use the icon path
    img.alt = `${title}`; // Use title for alt text
    img.classList.add('nav-icon');

    button.appendChild(img);
    navbar.appendChild(button);
  });

  return navbar; // Return the constructed navbar
}
