import { ModalComponent } from '../components/ModalManager';

/**
 * Reusable function to handle clicks on various components.
 */
export async function handleComponentClick(
  modalComponent: ModalComponent,
  attributeConfig: ComponentAttribute[],
  componentElement: HTMLElement,
  updateContentMethod: (
    element: HTMLElement,
    attribute: ComponentAttribute
  ) => void
): Promise<void> {
  if (!modalComponent || !attributeConfig || attributeConfig.length === 0) {
    console.warn('Modal component or attribute config not available');
    return;
  }

  try {
    const result = await modalComponent.show(attributeConfig);

    if (result) {
      const selectedAttribute = findSelectedAttribute(result, attributeConfig);
      if (selectedAttribute) {
        updateContentMethod(componentElement, selectedAttribute);
      }
    }
  } catch (error) {
    console.error('Error handling component click:', error);
  }
}

/**
 * Finds the selected attribute from the modal's result.
 */
function findSelectedAttribute(
  result: Record<string, any>,
  config: ComponentAttribute[]
): ComponentAttribute | null {
  for (const attr of config) {
    if (
      result.hasOwnProperty(attr.key) &&
      result[attr.key] !== undefined &&
      result[attr.key] !== ''
    ) {
      return attr;
    }
  }
  return null;
}
