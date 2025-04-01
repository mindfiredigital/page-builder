---
sidebar_position: 3
---

# React

Quick start guide for integrating page-builder react wrapper package directly in your react project.

## Installation

To install the `@mindfiredigital/page-builder-react` npm package in your project, use the following command:

```bash
npm install @mindfiredigital/page-builder-react
```

## Dynamic components

- The config prop is required and allows you to specify which built-in components should be available in the page builder
- For now we have 10 Basic components and 1 Extra component, we have provided the whole list below:
  button, header, text, image, video, container, twoCol, threeCol, table, link, landingpage.

```javascript
import { PageBuilderReact } from '@mindfiredigital/page-builder-react';

const App = () => {
  // Config object for dynamic components
  const dynamicComponents = {
    // Basic components that will appear in the main toolbar
    Basic: ['button', 'header', 'text', 'twoCol', 'threeCol'],
    // Extra components that will appear in a secondary section
    Extra: ['landingpage'],
  };

  return (
    <div>
      <PageBuilderReact config={dynamicComponents} />
    </div>
  );
};

export default App;
```

## Custom Components (Optional)

- You can optionally add your own React components to the page builder using the customComponents prop:
- Each custom component requires:

component: Your React component
svg: An SVG icon for the builder toolbar
title: A display name for the component

```javascript
import { PageBuilderReact } from '@mindfiredigital/page-builder-react';
// Your custom defined component
import ColorPicker from './components/ColorPicker';

const App = () => {
  // Config object for dynamic components (required)
  const dynamicComponents = {
    Basic: ['button', 'header', 'text', 'twoCol', 'threeCol'],
    Extra: ['landingpage'],
  };

  // Custom components configuration (optional)
  const customComponents = {
    ColorPicker: {
      component: ColorPicker,
      svg: `<svg path of your svg </svg>`,
      title: 'Color Picker Component',
    },
  };

  return (
    <div>
      <PageBuilderReact
        config={dynamicComponents}
        customComponents={customComponents}
      />
    </div>
  );
};

export default App;
```
