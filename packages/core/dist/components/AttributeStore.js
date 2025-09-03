export class AttributeStore {
  static set(key, value) {
    this.values[key] = value;
    this.notify();
  }
  static get(key) {
    return this.values[key];
  }
  static getAll() {
    return Object.assign({}, this.values);
  }
  static onChange(listener) {
    this.listeners.push(listener);
  }
  static notify() {
    const snapshot = this.getAll();
    console.log(snapshot, 'snapshot');
    this.listeners.forEach(fn => fn(snapshot));
  }
}
AttributeStore.values = {};
AttributeStore.listeners = [];
