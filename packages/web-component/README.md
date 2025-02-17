<h1 align="center">PageBuilder</h1><br><br>
<p align="center">
<a href="https://www.npmjs.com/package/@mindfiredigital/page-builder-core"><img src="https://img.shields.io/npm/v/@mindfiredigital/page-builder-core.svg?sanitize=true" alt="Version"></a>
<a href="https://www.npmjs.com/package/@mindfiredigital/page-builder-core"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs"></a>
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

To install the `@mindfiredigital/page-builder-web-component` npm package in your project, use the following command:

```bash
npm install @mindfiredigital/page-builder-web-component
```

<br>

## Getting Started with npm

- **Initialization**: Initialize the PageBuilder in your project.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Builder Demo</title>
  </head>
  <body>
    <page-builder></page-builder>
    <script type="module" defer>
      import '@mindfiredigital/page-builder-web-component';
    </script>
  </body>
</html>
```

<br>

## Contributing

We welcome contributions from the community. If you'd like to contribute to the `Pagebuilder` npm package, please follow our [Contributing Guidelines](CONTRIBUTING.md).
<br>

## License

Copyright (c) Mindfire Digital llp. All rights reserved.

Licensed under the MIT license.
