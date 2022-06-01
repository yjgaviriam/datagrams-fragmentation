/**
 * Cada nodo tiene un valor-clave y una lista opcional de hijos.
 */
export interface ICustomNode {

  /**
   * Identificador del nodo
   */
  key: string;

  /**
   * Valor asociado al identificador
   */
  value: string | number;

  /**
   * Listado de hijos del nodo
   */
  children?: ICustomNode[];
}
