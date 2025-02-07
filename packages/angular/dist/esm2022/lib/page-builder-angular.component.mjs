import { Component, Input, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBuilder } from '@mindfiredigital/page-builder-core/dist/PageBuilder.js';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class PageBuilderComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1idWlsZGVyLWFuZ3VsYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wYWdlLWJ1aWxkZXItYW5ndWxhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFJVCxLQUFLLEdBRU4sTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx3REFBd0QsQ0FBQzs7O0FBa0JyRixNQUFNLE9BQU8sb0JBQW9CO0lBTVg7SUFMWCxZQUFZLENBQXNDO0lBQ2xELFlBQVksR0FBaUIsRUFBRSxDQUFDO0lBRWpDLFdBQVcsR0FBdUIsSUFBSSxDQUFDO0lBRS9DLFlBQW9CLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7SUFBRyxDQUFDO0lBRTlDLFFBQVE7UUFDTiwwQkFBMEI7SUFDNUIsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFFTSxnQkFBZ0I7UUFDckIsT0FBTztZQUNMLE1BQU0sRUFBRSxNQUFNO1lBQ2QsS0FBSyxFQUFFLE1BQU07WUFDYixNQUFNLEVBQUUsTUFBTTtZQUNkLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPO1NBQzdCLENBQUM7SUFDSixDQUFDO0lBRU8saUJBQWlCO1FBQ3ZCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsT0FBTztZQUFFLE9BQU87UUFFckIseUJBQXlCO1FBQ3pCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBRXZCLGdDQUFnQztRQUNoQyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDO1FBRWxCLGlDQUFpQztRQUNqQyxNQUFNLENBQUMsU0FBUyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7O0tBZ0JsQixDQUFDO1FBRUYsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRU8sZ0JBQWdCO1FBQ3RCLElBQUksQ0FBQztZQUNILElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2dCQUV6QixrQ0FBa0M7Z0JBQ2xDLE1BQU0sV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO2dCQUUvQixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDakMsQ0FBQztnQkFFRCxxREFBcUQ7Z0JBQ3JELE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQzVDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEMsQ0FBQztRQUNILENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMxRCxDQUFDO0lBQ0gsQ0FBQzt3R0FsRlUsb0JBQW9COzRGQUFwQixvQkFBb0IsbUpBWHJCLHVEQUF1RCxzSEFEdkQsWUFBWTs7NEZBWVgsb0JBQW9CO2tCQWZoQyxTQUFTOytCQUNFLGlCQUFpQixjQUNmLElBQUksV0FDUCxDQUFDLFlBQVksQ0FBQyxZQUNiLHVEQUF1RDsrRUFZeEQsWUFBWTtzQkFBcEIsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgT25Jbml0LFxyXG4gIE9uRGVzdHJveSxcclxuICBFbGVtZW50UmVmLFxyXG4gIElucHV0LFxyXG4gIEFmdGVyVmlld0luaXQsXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IFBhZ2VCdWlsZGVyIH0gZnJvbSAnQG1pbmRmaXJlZGlnaXRhbC9wYWdlLWJ1aWxkZXItY29yZS9kaXN0L1BhZ2VCdWlsZGVyLmpzJztcclxuaW1wb3J0IHsgQ3VzdG9tU3R5bGVzIH0gZnJvbSAnLi9tb2RlbHMvY3VzdG9tLXN0eWxlcy5pbnRlcmZhY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdtZi1wYWdlLWJ1aWxkZXInLFxyXG4gIHN0YW5kYWxvbmU6IHRydWUsXHJcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXHJcbiAgdGVtcGxhdGU6IGAgPGRpdiAjd3JhcHBlciBbbmdTdHlsZV09XCJnZXRXcmFwcGVyU3R5bGVzKClcIj48L2Rpdj4gYCxcclxuICBzdHlsZXM6IFtcclxuICAgIGBcclxuICAgICAgOmhvc3Qge1xyXG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgfVxyXG4gICAgYCxcclxuICBdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgUGFnZUJ1aWxkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XHJcbiAgQElucHV0KCkgb25Jbml0aWFsaXplPzogKHBhZ2VCdWlsZGVyOiBQYWdlQnVpbGRlcikgPT4gdm9pZDtcclxuICBASW5wdXQoKSBjdXN0b21TdHlsZXM6IEN1c3RvbVN0eWxlcyA9IHt9O1xyXG5cclxuICBwcml2YXRlIHBhZ2VCdWlsZGVyOiBQYWdlQnVpbGRlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgLy8gSW5pdGlhbCBzZXR1cCBpZiBuZWVkZWRcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMuc2V0dXBQYWdlQnVpbGRlcigpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICB0aGlzLnBhZ2VCdWlsZGVyID0gbnVsbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRXcmFwcGVyU3R5bGVzKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbWFyZ2luOiAnYXV0bycsXHJcbiAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgIGhlaWdodDogJzEwMCUnLFxyXG4gICAgICAuLi50aGlzLmN1c3RvbVN0eWxlcy53cmFwcGVyLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0dXBET01TdHJ1Y3R1cmUoKTogdm9pZCB7XHJcbiAgICBjb25zdCB3cmFwcGVyID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2Jyk7XHJcbiAgICBpZiAoIXdyYXBwZXIpIHJldHVybjtcclxuXHJcbiAgICAvLyBDbGVhciBleGlzdGluZyBjb250ZW50XHJcbiAgICB3cmFwcGVyLmlubmVySFRNTCA9ICcnO1xyXG5cclxuICAgIC8vIENyZWF0ZSB0aGUgbWFpbiBhcHAgY29udGFpbmVyXHJcbiAgICBjb25zdCBhcHBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGFwcERpdi5pZCA9ICdhcHAnO1xyXG5cclxuICAgIC8vIENyZWF0ZSByZXF1aXJlZCBpbm5lciBlbGVtZW50c1xyXG4gICAgYXBwRGl2LmlubmVySFRNTCA9IGBcclxuICAgICAgPGRpdiBpZD1cInNpZGViYXJcIj48L2Rpdj5cclxuICAgICAgPGRpdiBpZD1cImNhbnZhc1wiIGNsYXNzPVwiY2FudmFzXCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgaWQ9XCJjdXN0b21pemF0aW9uXCI+XHJcbiAgICAgICAgPGg0IGlkPVwiY29tcG9uZW50LW5hbWVcIj5Db21wb25lbnQ6IE5vbmU8L2g0PlxyXG4gICAgICAgIDxkaXYgaWQ9XCJjb250cm9sc1wiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgaWQ9XCJsYXllcnMtdmlld1wiIGNsYXNzPVwiaGlkZGVuXCI+PC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGlkPVwibm90aWZpY2F0aW9uXCIgY2xhc3M9XCJub3RpZmljYXRpb24gaGlkZGVuXCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgaWQ9XCJkaWFsb2dcIiBjbGFzcz1cImRpYWxvZyBoaWRkZW5cIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZGlhbG9nLWNvbnRlbnRcIj5cclxuICAgICAgICAgIDxwIGlkPVwiZGlhbG9nLW1lc3NhZ2VcIj48L3A+XHJcbiAgICAgICAgICA8YnV0dG9uIGlkPVwiZGlhbG9nLXllc1wiIGNsYXNzPVwiZGlhbG9nLWJ0blwiPlllczwvYnV0dG9uPlxyXG4gICAgICAgICAgPGJ1dHRvbiBpZD1cImRpYWxvZy1ub1wiIGNsYXNzPVwiZGlhbG9nLWJ0blwiPk5vPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgYDtcclxuXHJcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGFwcERpdik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldHVwUGFnZUJ1aWxkZXIoKTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoIXRoaXMucGFnZUJ1aWxkZXIpIHtcclxuICAgICAgICB0aGlzLnNldHVwRE9NU3RydWN0dXJlKCk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBuZXcgUGFnZUJ1aWxkZXIgaW5zdGFuY2VcclxuICAgICAgICBjb25zdCBwYWdlQnVpbGRlciA9IG5ldyBQYWdlQnVpbGRlcigpO1xyXG4gICAgICAgIHRoaXMucGFnZUJ1aWxkZXIgPSBwYWdlQnVpbGRlcjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub25Jbml0aWFsaXplKSB7XHJcbiAgICAgICAgICB0aGlzLm9uSW5pdGlhbGl6ZShwYWdlQnVpbGRlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUcmlnZ2VyIERPTUNvbnRlbnRMb2FkZWQgdG8gaW5pdGlhbGl6ZSBQYWdlQnVpbGRlclxyXG4gICAgICAgIGNvbnN0IGV2ZW50ID0gbmV3IEV2ZW50KCdET01Db250ZW50TG9hZGVkJyk7XHJcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluaXRpYWxpemluZyBQYWdlQnVpbGRlcjonLCBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==