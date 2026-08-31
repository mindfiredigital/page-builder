import { createExportToZipButton } from './ExportZipService.js';
/* Closes the modal with a fade-out animation then removes it from the DOM */
export function closeModal(modal) {
    modal.classList.remove('show');
    modal.classList.add('hide');
    setTimeout(() => modal.remove(), 300);
}
/* Builds the × close button wired to closeModal */
export function createCloseButton(modal) {
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.classList.add('close-btn');
    closeButton.addEventListener('click', () => closeModal(modal));
    return closeButton;
}
/* Builds a titled code section with an editable highlighted content block */
export function createCodeSection(title, highlightedContent) {
    const section = document.createElement('div');
    section.classList.add('modal-section');
    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    const codeBlock = document.createElement('div');
    codeBlock.classList.add('code-block');
    codeBlock.setAttribute('contenteditable', 'true');
    codeBlock.innerHTML = highlightedContent;
    section.appendChild(titleElement);
    section.appendChild(codeBlock);
    return section;
}
/* Wires click-outside and Escape key to close the modal */
export function setupModalEventListeners(modal) {
    modal.addEventListener('click', event => {
        if (event.target === modal)
            closeModal(modal);
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape')
            closeModal(modal);
    });
}
/* Assembles the full export modal with HTML/CSS code sections and a ZIP download button */
export function createExportModal(highlightedHTML, highlightedCSS, html, css) {
    const modal = document.createElement('div');
    modal.id = 'export-dialog';
    modal.classList.add('modal');
    const modalContent = document.createElement('div');
    modalContent.classList.add('export-modal-content');
    modalContent.appendChild(createCloseButton(modal));
    modalContent.appendChild(createCodeSection('HTML', highlightedHTML));
    modalContent.appendChild(createCodeSection('CSS', highlightedCSS));
    modalContent.appendChild(createExportToZipButton(html, css));
    const exportButtonWrapper = document.createElement('div');
    exportButtonWrapper.classList.add('button-wrapper');
    exportButtonWrapper.appendChild(modalContent);
    modal.appendChild(exportButtonWrapper);
    setupModalEventListeners(modal);
    return modal;
}
