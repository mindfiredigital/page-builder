Here’s a `README.md` file that provides a structured overview of the page builder project. This includes instructions for setup, usage, and details on the folder structure and project features.

```markdown
# Page Builder

An open-source, lightweight page builder component designed for creating static web pages with a drag-and-drop interface. This component library generates HTML output and supports customization options. Built with TypeScript and vanilla JavaScript for performance, it includes modular components, responsive previews, and data handling for layout storage and retrieval.

## Features

- **Component Structure**: Drag-and-drop components (text, images, buttons, headers, containers, etc.) to create a layout.
- **Responsive Preview**: Preview page layouts in different device modes (Desktop, Tablet, Mobile).
- **Configuration Sidebar**: Customize component properties like text, color, padding, and margin via a configuration sidebar.
- **Data Storage**: Save layout configurations in JSON format for easy retrieval and editing.
- **Output HTML**: Export the final HTML layout for use in static web pages or other applications.

## Project Structure
```

project-root/
├── src/
│ ├── components/ # Folder for modular, reusable components
│ │ ├── TextComponent.ts # Text component module
│ │ ├── ImageComponent.ts # Image component module
│ │ ├── ButtonComponent.ts # Button component module
│ │ ├── HeaderComponent.ts # Header component module
│ │ ├── ContainerComponent.ts # Container component module for grouping
│ │ └── index.ts # Export all components for easy imports
│ │
│ ├── canvas/ # Main canvas and drag-and-drop handling
│ │ ├── Canvas.ts # Canvas handling, layout functions
│ │ ├── DragDropManager.ts # Logic for drag-and-drop interactions
│ │ └── PreviewPanel.ts # Code for the preview panel across device types
│ │
│ ├── sidebar/ # Configuration sidebar for component properties
│ │ ├── ConfigSidebar.ts # Sidebar handling and component editing
│ │ ├── ConfigOptions/ # Individual option components
│ │ │ ├── TextOptions.ts # Text properties (e.g., font, color)
│ │ │ ├── StyleOptions.ts # Style properties (e.g., padding, margin)
│ │ │ └── AlignmentOptions.ts # Alignment options
│ │ └── index.ts # Export for all sidebar components
│ │
│ ├── services/ # Data handling services
│ │ ├── HTMLGenerator.ts # Generates final HTML output
│ │ ├── JSONStorage.ts # Handles saving/loading JSON data
│ │ └── index.ts # Export services
│ │
│ ├── utils/ # Utility functions
│ │ ├── eventHelpers.ts # Helper functions for event handling
│ │ ├── domUtils.ts # DOM manipulation helpers
│ │ └── responsiveUtils.ts # Utilities for responsive design
│ │
│ ├── styles/ # CSS or SCSS styles
│ │ ├── main.css # Core styling for the app
│ │
│ ├── index.ts # Main entry point for the application
│ └── types.d.ts # Global type definitions for custom types
│
├── dist/ # Compiled files
├── .gitignore # Git ignore file
├── package.json # NPM configuration
├── README.md # Project documentation
└── tsconfig.json # TypeScript configuration file

````

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/lakinmindfire/page-builder.git
   cd page-builder
````

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Compile TypeScript**:

   ```bash
   npm run build
   ```

4. **Run Development Server**:

   ```bash
   npm start
   ```

   This command will start a local server with `lite-server` and open the project in your default browser.

## Usage

- **Add Components**: Drag items from the left sidebar to the main canvas to add components like text, images, buttons, and headers.
- **Customize Components**: Click on any component to open the configuration sidebar on the right. Here you can adjust properties such as text, color, padding, and margins.
- **Preview Modes**: Use the preview panel at the top to view layouts on different devices (Desktop, Tablet, Mobile).
- **Save Layout**: Save your layout configuration in JSON format for future editing.
- **Export HTML**: Export the final HTML code for use in other applications or websites.

## Configuration

- **Responsive Preview Options**: The preview panel allows you to switch between desktop, tablet, and mobile views, adjusting the canvas width accordingly.
- **Configuration Sidebar**: Customize each component by adjusting text, alignment, padding, and more in real-time.

## Folder Descriptions

- **`src/components/`**: Contains modular, reusable components for building page layouts. Each component is implemented in its own file for flexibility.
- **`src/canvas/`**: Manages the main canvas, including drag-and-drop functionality and preview panel logic.
- **`src/sidebar/`**: Configuration sidebar logic for customizing selected components' properties.
- **`src/services/`**: Data management services, including HTML generation and JSON storage/retrieval.
- **`src/utils/`**: Utility functions for event handling, DOM manipulation, and responsive design support.
- **`src/styles/`**: Core CSS styles for the layout and components.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue if you have ideas for improvements or new features.

1. Fork the repository
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push to the branch:
   ```bash
   git commit -m "Add new feature"
   git push origin feature-name
   ```
4. Submit a pull request for review.

Please ensure your contributions adhere to the project's [Code of Conduct](./CODE_OF_CONDUCT.md) and are licensed under the project's [License](./LICENSE).
