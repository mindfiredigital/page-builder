export declare class VideoComponent {
  private captureStateHandler;
  constructor(captureStateHandler: () => void);
  create(src?: string | null): HTMLElement;
  handleFileChange(event: Event, container: HTMLElement): void;
}
