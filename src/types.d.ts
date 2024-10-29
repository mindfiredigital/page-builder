// Declare a global namespace for commonly used types across the project
declare global {
  // Define a type for component configuration options
  interface ComponentConfig {
    type: string; // The type of the component (e.g., "Text", "Image", "Button")
    id: string; // Unique identifier for each component instance
    content?: string; // Optional content for text-based components
    styles?: ComponentStyles; // Optional styles for customizing appearance
  }

  // Define a type for styles to apply on components
  interface ComponentStyles {
    color?: string; // Text or background color
    fontSize?: string; // Font size for text components
    padding?: string; // Padding around the component
    margin?: string; // Margin around the component
    [key: string]: any; // Allow additional CSS properties dynamically
  }

  // Define an interface for components stored on the canvas
  interface CanvasComponent {
    element: HTMLElement; // The HTML element of the component
    config: ComponentConfig; // Configuration options for the component
  }

  // Define types for drag and drop events
  interface DragEventHandlers {
    onDragStart: (event: DragEvent, componentId: string) => void;
    onDrop: (event: DragEvent) => void;
    onDragOver: (event: DragEvent) => void;
  }

  // Define type for JSON data format for saving/loading
  interface LayoutData {
    components: ComponentConfig[]; // Array of component configurations on the canvas
  }

  // Define a union type for different device preview modes
  type DevicePreviewMode = 'desktop' | 'tablet' | 'mobile';
}

export {}; // This ensures the file is treated as a module
