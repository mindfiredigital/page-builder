/** Reads the selected field from the form and resolves the modal's promise */
export function handleSave(contentContainer, attributes, resolve, hideFn) {
  const selectedField = contentContainer.querySelector('.form-field.selected');
  const newValues = {};
  if (selectedField) {
    const selectedKey = selectedField.getAttribute('data-attr-key');
    /** Match the clicked field back to its full attribute object */
    const selectedAttribute = attributes.find(attr => attr.key === selectedKey);
    if (selectedAttribute && selectedAttribute.value !== undefined) {
      newValues[selectedAttribute.key] = selectedAttribute.value;
    }
  }
  hideFn();
  resolve(newValues);
}
