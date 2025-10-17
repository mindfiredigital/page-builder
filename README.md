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

## Documentation

For detailed documentation, visit: [https://mindfiredigital.github.io/page-builder/](https://mindfiredigital.github.io/page-builder/)

## Screenshot

 <p align="center">
   <img alt="Screenshot of the Page builder" src="https://res.cloudinary.com/dodvwsaqj/image/upload/v1737367074/landing_sdtu4q.png"\>
</p>

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started with npm](#getting-started-with-npm)
- [Usage via CDN](#usage-via-cdn)
  - [CDN Usage Example](#cdn-usage-example)
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

To install the `@mindfiredigital/page-builder` npm package in your project, use the following command:

```bash
npm install @mindfiredigital/page-builder
```

<br>

## Getting Started with npm

- **Initialization**: Initialize the PageBuilder in your project.

```javascript
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Builder</title>
    <link rel="stylesheet" href="node_modules/@mindfiredigital/page-builder/dist/styles/main.css" />
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
    <script src="node_modules/@mindfiredigital/page-builder/dist/index.js"></script>
  </body>
</html>
```

<br>

## Usage via CDN

You can include @mindfiredigital/page-builder in your HTML file using the provided CDN link. This allows you to quickly test or use the library without installing it via npm.

```javascript

 <!-- CDN stylesheet -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mindfiredigital/page-builder/dist/styles/main.css" />

 <!--CDN Bundle JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/@mindfiredigital/page-builder/dist/index.js"></script>
```

## CDN Usage Example

- **Initialization**: Initialize the PageBuilder in your project.

```javascript
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Builder</title>
    <!-- CDN stylesheet -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@mindfiredigital/page-builder/dist/styles/main.css"
    />
  </head>
  <body>
    <header>
      <nav id="preview-navbar"></nav>
    </header>
    <div id="app">
      <div id="sidebar"></div>
      <div id="canvas" class="canvas"></div>
      <div id="customization">
        <h4 id="component-name">Component: None</h4>
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

    <!--CDN Bundle JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/@mindfiredigital/page-builder/dist/index.js"></script>
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
