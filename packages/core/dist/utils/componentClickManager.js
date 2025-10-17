var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
/**
 * Reusable function to handle clicks on various components.
 */
export function handleComponentClick(
  modalComponent,
  attributeConfig,
  componentElement,
  updateContentMethod
) {
  return __awaiter(this, void 0, void 0, function* () {
    if (!modalComponent || !attributeConfig || attributeConfig.length === 0) {
      console.warn('Modal component or attribute config not available');
      return;
    }
    try {
      const result = yield modalComponent.show(attributeConfig);
      if (result) {
        const selectedAttribute = findSelectedAttribute(
          result,
          attributeConfig
        );
        if (selectedAttribute) {
          updateContentMethod(componentElement, selectedAttribute);
        }
      }
    } catch (error) {
      console.error('Error handling component click:', error);
    }
  });
}
/**
 * Finds the selected attribute from the modal's result.
 */
function findSelectedAttribute(result, config) {
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
