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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1idWlsZGVyLWFuZ3VsYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wYWdlLWJ1aWxkZXItYW5ndWxhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBRUwsU0FBUyxFQUdULHNCQUFzQixFQUl0QixlQUFlLEdBQ2hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFhL0MsTUFBTSxPQUFPLG9CQUFvQjtJQVFyQjtJQUNBO0lBQ0E7SUFURCxNQUFNLENBQXFCO0lBQzNCLGdCQUFnQixHQUErQyxFQUFFLENBQUM7SUFFL0MsYUFBYSxDQUEyQjtJQUVwRSxtREFBbUQ7SUFDbkQsWUFDVSxRQUFrQixFQUNsQixNQUFzQixFQUN0QixXQUFnQztRQUZoQyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBQ3RCLGdCQUFXLEdBQVgsV0FBVyxDQUFxQjtJQUN2QyxDQUFDO0lBRUosZUFBZTtRQUNiLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFTyx1QkFBdUI7UUFDN0IsTUFBTSxlQUFlLEdBQXNCO1lBQ3pDLEdBQUcsSUFBSSxDQUFDLE1BQU07WUFDZCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLElBQUksRUFBRTtTQUNsQyxDQUFDO1FBRUYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsRUFBRSxFQUFFO1lBQ3ZFLE1BQU0sT0FBTyxHQUFHLGdCQUFnQixHQUFHLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztZQUVwRCxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUNqQyx1RUFBdUU7Z0JBQ3ZFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQy9CLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQzNCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBRXJDLDJEQUEyRDtnQkFDM0QsTUFBTSxrQkFBbUIsU0FBUSxXQUFXO29CQUNsQyxZQUFZLEdBQTZCLElBQUksQ0FBQztvQkFFdEQsaUJBQWlCO3dCQUNmLGdFQUFnRTt3QkFDaEUsSUFBSSxDQUFDLFlBQVksR0FBRyxlQUFlLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRTs0QkFDN0QsbUJBQW1CLEVBQUUsV0FBVzs0QkFDaEMsZUFBZSxFQUFFLFFBQVE7NEJBQ3pCLFdBQVcsRUFBRSxJQUFJO3lCQUNsQixDQUFDLENBQUM7d0JBRUgsMEJBQTBCO3dCQUMxQixNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBRTlDLDREQUE0RDt3QkFDNUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDN0QsQ0FBQztvQkFFRCxvQkFBb0I7d0JBQ2xCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDOzRCQUN0QixNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQzlDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7NEJBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO3dCQUMzQixDQUFDO29CQUNILENBQUM7aUJBQ0Y7Z0JBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUNyRCxDQUFDO1lBRUQsZUFBZSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRztnQkFDNUIsU0FBUyxFQUFFLE9BQU87Z0JBQ2xCLEdBQUcsRUFBRSxlQUFlLENBQUMsR0FBRztnQkFDeEIsS0FBSyxFQUFFLGVBQWUsQ0FBQyxLQUFLO2FBQzdCLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FDM0MsYUFBYSxFQUNiLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQ2hDLENBQUM7SUFDSixDQUFDO3VHQTFFVSxvQkFBb0I7MkZBQXBCLG9CQUFvQiwrUEFIckIsOENBQThDLDJEQUQ5QyxZQUFZOzsyRkFJWCxvQkFBb0I7a0JBUGhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsUUFBUSxFQUFFLDhDQUE4QztvQkFDeEQsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQUM7aUJBQ2xDOzRJQUVVLE1BQU07c0JBQWQsS0FBSztnQkFDRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBRXNCLGFBQWE7c0JBQXhDLFNBQVM7dUJBQUMsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIFZpZXdDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgQ29tcG9uZW50UmVmLFxuICBDVVNUT01fRUxFTUVOVFNfU0NIRU1BLFxuICBBcHBsaWNhdGlvblJlZixcbiAgSW5qZWN0b3IsXG4gIEVudmlyb25tZW50SW5qZWN0b3IsXG4gIGNyZWF0ZUNvbXBvbmVudCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgRHluYW1pY0NvbXBvbmVudHMsXG4gIFBhZ2VCdWlsZGVyQ3VzdG9tQ29tcG9uZW50LFxufSBmcm9tICcuL21vZGVscy9jdXN0b20tc3R5bGVzLmludGVyZmFjZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21mLXBhZ2UtYnVpbGRlcicsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICB0ZW1wbGF0ZTogYDxwYWdlLWJ1aWxkZXIgI3BhZ2VCdWlsZGVyRWw+PC9wYWdlLWJ1aWxkZXI+YCxcbiAgc2NoZW1hczogW0NVU1RPTV9FTEVNRU5UU19TQ0hFTUFdLFxufSlcbmV4cG9ydCBjbGFzcyBQYWdlQnVpbGRlckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKSBjb25maWchOiBEeW5hbWljQ29tcG9uZW50cztcbiAgQElucHV0KCkgY3VzdG9tQ29tcG9uZW50czogUmVjb3JkPHN0cmluZywgUGFnZUJ1aWxkZXJDdXN0b21Db21wb25lbnQ+ID0ge307XG5cbiAgQFZpZXdDaGlsZCgncGFnZUJ1aWxkZXJFbCcpIHBhZ2VCdWlsZGVyRWwhOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAvLyBDb3JyZWN0bHkgaW5qZWN0IGRlcGVuZGVuY2llcyBpbiB0aGUgY29uc3RydWN0b3JcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJpdmF0ZSBhcHBSZWY6IEFwcGxpY2F0aW9uUmVmLFxuICAgIHByaXZhdGUgZW52SW5qZWN0b3I6IEVudmlyb25tZW50SW5qZWN0b3JcbiAgKSB7fVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnByb2Nlc3NDdXN0b21Db21wb25lbnRzKCk7XG4gIH1cblxuICBwcml2YXRlIHByb2Nlc3NDdXN0b21Db21wb25lbnRzKCk6IHZvaWQge1xuICAgIGNvbnN0IHByb2Nlc3NlZENvbmZpZzogRHluYW1pY0NvbXBvbmVudHMgPSB7XG4gICAgICAuLi50aGlzLmNvbmZpZyxcbiAgICAgIEN1c3RvbTogdGhpcy5jb25maWc/LkN1c3RvbSB8fCB7fSxcbiAgICB9O1xuXG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5jdXN0b21Db21wb25lbnRzKS5mb3JFYWNoKChba2V5LCBjb21wb25lbnRDb25maWddKSA9PiB7XG4gICAgICBjb25zdCB0YWdOYW1lID0gYG5nLWNvbXBvbmVudC0ke2tleS50b0xvd2VyQ2FzZSgpfWA7XG5cbiAgICAgIGlmICghY3VzdG9tRWxlbWVudHMuZ2V0KHRhZ05hbWUpKSB7XG4gICAgICAgIC8vIENhcHR1cmUgdGhlIGluamVjdGVkIGRlcGVuZGVuY2llcyBmcm9tIHRoZSBwYXJlbnQgY29tcG9uZW50J3Mgc2NvcGUuXG4gICAgICAgIGNvbnN0IGluamVjdG9yID0gdGhpcy5pbmplY3RvcjtcbiAgICAgICAgY29uc3QgYXBwUmVmID0gdGhpcy5hcHBSZWY7XG4gICAgICAgIGNvbnN0IGVudkluamVjdG9yID0gdGhpcy5lbnZJbmplY3RvcjtcblxuICAgICAgICAvLyBUaGUgY2xhc3MgYWNjZXNzZXMgdGhlIGNhcHR1cmVkIGRlcGVuZGVuY2llcyB2aWEgY2xvc3VyZVxuICAgICAgICBjbGFzcyBBbmd1bGFySG9zdEVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgICAgICAgcHJpdmF0ZSBjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxhbnk+IHwgbnVsbCA9IG51bGw7XG5cbiAgICAgICAgICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgY29tcG9uZW50IGluLXBsYWNlIHVzaW5nIHRoZSBjYXB0dXJlZCBkZXBlbmRlbmNpZXNcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50UmVmID0gY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudENvbmZpZy5jb21wb25lbnQsIHtcbiAgICAgICAgICAgICAgZW52aXJvbm1lbnRJbmplY3RvcjogZW52SW5qZWN0b3IsXG4gICAgICAgICAgICAgIGVsZW1lbnRJbmplY3RvcjogaW5qZWN0b3IsXG4gICAgICAgICAgICAgIGhvc3RFbGVtZW50OiB0aGlzLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEF0dGFjaCBjaGFuZ2UgZGV0ZWN0aW9uXG4gICAgICAgICAgICBhcHBSZWYuYXR0YWNoVmlldyh0aGlzLmNvbXBvbmVudFJlZi5ob3N0Vmlldyk7XG5cbiAgICAgICAgICAgIC8vIEFwcGVuZCB0aGUgY29tcG9uZW50J3Mgcm9vdCBub2RlIGludG8gdGhpcyBjdXN0b20gZWxlbWVudFxuICAgICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNvbXBvbmVudFJlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbXBvbmVudFJlZikge1xuICAgICAgICAgICAgICBhcHBSZWYuZGV0YWNoVmlldyh0aGlzLmNvbXBvbmVudFJlZi5ob3N0Vmlldyk7XG4gICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRSZWYgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSh0YWdOYW1lLCBBbmd1bGFySG9zdEVsZW1lbnQpO1xuICAgICAgfVxuXG4gICAgICBwcm9jZXNzZWRDb25maWcuQ3VzdG9tW2tleV0gPSB7XG4gICAgICAgIGNvbXBvbmVudDogdGFnTmFtZSxcbiAgICAgICAgc3ZnOiBjb21wb25lbnRDb25maWcuc3ZnLFxuICAgICAgICB0aXRsZTogY29tcG9uZW50Q29uZmlnLnRpdGxlLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHRoaXMucGFnZUJ1aWxkZXJFbC5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZShcbiAgICAgICdjb25maWctZGF0YScsXG4gICAgICBKU09OLnN0cmluZ2lmeShwcm9jZXNzZWRDb25maWcpXG4gICAgKTtcbiAgfVxufVxuIl19