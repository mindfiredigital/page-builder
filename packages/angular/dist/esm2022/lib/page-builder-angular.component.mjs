import { Component, Input, ViewChild, CUSTOM_ELEMENTS_SCHEMA, createComponent, } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
export class PageBuilderComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1idWlsZGVyLWFuZ3VsYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wYWdlLWJ1aWxkZXItYW5ndWxhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBRUwsU0FBUyxFQUlULHNCQUFzQixFQUl0QixlQUFlLEdBQ2hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFnQy9DLE1BQU0sT0FBTyxvQkFBb0I7SUFRckI7SUFDQTtJQUNBO0lBVEQsTUFBTSxDQUFxQjtJQUMzQixnQkFBZ0IsR0FBK0MsRUFBRSxDQUFDO0lBRS9DLGFBQWEsQ0FBMkI7SUFFcEUsbURBQW1EO0lBQ25ELFlBQ1UsUUFBa0IsRUFDbEIsTUFBc0IsRUFDdEIsV0FBZ0M7UUFGaEMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixXQUFNLEdBQU4sTUFBTSxDQUFnQjtRQUN0QixnQkFBVyxHQUFYLFdBQVcsQ0FBcUI7SUFDdkMsQ0FBQztJQUVKLGVBQWU7UUFDYixJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRU8sdUJBQXVCO1FBQzdCLE1BQU0sZUFBZSxHQUFzQjtZQUN6QyxHQUFHLElBQUksQ0FBQyxNQUFNO1lBQ2QsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxJQUFJLEVBQUU7U0FDbEMsQ0FBQztRQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDLEVBQUUsRUFBRTtZQUN2RSxNQUFNLE9BQU8sR0FBRyxnQkFBZ0IsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7WUFFcEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDakMsdUVBQXVFO2dCQUN2RSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUMvQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUMzQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUVyQywyREFBMkQ7Z0JBQzNELE1BQU0sa0JBQW1CLFNBQVEsV0FBVztvQkFDbEMsWUFBWSxHQUE2QixJQUFJLENBQUM7b0JBRXRELGlCQUFpQjt3QkFDZixnRUFBZ0U7d0JBQ2hFLElBQUksQ0FBQyxZQUFZLEdBQUcsZUFBZSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUU7NEJBQzdELG1CQUFtQixFQUFFLFdBQVc7NEJBQ2hDLGVBQWUsRUFBRSxRQUFROzRCQUN6QixXQUFXLEVBQUUsSUFBSTt5QkFDbEIsQ0FBQyxDQUFDO3dCQUVILDBCQUEwQjt3QkFDMUIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUU5Qyw0REFBNEQ7d0JBQzVELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQzdELENBQUM7b0JBRUQsb0JBQW9CO3dCQUNsQixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzs0QkFDdEIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzRCQUM5QyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDOzRCQUM1QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzt3QkFDM0IsQ0FBQztvQkFDSCxDQUFDO2lCQUNGO2dCQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFDckQsQ0FBQztZQUVELGVBQWUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUc7Z0JBQzVCLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixHQUFHLEVBQUUsZUFBZSxDQUFDLEdBQUc7Z0JBQ3hCLEtBQUssRUFBRSxlQUFlLENBQUMsS0FBSzthQUM3QixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQzNDLGFBQWEsRUFDYixJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUNoQyxDQUFDO0lBQ0osQ0FBQzt1R0ExRVUsb0JBQW9COzJGQUFwQixvQkFBb0IsK1BBSHJCLDhDQUE4QywyREFEOUMsWUFBWTs7MkZBSVgsb0JBQW9CO2tCQVBoQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLFVBQVUsRUFBRSxJQUFJO29CQUNoQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLFFBQVEsRUFBRSw4Q0FBOEM7b0JBQ3hELE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO2lCQUNsQzs0SUFFVSxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0csZ0JBQWdCO3NCQUF4QixLQUFLO2dCQUVzQixhQUFhO3NCQUF4QyxTQUFTO3VCQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBBZnRlclZpZXdJbml0LFxuICBWaWV3Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG4gIFR5cGUsXG4gIENvbXBvbmVudFJlZixcbiAgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSxcbiAgQXBwbGljYXRpb25SZWYsXG4gIEluamVjdG9yLFxuICBFbnZpcm9ubWVudEluamVjdG9yLFxuICBjcmVhdGVDb21wb25lbnQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuLy8gRGVmaW5lIHRoZSBpbnRlcmZhY2UgZm9yIHRoZSBjdXN0b20gY29tcG9uZW50c1xuZXhwb3J0IGludGVyZmFjZSBQYWdlQnVpbGRlckN1c3RvbUNvbXBvbmVudCB7XG4gIGNvbXBvbmVudDogVHlwZTxhbnk+O1xuICBzdmc6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgc2V0dGluZ3NDb21wb25lbnQ/OiBUeXBlPGFueT47XG59XG5cbi8vIERlZmluZSB0aGUgaW50ZXJmYWNlIGZvciB0aGUgbWFpbiBwYWdlIGJ1aWxkZXIgY29uZmlnXG5pbnRlcmZhY2UgRHluYW1pY0NvbXBvbmVudHMge1xuICBCYXNpYzogYW55W107XG4gIEV4dHJhOiBhbnlbXTtcbiAgQ3VzdG9tOiBSZWNvcmQ8XG4gICAgc3RyaW5nLFxuICAgIHtcbiAgICAgIGNvbXBvbmVudDogc3RyaW5nO1xuICAgICAgc3ZnOiBzdHJpbmc7XG4gICAgICB0aXRsZTogc3RyaW5nO1xuICAgICAgc2V0dGluZ3NDb21wb25lbnQ/OiBzdHJpbmc7XG4gICAgfVxuICA+O1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtZi1wYWdlLWJ1aWxkZXInLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgdGVtcGxhdGU6IGA8cGFnZS1idWlsZGVyICNwYWdlQnVpbGRlckVsPjwvcGFnZS1idWlsZGVyPmAsXG4gIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXSxcbn0pXG5leHBvcnQgY2xhc3MgUGFnZUJ1aWxkZXJDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgY29uZmlnITogRHluYW1pY0NvbXBvbmVudHM7XG4gIEBJbnB1dCgpIGN1c3RvbUNvbXBvbmVudHM6IFJlY29yZDxzdHJpbmcsIFBhZ2VCdWlsZGVyQ3VzdG9tQ29tcG9uZW50PiA9IHt9O1xuXG4gIEBWaWV3Q2hpbGQoJ3BhZ2VCdWlsZGVyRWwnKSBwYWdlQnVpbGRlckVsITogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgLy8gQ29ycmVjdGx5IGluamVjdCBkZXBlbmRlbmNpZXMgaW4gdGhlIGNvbnN0cnVjdG9yXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByaXZhdGUgYXBwUmVmOiBBcHBsaWNhdGlvblJlZixcbiAgICBwcml2YXRlIGVudkluamVjdG9yOiBFbnZpcm9ubWVudEluamVjdG9yXG4gICkge31cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5wcm9jZXNzQ3VzdG9tQ29tcG9uZW50cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcm9jZXNzQ3VzdG9tQ29tcG9uZW50cygpOiB2b2lkIHtcbiAgICBjb25zdCBwcm9jZXNzZWRDb25maWc6IER5bmFtaWNDb21wb25lbnRzID0ge1xuICAgICAgLi4udGhpcy5jb25maWcsXG4gICAgICBDdXN0b206IHRoaXMuY29uZmlnPy5DdXN0b20gfHwge30sXG4gICAgfTtcblxuICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuY3VzdG9tQ29tcG9uZW50cykuZm9yRWFjaCgoW2tleSwgY29tcG9uZW50Q29uZmlnXSkgPT4ge1xuICAgICAgY29uc3QgdGFnTmFtZSA9IGBuZy1jb21wb25lbnQtJHtrZXkudG9Mb3dlckNhc2UoKX1gO1xuXG4gICAgICBpZiAoIWN1c3RvbUVsZW1lbnRzLmdldCh0YWdOYW1lKSkge1xuICAgICAgICAvLyBDYXB0dXJlIHRoZSBpbmplY3RlZCBkZXBlbmRlbmNpZXMgZnJvbSB0aGUgcGFyZW50IGNvbXBvbmVudCdzIHNjb3BlLlxuICAgICAgICBjb25zdCBpbmplY3RvciA9IHRoaXMuaW5qZWN0b3I7XG4gICAgICAgIGNvbnN0IGFwcFJlZiA9IHRoaXMuYXBwUmVmO1xuICAgICAgICBjb25zdCBlbnZJbmplY3RvciA9IHRoaXMuZW52SW5qZWN0b3I7XG5cbiAgICAgICAgLy8gVGhlIGNsYXNzIGFjY2Vzc2VzIHRoZSBjYXB0dXJlZCBkZXBlbmRlbmNpZXMgdmlhIGNsb3N1cmVcbiAgICAgICAgY2xhc3MgQW5ndWxhckhvc3RFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgICAgICAgIHByaXZhdGUgY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8YW55PiB8IG51bGwgPSBudWxsO1xuXG4gICAgICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGNvbXBvbmVudCBpbi1wbGFjZSB1c2luZyB0aGUgY2FwdHVyZWQgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudFJlZiA9IGNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRDb25maWcuY29tcG9uZW50LCB7XG4gICAgICAgICAgICAgIGVudmlyb25tZW50SW5qZWN0b3I6IGVudkluamVjdG9yLFxuICAgICAgICAgICAgICBlbGVtZW50SW5qZWN0b3I6IGluamVjdG9yLFxuICAgICAgICAgICAgICBob3N0RWxlbWVudDogdGhpcyxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBBdHRhY2ggY2hhbmdlIGRldGVjdGlvblxuICAgICAgICAgICAgYXBwUmVmLmF0dGFjaFZpZXcodGhpcy5jb21wb25lbnRSZWYuaG9zdFZpZXcpO1xuXG4gICAgICAgICAgICAvLyBBcHBlbmQgdGhlIGNvbXBvbmVudCdzIHJvb3Qgbm9kZSBpbnRvIHRoaXMgY3VzdG9tIGVsZW1lbnRcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jb21wb25lbnRSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb21wb25lbnRSZWYpIHtcbiAgICAgICAgICAgICAgYXBwUmVmLmRldGFjaFZpZXcodGhpcy5jb21wb25lbnRSZWYuaG9zdFZpZXcpO1xuICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5kZXN0cm95KCk7XG4gICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50UmVmID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnTmFtZSwgQW5ndWxhckhvc3RFbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgcHJvY2Vzc2VkQ29uZmlnLkN1c3RvbVtrZXldID0ge1xuICAgICAgICBjb21wb25lbnQ6IHRhZ05hbWUsXG4gICAgICAgIHN2ZzogY29tcG9uZW50Q29uZmlnLnN2ZyxcbiAgICAgICAgdGl0bGU6IGNvbXBvbmVudENvbmZpZy50aXRsZSxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICB0aGlzLnBhZ2VCdWlsZGVyRWwubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXG4gICAgICAnY29uZmlnLWRhdGEnLFxuICAgICAgSlNPTi5zdHJpbmdpZnkocHJvY2Vzc2VkQ29uZmlnKVxuICAgICk7XG4gIH1cbn1cbiJdfQ==