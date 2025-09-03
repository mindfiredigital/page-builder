export declare class AttributeStore {
  private static values;
  private static listeners;
  static set(key: string, value: any): void;
  static get(key: string): any;
  static getAll(): {
    [x: string]: any;
  };
  static onChange(listener: (values: Record<string, any>) => void): void;
  private static notify;
}
