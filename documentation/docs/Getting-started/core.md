---
sidebar_position: 2
---

# Core

Quick start guide for integrating page-builder core package directly in your project.

## Installation

To install the `@mindfiredigital/page-builder` npm package in your project, use the following command:

```bash
npm install @mindfiredigital/page-builder
```

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
