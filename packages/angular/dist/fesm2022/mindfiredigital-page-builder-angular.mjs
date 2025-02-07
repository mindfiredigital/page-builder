import * as i0 from '@angular/core';
import { Component, Input, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import { PageBuilder } from '@mindfiredigital/page-builder-core/dist/PageBuilder.js';

class PageBuilderComponent {
    elementRef;
    onInitialize;
    customStyles = {};
    pageBuilder = null;
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
    ngOnInit() {
        // Initial setup if needed
    }
    ngAfterViewInit() {
        this.setupPageBuilder();
    }
    ngOnDestroy() {
        this.pageBuilder = null;
    }
    getWrapperStyles() {
        return {
            margin: 'auto',
            width: '100%',
            height: '100%',
            ...this.customStyles.wrapper,
        };
    }
    setupDOMStructure() {
        const wrapper = this.elementRef.nativeElement.querySelector('div');
        if (!wrapper)
            return;
        // Clear existing content
        wrapper.innerHTML = '';
        // Create the main app container
        const appDiv = document.createElement('div');
        appDiv.id = 'app';
        // Create required inner elements
        appDiv.innerHTML = `
      <div id="sidebar"></div>
      <div id="canvas" class="canvas"></div>
      <div id="customization">
        <h4 id="component-name">Component: None</h4>
        <div id="controls"></div>
        <div id="layers-view" class="hidden"></div>
      </div>
      <div id="notification" class="notification hidden"></div>
      <div id="dialog" class="dialog hidden">
        <div class="dialog-content">
          <p id="dialog-message"></p>
          <button id="dialog-yes" class="dialog-btn">Yes</button>
          <button id="dialog-no" class="dialog-btn">No</button>
        </div>
      </div>
    `;
        wrapper.appendChild(appDiv);
    }
    setupPageBuilder() {
        try {
            if (!this.pageBuilder) {
                this.setupDOMStructure();
                // Create new PageBuilder instance
                const pageBuilder = new PageBuilder();
                this.pageBuilder = pageBuilder;
                if (this.onInitialize) {
                    this.onInitialize(pageBuilder);
                }
                // Trigger DOMContentLoaded to initialize PageBuilder
                const event = new Event('DOMContentLoaded');
                document.dispatchEvent(event);
            }
        }
        catch (error) {
            console.error('Error initializing PageBuilder:', error);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageBuilderComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: PageBuilderComponent, isStandalone: true, selector: "mf-page-builder", inputs: { onInitialize: "onInitialize", customStyles: "customStyles" }, ngImport: i0, template: ` <div #wrapper [ngStyle]="getWrapperStyles()"></div> `, isInline: true, styles: [":host{display:block;width:100%;height:100%}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageBuilderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mf-page-builder', standalone: true, imports: [CommonModule], template: ` <div #wrapper [ngStyle]="getWrapperStyles()"></div> `, styles: [":host{display:block;width:100%;height:100%}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { onInitialize: [{
                type: Input
            }], customStyles: [{
                type: Input
            }] } });

class PageBuilderModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageBuilderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: PageBuilderModule, imports: [PageBuilderComponent], exports: [PageBuilderComponent] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageBuilderModule, imports: [PageBuilderComponent] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PageBuilderModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [PageBuilderComponent],
                    exports: [PageBuilderComponent]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { PageBuilderComponent, PageBuilderModule };
//# sourceMappingURL=mindfiredigital-page-builder-angular.mjs.map
