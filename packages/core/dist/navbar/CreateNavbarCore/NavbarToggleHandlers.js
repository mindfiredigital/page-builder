/* Notifies other modules (e.g. CustomizationSidebar) that the canvas changed size */
function dispatchLayoutChanged() {
  document.dispatchEvent(new CustomEvent('canvas-layout-changed'));
}
/* Wires the sidebar-menu toggle button — shows/hides the left component sidebar */
export function wireSidebarMenuToggle(button) {
  button.style.backgroundColor = '#e2e8f0';
  button.style.borderColor = '#cbd5e1';
  button.onclick = () => {
    const sidebar = document.getElementById('sidebar');
    const hasClass =
      sidebar === null || sidebar === void 0
        ? void 0
        : sidebar.classList.contains('visible');
    if (sidebar) {
      if (hasClass) {
        /* Hide sidebar and reset button styling */
        sidebar.classList.remove('visible');
        sidebar.style.display = 'none';
        button.style.backgroundColor = '#ffffff';
        button.style.border = 'none';
        button.style.border = '1px solid #ffffff';
      } else {
        /* Show sidebar and highlight button as active */
        sidebar.style.display = 'block';
        sidebar.classList.add('visible');
        button.style.backgroundColor = '#e2e8f0';
        button.style.borderColor = '#cbd5e1';
      }
      dispatchLayoutChanged();
    }
  };
}
/* Wires the customization menu toggle button — shows/hides the right customization panel */
export function wireMenuButtonToggle(button) {
  button.onclick = () => {
    const customizeTab = document.getElementById('customization');
    const hasClass =
      customizeTab === null || customizeTab === void 0
        ? void 0
        : customizeTab.classList.contains('visible');
    if (customizeTab) {
      if (hasClass) {
        /* Hide panel and reset button styling */
        customizeTab.classList.remove('visible');
        customizeTab.style.display = 'none';
        button.style.backgroundColor = '#ffffff';
        button.style.border = 'none';
        button.style.border = '1px solid #ffffff';
      } else {
        /* Show panel and highlight button as active */
        customizeTab.style.display = 'block';
        customizeTab.classList.add('visible');
        button.style.backgroundColor = '#e2e8f0';
        button.style.borderColor = '#cbd5e1';
      }
      dispatchLayoutChanged();
    }
  };
}
