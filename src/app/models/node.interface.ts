/**
 * Each node has a key-value and an optional list of children.
 */
export interface CustomNode {
  key: string;
  value: string;
  children?: CustomNode[];
}
