//event helper
export function addEvent(
  el: HTMLElement,
  event: string,
  handler: EventListener
) {
  el.addEventListener(event, handler);
}
