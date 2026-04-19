import { ContainerComponent } from '../../components/index.js';
import { TextComponent } from '../../components/index.js';
import { ButtonComponent } from '../../components/index.js';
import { enableDragAndResize } from './LandingPageDragResize.js';
/* Builds the top navigation bar with a brand logo and nav links */
export function createHeaderSection() {
  const headerSection = new ContainerComponent();
  const headerElement = headerSection.create();
  headerElement.classList.add('container');
  Object.assign(headerElement.style, {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    width: '100%',
  });
  enableDragAndResize(headerElement);
  /* Brand logo text */
  const logo = new TextComponent('MyBrand');
  const logoElement = logo.create();
  Object.assign(logoElement.style, {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  });
  /* Nav links row */
  const navLinks = new ContainerComponent();
  const navElement = navLinks.create();
  navElement.classList.add('container');
  Object.assign(navElement.style, { display: 'flex', gap: '20px' });
  enableDragAndResize(navElement);
  /* Add each nav link as a text element */
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
  return headerElement;
}
/* Builds the hero banner with a title, subtitle, and CTA button */
export function createHeroSection() {
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
  /* Main headline */
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
  /* Supporting subtitle */
  const heroSubtitle = new TextComponent(
    'Discover amazing features and build better products with us.'
  );
  const subtitleElement = heroSubtitle.create();
  Object.assign(subtitleElement.style, {
    fontSize: '18px',
    color: '#666',
    marginBottom: '30px',
  });
  /* Call-to-action button with hover effect */
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
  /* Hover colour swap */
  ctaElement.addEventListener('mouseenter', () => {
    ctaElement.style.backgroundColor = '#0056b3';
  });
  ctaElement.addEventListener('mouseleave', () => {
    ctaElement.style.backgroundColor = '#007bff';
  });
  heroElement.appendChild(titleElement);
  heroElement.appendChild(subtitleElement);
  heroElement.appendChild(ctaElement);
  return heroElement;
}
/* Builds the footer strip with a copyright notice */
export function createFooterSection() {
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
  const footerText = new TextComponent('© 2025 MyBrand. All rights reserved.');
  const footerTextElement = footerText.create();
  Object.assign(footerTextElement.style, {
    fontSize: '14px',
    color: '#999',
  });
  footerElement.appendChild(footerTextElement);
  return footerElement;
}
