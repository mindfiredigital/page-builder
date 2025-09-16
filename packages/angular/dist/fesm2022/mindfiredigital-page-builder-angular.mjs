import * as i0 from '@angular/core';
import { createComponent, Component, CUSTOM_ELEMENTS_SCHEMA, Input, ViewChild, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

class PageBuilderComponent {
    injector;
    appRef;
    envInjector;
    config;
    customComponents = {};
    pageBuilderEl;
    // Correctly inject dependencies in the constructor
    constructor(injector, appRef, envInjector) {
        this.injector = injector;
        this.appRef = appRef;
        this.envInjector = envInjector;
    }
    ngAfterViewInit() {
        this.processCustomComponents();
    }
    processCustomComponents() {
        const processedConfig = {
            ...this.config,
            Custom: this.config?.Custom || {},
        };
        Object.entries(this.customComponents).forEach(([key, componentConfig]) => {
            const tagName = `ng-component-${key.toLowerCase()}`;
            if (!customElements.get(tagName)) {
                // Capture the injected dependencies from the parent component's scope.
                const injector = this.injector;
                const appRef = this.appRef;
                const envInjector = this.envInjector;
                // The class accesses the captured dependencies via closure
                class AngularHostElement extends HTMLElement {
                    componentRef = null;
                    connectedCallback() {
                        // Create the component in-place using the captured dependencies
                        this.componentRef = createComponent(componentConfig.component, {
                            environmentInjector: envInjector,
                            elementInjector: injector,
                            hostElement: this,
                        });
                        // Attach change detection
                        appRef.attachView(this.componentRef.hostView);
                        // Append the component's root node into this custom element
                        this.appendChild(this.componentRef.location.nativeElement);
                    }
                    disconnectedCallback() {
                        if (this.componentRef) {
                            appRef.detachView(this.componentRef.hostView);
                            this.componentRef.destroy();
                            this.componentRef = null;
                        }
                    }
                }
                customElements.define(tagName, AngularHostElement);
            }
            processedConfig.Custom[key] = {
                component: tagName,
                svg: componentConfig.svg,
                title: componentConfig.title,
            };
        });
        this.pageBuilderEl.nativeElement.setAttribute('config-data', JSON.stringify(processedConfig));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.0", ngImport: i0, type: PageBuilderComponent, deps: [{ token: i0.Injector }, { token: i0.ApplicationRef }, { token: i0.EnvironmentInjector }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.0", type: PageBuilderComponent, isStandalone: true, selector: "mf-page-builder", inputs: { config: "config", customComponents: "customComponents" }, viewQueries: [{ propertyName: "pageBuilderEl", first: true, predicate: ["pageBuilderEl"], descendants: true }], ngImport: i0, template: `<page-builder #pageBuilderEl></page-builder>`, isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.0", ngImport: i0, type: PageBuilderComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'mf-page-builder',
                    standalone: true,
                    imports: [CommonModule],
                    template: `<page-builder #pageBuilderEl></page-builder>`,
                    schemas: [CUSTOM_ELEMENTS_SCHEMA],
                }]
        }], ctorParameters: () => [{ type: i0.Injector }, { type: i0.ApplicationRef }, { type: i0.EnvironmentInjector }], propDecorators: { config: [{
                type: Input
            }], customComponents: [{
                type: Input
            }], pageBuilderEl: [{
                type: ViewChild,
                args: ['pageBuilderEl']
            }] } });

class PageBuilderModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.0", ngImport: i0, type: PageBuilderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "19.1.0", ngImport: i0, type: PageBuilderModule, imports: [PageBuilderComponent], exports: [PageBuilderComponent] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "19.1.0", ngImport: i0, type: PageBuilderModule, imports: [PageBuilderComponent] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.0", ngImport: i0, type: PageBuilderModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [PageBuilderComponent],
                    exports: [PageBuilderComponent],
                }]
        }] });

const PAGE_BUILDER_STYLES = './lib/styles/_styles.scss';

/**
 * Generated bundle index. Do not edit.
 */

export { PAGE_BUILDER_STYLES, PageBuilderComponent, PageBuilderModule };
//# sourceMappingURL=mindfiredigital-page-builder-angular.mjs.map
