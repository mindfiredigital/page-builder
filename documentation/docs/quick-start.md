# Quick Start Guide

This guide details the fastest path to install and initialize the **Page Builder** across the **Web Component**, **React**, and **Angular** environments.

---

## 1. Core Package / CDN Setup

The **Core Package** is the foundational engine and provides the base **Web Component** implementation.
By loading it via CDN, you can run the builder directly in any standard HTML environment without a build system.

### Installation

The entire builder (styles and logic) is loaded via two CDN links.

### Usage (`index.html`)

You must include the styles in the `<head>` and the JavaScript bundle at the bottom of the `<body>`.
The UI requires specific container IDs (`#sidebar`, `#canvas`, etc.) to be present in the HTML structure.

```html
<!doctype html>
<html lang="en">
  <head>
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
      <div id="customization">...</div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/@mindfiredigital/page-builder/dist/index.js"></script>

    <script>
      // After this script loads, the global API (window.PageBuilder) is available for initialization.
    </script>
  </body>
</html>
```

---

## 2. React Wrapper

The **React Wrapper** provides a declarative component interface for easy integration into modern React applications.

### Installation

```bash
npm install @mindfiredigital/page-builder-react
```

### Usage (`src/App.jsx`)

Use React state to hold the design object and pass component definitions via `config` and `customComponents`.

```javascript
import React, { useState } from 'react';
import { PageBuilderReact } from '@mindfiredigital/page-builder-react';
import '@mindfiredigital/page-builder-core/dist/styles/main.css';
// Import your custom component files
import ColorPicker from './components/ColorPicker';
// ... other imports ...

const QuickStartApp = () => {
  const [design, setDesign] = useState(null);

  const dynamicComponents = {
    /* built-in component definitions */
  };
  const customComponents = {
    /* custom component definitions */
  };

  return (
    <div style={{ height: '100vh' }}>
      <PageBuilderReact
        initialDesign={design}
        config={dynamicComponents}
        customComponents={customComponents}
        // Prop to capture the design state changes
        onChange={async newDesign => {
          setDesign(newDesign);
        }}
      />
    </div>
  );
};

export default QuickStartApp;
```

---

## 4. Angular Wrapper

For **Angular applications**, use the dedicated Angular module to integrate the builder into your component architecture.

### Installation

```bash
npm install @mindfiredigital/page-builder-angular
```

### Usage (`app.module.ts` and `app.component.ts`)

#### Import the Module

```typescript
// app.module.ts
import { PageBuilderModule } from '@mindfiredigital/page-builder-angular';

@NgModule({
  imports: [PageBuilderModule],
  // ...
})
export class AppModule {}
```

#### Use in Component

```html
<!-- app.component.html -->
<page-builder-angular
  [initialDesign]="design"
  [config]="config"
  (onChange)="onDesignUpdate($event)"
></page-builder-angular>
```

---

## Next Steps

For detailed, feature-specific usage (**Custom Components**, **Formulas**, **View Mode**, etc.), refer to the respective wrapper’s **Features documentation**.
