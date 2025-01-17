export declare class ImageComponent {
  create(src?: string): HTMLElement;
  static handleFileChange(event: Event, container: HTMLElement): void;
  static restoreImageUpload(component: HTMLElement, src: string): void;
}
