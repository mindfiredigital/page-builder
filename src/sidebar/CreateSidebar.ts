export function createSidebar() {
  const sidebar = document.getElementById('sidebar')!;

  const icons = {
    button: '/dist/icons/button.png',
    header: '/dist/icons/header.png',
    image: '/dist/icons/image.png',
    text: 'dist/icons/text.png',
    container: '/dist/icons/square.png',
  };

  Object.entries(icons).forEach(([componentId, iconPath]) => {
    const iconElement = document.createElement('div');
    iconElement.classList.add('draggable');
    iconElement.id = componentId;
    iconElement.setAttribute('draggable', 'true');

    const img = document.createElement('img');
    img.src = iconPath;
    img.alt = `${componentId} icon`;
    iconElement.appendChild(img);

    sidebar.appendChild(iconElement);
  });
}
