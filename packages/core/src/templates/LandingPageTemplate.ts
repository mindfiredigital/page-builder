import {
  ContainerComponent,
  TextComponent,
  ButtonComponent,
} from '../components/index';

export class LandingPageTemplate {
  public create(): HTMLElement {
    const enableDragAndResize = (element: HTMLElement) => {
      let isDragging = false;
      let isResizing = false;
      let startX: number,
        startY: number,
        startWidth: number,
        startHeight: number;
      let initialX = 0,
        initialY = 0; // To store the element's initial position

      // Make element draggable
      element.style.position = 'relative'; // Keep initial layout intact
      element.style.cursor = 'move';

      element.addEventListener('mousedown', e => {
        if (!isResizing) {
          isDragging = true;
          startX = e.clientX;
          startY = e.clientY;
          initialX = parseFloat(element.getAttribute('data-x') || '0');
          initialY = parseFloat(element.getAttribute('data-y') || '0');
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        }
      });

      const onMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;

          // Update transform for smooth movement
          const translateX = initialX + deltaX;
          const translateY = initialY + deltaY;

          element.style.transform = `translate(${translateX}px, ${translateY}px)`;
          element.setAttribute('data-x', translateX.toString());
          element.setAttribute('data-y', translateY.toString());
        }
      };

      const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      // Add resize handle only to container elements
      if (element.classList.contains('container')) {
        const resizeHandle = document.createElement('div');
        Object.assign(resizeHandle.style, {
          width: '10px',
          height: '10px',
          background: 'blue',
          position: 'absolute',
          right: '0',
          bottom: '0',
          cursor: 'se-resize',
        });
        element.appendChild(resizeHandle);

        resizeHandle.addEventListener('mousedown', e => {
          e.stopPropagation();
          isResizing = true;
          startWidth = element.offsetWidth;
          startHeight = element.offsetHeight;
          startX = e.clientX;
          startY = e.clientY;

          document.addEventListener('mousemove', onResizeMove);
          document.addEventListener('mouseup', onResizeUp);
        });

        const onResizeMove = (e: MouseEvent) => {
          if (isResizing) {
            const newWidth = startWidth + (e.clientX - startX);
            const newHeight = startHeight + (e.clientY - startY);

            element.style.width = `${newWidth}px`;
            element.style.height = `${newHeight}px`;
          }
        };

        const onResizeUp = () => {
          isResizing = false;
          document.removeEventListener('mousemove', onResizeMove);
          document.removeEventListener('mouseup', onResizeUp);
        };
      }
    };

    // Create main container
    const landingPageContainer = new ContainerComponent();
    const containerElement = landingPageContainer.create();
    containerElement.classList.add('container'); // Add a container class for identification
    Object.assign(containerElement.style, {
      width: '100%',
      maxWidth: 'none',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Roboto', sans-serif",
    });

    enableDragAndResize(containerElement);

    // Header Section
    const headerSection = new ContainerComponent();
    const headerElement = headerSection.create();
    headerElement.classList.add('container');
    Object.assign(headerElement.style, {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
      width: '100%', // Full width
    });
    enableDragAndResize(headerElement);

    const logo = new TextComponent('MyBrand');
    const logoElement = logo.create();
    Object.assign(logoElement.style, {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
    });

    const navLinks = new ContainerComponent();
    const navElement = navLinks.create();
    navElement.classList.add('container');
    Object.assign(navElement.style, {
      display: 'flex',
      gap: '20px',
    });
    enableDragAndResize(navElement);

    ['Home', 'Features', 'Contact'].forEach(linkText => {
      const link = new TextComponent(linkText);
      const linkElement = link.create();
      Object.assign(linkElement.style, {
        cursor: 'pointer',
        color: '#555',
        textDecoration: 'none',
      });
      navElement.appendChild(linkElement);
    });

    headerElement.appendChild(logoElement);
    headerElement.appendChild(navElement);

    // Hero Section
    const heroSection = new ContainerComponent();
    const heroElement = heroSection.create();
    heroElement.classList.add('container');
    Object.assign(heroElement.style, {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      marginBottom: '40px',
    });
    enableDragAndResize(heroElement);

    const heroTitle = new TextComponent('Welcome to My Landing Page');
    const titleElement = heroTitle.create();
    Object.assign(titleElement.style, {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      marginBottom: '40px',
      width: '100%',
    });

    const heroSubtitle = new TextComponent(
      'Discover amazing features and build better products with us.'
    );
    const subtitleElement = heroSubtitle.create();
    Object.assign(subtitleElement.style, {
      fontSize: '18px',
      color: '#666',
      marginBottom: '30px',
    });

    const ctaButton = new ButtonComponent();
    const ctaElement = ctaButton.create();
    Object.assign(ctaElement.style, {
      padding: '12px 24px',
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    });

    ctaElement.addEventListener('mouseenter', () => {
      ctaElement.style.backgroundColor = '#0056b3';
    });
    ctaElement.addEventListener('mouseleave', () => {
      ctaElement.style.backgroundColor = '#007bff';
    });

    heroElement.appendChild(titleElement);
    heroElement.appendChild(subtitleElement);
    heroElement.appendChild(ctaElement);

    // Footer Section
    const footerSection = new ContainerComponent();
    const footerElement = footerSection.create();
    footerElement.classList.add('container');
    Object.assign(footerElement.style, {
      textAlign: 'center',
      padding: '20px',
      marginTop: '40px',
      borderTop: '1px solid #ddd',
    });
    enableDragAndResize(footerElement);

    const footerText = new TextComponent(
      '© 2025 MyBrand. All rights reserved.'
    );
    const footerTextElement = footerText.create();
    Object.assign(footerTextElement.style, {
      fontSize: '14px',
      color: '#999',
    });

    footerElement.appendChild(footerTextElement);

    // Assemble the landing page
    containerElement.appendChild(headerElement);
    containerElement.appendChild(heroElement);
    containerElement.appendChild(footerElement);

    return containerElement;
  }
}
