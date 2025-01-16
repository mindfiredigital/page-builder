export declare class ImageComponent {
  create(): HTMLElement;
  static handleFileChange(event: Event, container: HTMLElement): void;
  static restoreImageUpload(component: HTMLElement, src: string): void;
  addResizableHandles(container: HTMLElement): void;
}
