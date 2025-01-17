export declare class ImageComponent {
  create(src?: string | null): HTMLElement;
  static handleFileChange(
    event: Event,
    container: HTMLElement,
    uploadText: HTMLElement
  ): void;
  static restoreImageUpload(component: HTMLElement, src: string): void;
}
