# Custom Component

Our **Page Builder** is designed to be fully extensible, allowing you to integrate any of your existing or new React components directly into the editor. Once registered, custom components function identically to built-in components—they appear in the sidebar and are fully drag-and-drop enabled.

---

## How to Register a Custom Component

You pass your custom components to the `PageBuilderReact` component using the `customComponents` prop, which expects an object where each key is the component's unique ID/name.

Each component definition requires three key properties to enable sidebar display and drag-and-drop functionality:

- **component**: The actual imported React component.
- **title**: The human-readable name displayed in the sidebar.
- **svg**: The SVG code used as the visual icon in the sidebar's _Custom_ section.

➡️ If your component requires special configuration options, you can optionally include a `settingsComponent` to handle its property adjustments in the Settings Panel.

---

## Implementation Example

The example below shows how to register a **ColorPicker** and a **CustomRating** component:

```javascript
import { PageBuilderReact } from '@mindfiredigital/page-builder-react';
import ColorPicker from './components/ColorPicker';
import CustomRating from './components/CustomRating';
import CustomRatingSettings from './settings/CustomRatingSetting'; // Component for property adjustments
import Image from './components/Image';

const App = () => {
  const customComponents = {
    ColorPicker: {
      component: ColorPicker,
      // Provide the SVG code that will be displayed in the sidebar
      svg: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">...</svg>`,
      title: 'Color Picker Component',
    },
    CustomRating: {
      component: CustomRating,
      svg: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">...</svg>`,
      title: 'Custom Rating Component',
      settingsComponent: CustomRatingSettings, // Renders in the Settings Panel when selected
    },
    // ... other custom components
  };

  return (
    <div>
      <PageBuilderReact
        // Pass your custom components to the builder
        customComponents={customComponents}
        // ... other props like config
      />
    </div>
  );
};

export default App;
```
