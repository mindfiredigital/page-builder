<h1 align="center">PageBuilder</h1><br><br>
<p align="center">
<a href="https://www.npmjs.com/package/@mindfiredigital/pagebuilder"><img src="https://img.shields.io/npm/v/@mindfiredigital/pagebuilder.svg?sanitize=true" alt="Version"></a>
<a href="https://www.npmjs.com/package/@mindfiredigital/pagebuilder"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs"></a>
</p>

<br>

<p align="center"> lightweight page builder library designed for creating static web pages with a drag-and-drop interface. This component library generates HTML output and supports customization options. Built with TypeScript and vanilla JavaScript for performance, it includes modular components, responsive previews, and data handling for layout storage and retrieval. </p>

<br>

<!-- <p align="center">
  <!-- <img alt="Screenshot of the React Text Igniter" src="https://res.cloudinary.com/dxf1kplcx/image/upload/v1725448061/react-text-igniter-screenshot_c4dq9c.png"\>
</p> -->

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
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

To install the `@mindfiredigital/pagebuilder` npm package in your project, use the following command:

```bash
npm install @mindfiredigital/pagebuilder
```

<br>

## Getting Started

- **Initialization**: Initialize the PageBuilder in your project.

```javascript
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Builder</title>
    <link rel="stylesheet" href="dist/styles/main.css" />
  </head>
  <body>
    <header>
      <nav id="preview-navbar">
      </nav>
    </header>
    <div id="app">
        <div id="sidebar"></div>
      <div id="canvas" class="canvas"></div>
      <div id="customization">
        <h4 id="component-name">Component: None </h4>
        <div id="controls"></div>
        <div id="layers-view" class="hidden"></div>
      </div>
      <!-- Notification for saving -->
      <div id="notification" class="notification hidden"></div>
      <!-- Dialog for reset  -->
      <div id="dialog" class="dialog hidden">
        <div class="dialog-content">
          <p id="dialog-message"></p>
          <button id="dialog-yes" class="dialog-btn">Yes</button>
          <button id="dialog-no" class="dialog-btn">No</button>
        </div>
      </div>
    </div>

    <!-- Bundle JavaScript -->
    <script src="node_modules/@mindfiredigital/pagebuilder/dist/index.js"></script>
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
