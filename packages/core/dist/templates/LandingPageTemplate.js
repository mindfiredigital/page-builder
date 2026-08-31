import { ContainerComponent } from '../components/index.js';
import { enableDragAndResize } from './LandingPageTemplateCore/index.js';
import { createHeaderSection, createHeroSection, createFooterSection, } from './LandingPageTemplateCore/index.js';
export class LandingPageTemplate {
    /* Builds and returns the complete landing page element */
    create() {
        /* Root wrapper that holds header, hero, and footer */
        const landingPageContainer = new ContainerComponent();
        const containerElement = landingPageContainer.create();
        containerElement.classList.add('container');
        Object.assign(containerElement.style, {
            width: '100%',
            maxWidth: 'none',
            margin: '0 auto',
            padding: '20px',
            fontFamily: "'Roboto', sans-serif",
        });
        /* Root container is itself draggable/resizable */
        enableDragAndResize(containerElement);
        /* Assemble the three sections in order */
        containerElement.appendChild(createHeaderSection());
        containerElement.appendChild(createHeroSection());
        containerElement.appendChild(createFooterSection());
        return containerElement;
    }
}
