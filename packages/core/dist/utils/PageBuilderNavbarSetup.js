import { createNavbar } from '../navbar/CreateNavbar.js';
/* Creates and inserts the page builder header only if it doesn't already exist */
export function createHeaderIfNeeded(editable, brandTitle, showAttributeTab) {
    const existingHeader = document.getElementById('page-builder-header');
    if (!existingHeader) {
        const appElement = document.getElementById('app');
        if (appElement && appElement.parentNode) {
            const header = document.createElement('header');
            header.id = 'page-builder-header';
            header.appendChild(createNavbar(editable, brandTitle, showAttributeTab));
            appElement.parentNode.insertBefore(header, appElement);
        }
        else {
            console.error('Error: #app not found in the DOM');
        }
    }
}
