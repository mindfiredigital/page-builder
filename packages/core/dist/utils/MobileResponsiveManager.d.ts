export declare class MobileResponsiveManager {
  private backdrop;
  private fabBar;
  private componentsFabBtn;
  private propertiesFabBtn;
  private mediaQuery;
  private tapListenerCleanup;
  private constructor();
  static init(layoutMode: 'absolute' | 'grid', editable: boolean | null): void;
  private setup;
  private createBackdrop;
  private injectDrawerHeaders;
  private buildDrawerHeader;
  private createFabBar;
  private buildFabButton;
  private toggleDrawer;
  private closeAllDrawers;
  private enableTapToAdd;
  private disableTapToAdd;
  private addComponentToCanvas;
  private onViewportChange;
}
