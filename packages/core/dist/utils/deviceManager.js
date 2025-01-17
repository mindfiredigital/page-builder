export class DeviceManager {
  constructor() {
    this.currentDevice = 'desktop';
    this.devices = [
      {
        name: 'mobile',
        width: 320,
        widthMedia: 480,
      },
      {
        name: 'tablet',
        width: 768,
        widthMedia: 991,
      },
      {
        name: 'desktop',
        width: 1024,
        widthMedia: 1200,
      },
    ];
    this.componentStyles = new Map();
    this.onDeviceChangeCallbacks = [];
    this.initializeDeviceDetection();
  }
  onDeviceChange(callback) {
    this.onDeviceChangeCallbacks.push(callback);
  }
  initializeDeviceDetection() {
    window.addEventListener('resize', this.onResize.bind(this));
    this.onResize();
  }
  onResize() {
    const width = window.innerWidth;
    let newDevice = 'desktop';
    for (const device of this.devices) {
      if (width <= device.widthMedia) {
        newDevice = device.name;
        break;
      }
    }
    if (this.currentDevice !== newDevice) {
      this.currentDevice = newDevice;
      this.applyResponsiveStyles();
      this.onDeviceChangeCallbacks.forEach(callback => callback(newDevice));
    }
  }
  getCurrentDevice() {
    return this.currentDevice;
  }
  setComponentStyle(componentId, device, styles, position) {
    const componentStyles = this.componentStyles.get(componentId) || {};
    componentStyles[device] = { position, styles };
    this.componentStyles.set(componentId, componentStyles);
    if (device === this.currentDevice) {
      this.applyComponentStyles(componentId);
    }
  }
  getComponentStyle(componentId, device) {
    const styles = this.componentStyles.get(componentId);
    // If no styles are found, return null
    if (!styles) return null;
    // If a specific device is requested, validate and return its styles or null
    if (device) {
      const deviceStyles = styles[device];
      return deviceStyles ? { [device]: deviceStyles } : null; // Ensure it conforms to ResponsiveStyles
    }
    // Return the full styles object, ensuring it matches the type definition
    return styles;
  }
  applyResponsiveStyles() {
    this.componentStyles.forEach((_, componentId) => {
      this.applyComponentStyles(componentId);
    });
  }
  applyComponentStyles(componentId) {
    const element = document.querySelector(`.${componentId}`);
    if (!element) return;
    const styles = this.componentStyles.get(componentId);
    if (!styles || !styles[this.currentDevice]) return;
    const { position, styles: cssStyles } = styles[this.currentDevice];
    Object.assign(element.style, cssStyles);
    element.style.left = `${position.x}px`;
    element.style.top = `${position.y}px`;
    element.style.width = `${position.width}px`;
    element.style.height = `${position.height}px`;
  }
}
