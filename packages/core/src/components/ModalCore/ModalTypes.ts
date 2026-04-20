/* Shape of a single attribute entry passed into the modal form */
export interface ComponentAttribute {
  id: string;
  key: string;
  title: string;
  type: string;
  value?: string | number | boolean;
}
