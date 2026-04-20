export class JSONStorage {
  save(data: PageBuilderDesign): void {
    localStorage.setItem('pageLayout', JSON.stringify(data));
  }

  load(): PageBuilderDesign | null {
    const data = localStorage.getItem('pageLayout');
    if (!data) return null;
    try {
      return JSON.parse(data) as PageBuilderDesign;
    } catch {
      return null;
    }
  }

  remove(): void {
    localStorage.removeItem('pageLayout');
  }
}
