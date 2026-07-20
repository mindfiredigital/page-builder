declare global {
  interface ComponentConfig {
    type: string;
    id: string;
    content?: string;
    styles?: ComponentStyles;
  }

  interface ComponentStyles {
    color?: string;
    fontSize?: string;
    padding?: string;
    margin?: string;
    [key: string]: string | undefined;
  }

  interface CanvasComponent {
    element: HTMLElement;
    config: ComponentConfig;
  }

  interface DragEventHandlers {
    onDragStart: (event: DragEvent, componentId: string) => void;
    onDrop: (event: DragEvent) => void;
    onDragOver: (event: DragEvent) => void;
  }

  interface PageComponent {
    id: string;
    type: string;
    content: string;
    position: { x: number; y: number };
    dimensions: { width: number; height: number };
    style: { [key: string]: string };
    inlineStyle: string;
    classes: string[];
    dataAttributes: { [key: string]: string };
    imageSrc?: string | null;
    videoSrc?: string | null;
    props?: ComponentProps;
  }

  interface LayoutData {
    components: ComponentConfig[];
  }

  type PageBuilderDesign = PageComponent[];

  export interface ComponentAttribute {
    id: string;
    type: 'Constant' | 'Formula' | 'Input' | 'Image';
    input_type?: 'text' | 'number' | 'checkbox';
    title: string;
    key: string;
    value: string | number | boolean;
    execute_order: number;
    editable?: boolean;
    default_value?: string | number | boolean | null;
  }

  export interface BasicComponent {
    name: string;
    attributes?: ComponentAttribute[];
    globalExecuteFunction?: (...args: unknown[]) => unknown;
  }

  interface DynamicComponents {
    Basic: BasicComponent[];
    Extra: string[];
    Custom: CustomComponentConfig;
  }

  interface CustomComponentSetting {
    name: string;
    functionName: string;
  }

  interface CustomComponentConfig {
    [key: string]: CustomComponentEntry;
  }

  interface CustomComponentEntry {
    component: string;
    svg?: string;
    title?: string;
    settingsComponent?: import('react').ComponentType<{
      targetComponentId: string;
    }>;
    settingsComponentTagName?: string;
    customizeComponentTagName?: string;
    props?: ComponentProps;
    settings?: ComponentProps;
  }

  /** Generic bag of serialisable component props */
  interface ComponentProps {
    [key: string]:
      | string
      | number
      | boolean
      | null
      | undefined
      | ComponentProps
      | ComponentPropsArray;
  }

  /** Needed because ComponentProps values can be arrays */
  type ComponentPropsArray = Array<
    string | number | boolean | null | undefined | ComponentProps
  >;

  type DevicePreviewMode = 'desktop' | 'tablet' | 'mobile';

  /**
   * Shared attribute value map used by seedFormulaValues / updateInputValues
   * across HeaderComponent, TextComponent, TableComponent, and TableValueUpdater.
   * Matches the value union on ComponentAttribute.
   */
  type AttributeValues = Record<string, string | number | boolean>;

  /** CustomizationSidebar is registered on window by the host application */
  interface CustomizationSidebarAPI {
    showSidebar: (componentId: string) => void;
  }

  interface Window {
    CustomizationSidebar?: CustomizationSidebarAPI;
    customComponents?: Record<string, CustomComponentEntry>;
  }

  /* Shared type declarations used across Canvas modules */

  type LayoutMode = 'grid' | 'absolute';

  interface CanvasState {
    components: HTMLElement[];
    canvasElement: HTMLElement;
    sidebarElement: HTMLElement;
    editable: boolean | null;
    layoutMode: LayoutMode;
    lastCanvasWidth: number | null;
  }

  /** Uploads a base64 image and resolves the hosted URL to use as `src`. */
  type ImageAttributeConfigHandler = (
    base64String: string
  ) => Promise<{ url: string }> | { url: string };

  /* Attribute config types for component factories */
  interface ComponentFactoryConfig {
    tableAttributeConfig?: ComponentAttribute[];
    textAttributeConfig?: ComponentAttribute[];
    headerAttributeConfig?: ComponentAttribute[];
    ImageAttributeConfig?: ImageAttributeConfigHandler;
  }

  /* Describes a single resizer handle — its CSS class and cursor style */
  interface ResizerPosition {
    class: string;
    cursor: string;
  }

  /* Shape of a single attribute entry passed into the modal form */
  interface ComponentAttribute {
    id: string;
    key: string;
    title: string;
    type: string;
    value?: string | number | boolean;
  }

  /** Values returned from the modal after the user selects a field */
  type ModalResult = Record<string, string | number | boolean>;

  /** Shape of a single serialised visibility rule stored on a table row */
  interface VisibilityRule {
    inputKey: string;
    operator: string;
    value: string;
    action: string;
  }

  interface NavButton {
    id: string;
    icon: string;
    title: string;
    isPreview?: boolean;
  }

  interface SVGRecord {
    el: SVGSVGElement;
    prevWidth: string | null;
    prevHeight: string | null;
    prevViewBox: string | null;
    prevStyle: string;
    addedViewBox: boolean;
  }

  /** Union of all valid values that can be passed as a category's component list */
  type CategoryComponents = BasicComponent[] | string[] | CustomComponentConfig;

  /* Shared state injected from CustomizationSidebar.init() */
  interface TabManagerState {
    sidebarElement: HTMLElement;
    componentNameHeader: HTMLElement;
    controlsContainer: HTMLElement;
    functionsPanel: HTMLDivElement;
    layersView: HTMLDivElement;
    editable: boolean | null;
    showAttributeTab?: boolean;
    onCustomizeTab: () => void;
    onAttributeTab: () => void;
  }

  // ── Rich Text Editor ────────────────────────────────────────

  interface BlockTypeDef {
    type: string;
    label: string;
    icon: string;
  }

  interface TuneItem {
    label: string;
    icon: string;
    action?: () => void;
    danger?: boolean;
    active?: boolean;
    submenu?: TuneItem[];
  }

  interface TuneItemCallbacks {
    hidePopover: () => void;
    showSubmenu: (items: TuneItem[], anchor: HTMLElement) => void;
    scheduleHideSubmenu: () => void;
    cancelHideSubmenu: () => void;
  }

  interface TuneActions {
    applyAlignment: (block: HTMLElement, align: string) => void;
    convertBlock: (block: HTMLElement, toType: string) => void;
    changeHeadingLevel: (block: HTMLElement, level: number) => void;
    toggleListStyle: (
      block: HTMLElement,
      style: 'unordered' | 'ordered'
    ) => void;
    toggleCodeTheme: (block: HTMLElement, theme: 'light' | 'dark') => void;
    toggleImageOption: (
      block: HTMLElement,
      option: 'border' | 'stretch' | 'background'
    ) => void;
    moveBlockUp: (block: HTMLElement) => void;
    deleteBlock: (block: HTMLElement) => void;
    moveBlockDown: (block: HTMLElement) => void;
  }
}

export {};
