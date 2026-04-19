/* Returns a short type string based on the element's CSS class */
export function getComponentType(element: HTMLElement): string {
  if (element.classList.contains('text-component')) return 'text';
  if (element.classList.contains('button-component')) return 'button';
  if (element.classList.contains('image-component')) return 'image';
  if (element.classList.contains('container-component')) return 'container';
  return 'component';
}

/* Returns the element's id, or a fallback "<Type> <index>" label */
export function getComponentName(element: HTMLElement): string {
  if (element.id) return element.id;

  const type = getComponentType(element);
  /* 1-based index among siblings that share the same first class */
  const index =
    Array.from(element.parentElement?.children || [])
      .filter(child => child.classList.contains(element.classList[0]))
      .indexOf(element) + 1;

  return `${type.charAt(0).toUpperCase() + type.slice(1)} ${index}`;
}

/* Shows/hides layer items based on whether their name contains the search term */
export function filterLayers(container: HTMLElement, searchTerm: string): void {
  container.querySelectorAll('.layer-item').forEach(item => {
    const layerName =
      item.querySelector('.layer-name')?.textContent?.toLowerCase() || '';

    /* Show matching items, hide non-matching ones */
    (item as HTMLElement).style.display = layerName.includes(searchTerm)
      ? 'flex'
      : 'none';
  });
}
