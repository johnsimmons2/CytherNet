import { Observable } from "rxjs";

export interface TableActon {
  label: string;
  disabled: (...args: any) => boolean;
  color: 'primary' | 'secondary' | 'warn';
  action: (...args: any) => any;
}
