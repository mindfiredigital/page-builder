declare global {
  namespace JSX {
    interface IntrinsicElements {
      'page-builder': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export {}; // Prevents TypeScript from treating this file as a script
