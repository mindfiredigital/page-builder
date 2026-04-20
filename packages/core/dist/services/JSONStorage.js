export class JSONStorage {
  save(data) {
    localStorage.setItem('pageLayout', JSON.stringify(data));
  }
  load() {
    const data = localStorage.getItem('pageLayout');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (_a) {
      return null;
    }
  }
  remove() {
    localStorage.removeItem('pageLayout');
  }
}
