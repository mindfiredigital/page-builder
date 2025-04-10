<h1 align="center">PageBuilder</h1><br><br>
<p align="center">
<a href="https://www.npmjs.com/package/@mindfiredigital/page-builder"><img src="https://img.shields.io/npm/v/@mindfiredigital/page-builder.svg?sanitize=true" alt="Version"></a>
<a href="https://www.npmjs.com/package/@mindfiredigital/page-builder"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs"></a>
</p>

<br>

<p align="center"> lightweight page builder library designed for creating static web pages with a drag-and-drop interface. This component library generates HTML output and supports customization options. Built with TypeScript and vanilla JavaScript for performance, it includes modular components, responsive previews, and data handling for layout storage and retrieval. </p>

<br>

## Live Demo

Click the button below to open the project on StackBlitz.

<a href="https://stackblitz.com/edit/stackblitz-starters-3d4yfpj4?file=index.html" target="_blank">
  <img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt="Open in StackBlitz">
</a>

## Screenshot

 <p align="center">
   <img alt="Screenshot of the Page builder" src="https://res.cloudinary.com/dodvwsaqj/image/upload/v1737367074/landing_sdtu4q.png"\>
</p>

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started with npm](#getting-started-with-npm)
- [Contributing](#contributing)
- [License](#license)

<br>

## Features

- **Component Structure**: Drag-and-drop components (text, images, buttons, headers, containers, etc.) to create a layout.
- **Responsive Preview**: Preview page layouts in different device modes (Desktop, Tablet, Mobile).
- **Configuration Sidebar**: Customize component properties like text, color, padding, and margin via a configuration sidebar.
- **Data Storage**: Save layout configurations in JSON format for easy retrieval and editing.
- **Layers**: Enabling users to manage component hierarchy visually.
- **Output HTML**: Export the final HTML layout for use in static web pages or other applications.

<br>

## Installation

To install the `@mindfiredigital/page-builder-react` npm package in your project, use the following command:

```bash
npm install @mindfiredigital/page-builder-react
```

<br>

## Getting Started with npm

- **Initialization**: Initialize the PageBuilder in your project.

### Dynamic components

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

### Custom Components (Optional)

- You can optionally add your own React components to the page builder using the customComponents prop:
- Each custom component requires:<br>
  `component`: Your React component<br>
  `svg`: An SVG icon for the builder toolbar<br>
  `title`: A display name for the component

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

<br>

## Contributing

We welcome contributions from the community. If you'd like to contribute to the `Pagebuilder` npm package, please follow our [Contributing Guidelines](CONTRIBUTING.md).
<br>

## License

Copyright (c) Mindfire Digital llp. All rights reserved.

Licensed under the MIT license.
