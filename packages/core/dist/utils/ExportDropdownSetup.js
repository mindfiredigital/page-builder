/* Wires the export button to show a dropdown with HTML and PDF options */
export function setupExportDropdown() {
  const exportBtn = document.getElementById('export-btn');
  if (!exportBtn) return;
  const dropdown = document.createElement('div');
  dropdown.classList.add('export-dropdown');
  const option1 = document.createElement('div');
  option1.textContent = 'HTML';
  option1.classList.add('export-option');
  option1.id = 'export-html-btn';
  const option2 = document.createElement('div');
  option2.textContent = 'PDF';
  option2.classList.add('export-option');
  option2.id = 'export-pdf-btn';
  dropdown.appendChild(option1);
  dropdown.appendChild(option2);
  exportBtn.appendChild(dropdown);
  /* Toggle dropdown on export button click */
  exportBtn.addEventListener('click', event => {
    event.stopPropagation();
    dropdown.classList.toggle('visible');
  });
  /* Hide dropdown when clicking anywhere outside the export button */
  document.addEventListener('click', event => {
    if (!exportBtn.contains(event.target)) {
      dropdown.classList.remove('visible');
    }
  });
}
