/* Builds and returns the root modal DOM element with its static HTML shell */
export function createModalElement() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay modal-hidden';
    modal.id = 'modal';
    modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-header-content">
          <h2 class="modal-title">Component Settings</h2>
          <button id="close-modal-button" class="modal-close-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-search-container">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm7.4 12.6l4.2 4.2a1 1 0 01-1.4 1.4l-4.2-4.2a10 10 0 111.4-1.4z"/>
          </svg>
          <input type="text" id="attribute-search" class="modal-search-input" placeholder="Search attributes...">
        </div>
      </div>
      <div class="modal-body">
        <div id="modal-content" class="modal-form">
          <!-- Dynamic form elements will be injected here -->
        </div>
        <div class="modal-footer">
          <button id="save-button" class="save-button">Save</button>
        </div>
      </div>
    </div>
  `;
    return modal;
}
