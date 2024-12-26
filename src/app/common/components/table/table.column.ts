export interface TableColumn {
  name: string;
  width?: number;
  canEdit?: (...args: any) => boolean;
  getValue?: (...args: any) => any;
  customTemplate?: any;
  alias?: string;
}
