declare class PageBuilder {
    private canvas;
    private sidebar;
    private htmlGenerator;
    private jsonStorage;
    private previewPanel;
    private dynamicComponents;
    private initialDesign;
    private editable;
    private brandTitle;
    private showAttributeTab;
    layoutMode: 'absolute' | 'grid';
    private static headerInitialized;
    private static initialCanvasWidth;
    constructor(dynamicComponents?: DynamicComponents, initialDesign?: PageBuilderDesign | null, editable?: boolean | null, brandTitle?: string, showAttributeTab?: boolean, layoutMode?: 'absolute' | 'grid' | undefined);
    static resetHeaderFlag(): void;
    initializeEventListeners(): void;
    setupInitialComponents(): void;
    applyDesign(design: PageBuilderDesign): void;
    generateOutput(): {
        html: string;
        css: string;
    };
    setupExportHTMLButton(): void;
}

/**
 * Real, importable exports of the design/component shapes that
 * @mindfiredigital/page-builder-web-component and
 * @mindfiredigital/page-builder-react need to consume.
 *
 * `types.d.ts` declares the canonical versions of these same shapes as
 * ambient globals (for bare-name use across this package's own source,
 * without imports). Ambient `declare global` types cannot be re-exported
 * through this package's `rollup-plugin-dts`-bundled `.d.ts` output — the
 * bundler needs a real module-scoped binding to resolve — so this file
 * mirrors the ones downstream packages actually need as genuine exports.
 *
 * If you change PageComponent/ComponentAttribute/BasicComponent's shape in
 * `types.d.ts`, mirror the change here too.
 */
interface PageComponent {
    id: string;
    type: string;
    content: string;
    position: {
        x: number;
        y: number;
    };
    dimensions: {
        width: number;
        height: number;
    };
    style: {
        [key: string]: string;
    };
    inlineStyle: string;
    classes: string[];
    dataAttributes: {
        [key: string]: string;
    };
    imageSrc?: string | null;
    videoSrc?: string | null;
    props?: ComponentProps;
}
type PageBuilderDesign$1 = PageComponent[];
interface ComponentAttribute {
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
interface BasicComponent {
    name: string;
    attributes?: ComponentAttribute[];
    globalExecuteFunction?: (...args: unknown[]) => unknown;
}
/** Generic bag of serialisable component props */
interface ComponentProps {
    [key: string]: string | number | boolean | null | undefined | ComponentProps | ComponentPropsArray;
}
/** Needed because ComponentProps values can be arrays */
type ComponentPropsArray = Array<string | number | boolean | null | undefined | ComponentProps>;

declare const PageBuilderCore: PageBuilder;

export { PageBuilder, PageBuilderCore };
export type { BasicComponent, ComponentAttribute, ComponentProps, PageBuilderDesign$1 as PageBuilderDesign, PageComponent };
