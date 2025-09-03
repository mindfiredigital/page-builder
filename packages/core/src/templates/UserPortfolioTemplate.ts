import {
  ImageComponent,
  TextComponent,
  ContainerComponent,
  TwoColumnContainer,
} from '../components/index';

export class UserPortfolioTemplate {
  public create(): HTMLElement {
    // Create main portfolio container using ContainerComponent
    const portfolioContainer = new ContainerComponent();
    const containerElement = portfolioContainer.create();

    // Add styles to portfolio container directly
    const styles = {
      border: 'none',
      padding: '40px',
      margin: '20px auto',
      backgroundColor: '#ffffff',
      borderRadius: '2px',
      boxShadow: '0 12px 50px rgba(0, 0, 0, 0.1)',
      maxWidth: '700px',
      fontFamily: "'Roboto', sans-serif",
      overflow: 'hidden',
      position: 'relative',
      textAlign: 'center',
      transition: 'transform 0.3s ease-in-out',
    };

    Object.assign(containerElement.style, styles);

    // Add hover effect for subtle animation
    containerElement.addEventListener('mouseenter', () => {
      containerElement.style.transform = 'scale(1.05)';
      containerElement.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
    });
    containerElement.addEventListener('mouseleave', () => {
      containerElement.style.transform = 'scale(1)';
      containerElement.style.boxShadow = '0 12px 50px rgba(0, 0, 0, 0.1)';
    });

    // Title Section with Styled Text Component
    const nameText = new TextComponent('John Doe');
    const nameElement = nameText.create();
    nameElement.style.fontSize = '38px';
    nameElement.style.fontWeight = '700';
    nameElement.style.marginBottom = '15px';
    nameElement.style.color = '#333';
    containerElement.appendChild(nameElement);

    // Image Section with placeholder text and upload functionality
    const imageSection = new ImageComponent();
    const imageElement = imageSection.create(null, null);
    imageElement.style.borderRadius = '50%';
    imageElement.style.width = '140px';
    imageElement.style.height = '140px';
    imageElement.style.marginBottom = '30px';
    imageElement.style.backgroundColor = '#f0f0f0';
    imageElement.style.color = '#999';
    imageElement.style.display = 'flex';
    imageElement.style.alignItems = 'center';
    imageElement.style.justifyContent = 'center';
    imageElement.style.fontSize = '14px';
    imageElement.style.cursor = 'pointer';
    imageElement.textContent = 'Insert Your Image';

    // File input for uploading an image
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    // Handle image upload
    fileInput.addEventListener('change', event => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            imageElement.style.backgroundImage = `url(${reader.result})`;
            imageElement.style.backgroundSize = 'cover';
            imageElement.style.backgroundPosition = 'center';
            imageElement.textContent = ''; // Remove placeholder text
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Trigger file input on imageElement click
    imageElement.addEventListener('click', () => fileInput.click());

    containerElement.appendChild(imageElement);
    containerElement.appendChild(fileInput);

    // User Details Section using TwoColumnContainer for layout
    const userDetailsContainer = new TwoColumnContainer();
    const detailsElement = userDetailsContainer.create();
    detailsElement.style.display = 'flex';
    detailsElement.style.justifyContent = 'space-evenly';
    detailsElement.style.marginBottom = '30px';

    const roleText = new TextComponent('Web Developer');
    const professionText = new TextComponent('Full Stack Developer');
    roleText.create().style.fontSize = '18px';
    roleText.create().style.color = '#555';
    professionText.create().style.fontSize = '18px';
    professionText.create().style.fontStyle = 'italic';
    professionText.create().style.color = '#777';
    userDetailsContainer.create().appendChild(roleText.create());
    userDetailsContainer.create().appendChild(professionText.create());

    containerElement.appendChild(detailsElement);

    // User Description Section using TextComponent
    const descriptionText = new TextComponent(
      'Hello. I am John Doe, a passionate developer who loves creating innovative and user-friendly websites. I have experience in both front-end and back-end development.'
    );
    const descriptionElement = descriptionText.create();
    descriptionElement.style.fontSize = '16px';
    descriptionElement.style.lineHeight = '1.7';
    descriptionElement.style.marginBottom = '40px';
    descriptionElement.style.color = '#555';
    descriptionElement.style.textAlign = 'left';
    descriptionElement.style.padding = '0 10px';
    containerElement.appendChild(descriptionElement);

    return containerElement; // Return the final container element
  }
}
