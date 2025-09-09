export declare class ImageComponent {
  private static imageAttributeConfig;
  create(
    src?: string | null,
    imageAttributeConfig?: Function | undefined | null
  ): HTMLElement;
  static handleFileChange(
    event: Event,
    container: HTMLElement,
    uploadText: HTMLElement
  ): void;
  static restoreImageUpload(
    component: HTMLElement,
    src: string,
    editable: boolean | null
  ): void;
}
