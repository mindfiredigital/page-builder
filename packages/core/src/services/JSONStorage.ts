export class JSONStorage {
  save(data: object) {
    localStorage.setItem('pageLayout', JSON.stringify(data));
  }

  load(): object | null {
    const data = localStorage.getItem('pageLayout');
    return data ? JSON.parse(data) : null;
  }
  remove() {
    localStorage.removeItem('pageLayout');
  }
}
