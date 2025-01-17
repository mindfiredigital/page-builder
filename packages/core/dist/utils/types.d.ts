export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export interface DeviceConfig {
  name: DeviceType;
  width: number;
  height?: number;
  widthMedia?: number;
}
export interface ComponentPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface ResponsiveStyles {
  [device: string]: {
    position: ComponentPosition;
    styles: Partial<CSSStyleDeclaration>;
  };
}
