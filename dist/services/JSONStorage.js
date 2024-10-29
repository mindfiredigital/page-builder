export class JSONStorage {
  save(data) {
    localStorage.setItem('pageLayout', JSON.stringify(data));
  }
  load() {
    const data = localStorage.getItem('pageLayout');
    return data ? JSON.parse(data) : null;
  }
}
