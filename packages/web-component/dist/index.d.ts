import { PageBuilderDesign } from '@mindfiredigital/page-builder';
export { BasicComponent, ComponentAttribute, PageBuilderDesign } from '@mindfiredigital/page-builder';

declare class PageBuilderComponent extends HTMLElement {
    private pageBuilder;
    private initialized;
    private _initialDesign;
    private _editable;
    private _brandTitle?;
    private _showAttributeTab?;
    private _layoutMode?;
    private config;
    private template;
    constructor();
    set editable(value: boolean | null);
    get editable(): boolean | null;
    set brandTitle(value: string | undefined);
    get brandTitle(): string | undefined;
    set showAttributeTab(value: boolean | undefined);
    get showAttributeTab(): boolean | undefined;
    set layoutMode(value: 'absolute' | 'grid' | undefined);
    get layoutMode(): 'absolute' | 'grid' | undefined;
    set initialDesign(value: PageBuilderDesign | null);
    get initialDesign(): PageBuilderDesign | null;
    connectedCallback(): void;
    private hasValidConfig;
    set configData(value: any);
    get configData(): any;
    applyDesign(design: PageBuilderDesign): void;
    generateOutput(): {
        html: string;
        css: string;
    };
    private initializePageBuilder;
}

export { PageBuilderComponent };
