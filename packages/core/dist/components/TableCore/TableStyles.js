/* Utility functions for applying consistent button styles across table controls */
/* Applies base styles and hover behaviour to a given button element */
export function StyleButton(button, bgColor, hoverColor) {
  button.style.padding = '8px 16px';
  button.style.backgroundColor = bgColor;
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '6px';
  button.style.fontSize = '14px';
  button.style.fontWeight = '500';
  button.style.cursor = 'pointer';
  button.style.transition = 'background-color 0.2s ease';
  /* Toggle hover colour on mouse enter / leave */
  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = hoverColor;
  });
  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = bgColor;
  });
}
