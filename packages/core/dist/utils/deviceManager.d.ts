import { DeviceType, ComponentPosition, ResponsiveStyles } from './types';
export declare class DeviceManager {
  private currentDevice;
  private devices;
  private componentStyles;
  private onDeviceChangeCallbacks;
  constructor();
  onDeviceChange(callback: (device: DeviceType) => void): void;
  private initializeDeviceDetection;
  private onResize;
  getCurrentDevice(): DeviceType;
  setComponentStyle(
    componentId: string,
    device: DeviceType,
    styles: Partial<CSSStyleDeclaration>,
    position: ComponentPosition
  ): void;
  getComponentStyle(
    componentId: string,
    device?: DeviceType
  ): ResponsiveStyles | null;
  private applyResponsiveStyles;
  private applyComponentStyles;
}
