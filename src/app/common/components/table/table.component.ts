import { CommonModule, DatePipe, formatDate } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonCol, IonContent, IonDatetime, IonGrid, IonIcon, IonInput, IonLabel, IonModal, IonRow, IonSelect, IonSelectOption, IonTextarea } from "@ionic/angular/standalone";
import { TableActon } from "./table.actions";
import { TableValueChangeEvent } from "./tablevaluechanges.event";
import { TableColumn } from "./table.column";
import { format } from "util";
import moment from 'moment';
import assert from "assert";


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonModal,
    IonCardSubtitle,
    IonIcon,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonCheckbox,
    IonDatetime,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ],
  providers: [
    DatePipe
  ],
  styles: `
  .shrinkable {
    flex: 1 1 auto; /* Allow columns to grow and shrink as needed */
    min-width: 50px; /* Ensure columns don’t shrink too much */
    max-width: 300px; /* Limit columns that don’t need to be too wide */
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  `,
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns!: TableColumn[];
  @Input() actions!: TableActon[];
  @Input() primaryColumn: string = 'id';
  @Input() editable: boolean = true;
  @Output() action = new EventEmitter<any>();
  @Output() valueChange = new EventEmitter<TableValueChangeEvent>();

  @ViewChild(IonModal) modal!: IonModal;


  columnWidths: number [] = [];
  actionsColumnWidth: number = 100;

  isEditingRow: boolean = false;
  contextTemplate: any = undefined;
  contextHeaderColumn: string = '';
  contextHeaderColumnName: string = '';
  contextIndex: number = -1;
  contextColumnIndex: number = -1;
  contextRow: any = {};
  contextNewValue: any = undefined;

  constructor() { }

  ngOnInit() {
    this.calculateColumnWidths();
  }

  onAction(action: string, data: any) {
    this.action.emit({ action, data });
  }

  actionEdit(index: number) {
    this.isEditingRow = true;
    this.contextIndex = index;
    this.contextRow = { ...this.data[index] };
  }

  actionView(index: number, column: number) {
    this.isEditingRow = false;
    this.contextIndex = index;
    this.contextColumnIndex = column;
    this.contextHeaderColumn = this.columns[column].name;
    this.contextHeaderColumnName = this.columns[column].alias ?? this.contextHeaderColumn;
    this.contextRow = { ...this.data[index] };
    this.contextTemplate = this.columns[column].customTemplate ?? undefined;
    console.log(this.contextRow);
    this.modal.present();
  }

  getTextWidth(text: string, font: string): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = font;
      return context.measureText(text).width + 20; // Add padding
    }
    return 0;
  }

  logTest(event: any) {
    console.log(event);
    console.log(this.contextRow);
    console.log(this.contextHeaderColumn);
    console.log(this.contextColumnIndex);
    console.log(this.contextIndex);
  }

  canEditRow(index: number, colIndex: number): boolean {
    if (!this.editable) {
      return false;
    }
    const column = this.columns[colIndex];
    if (column?.canEdit &&
        (column?.canEdit instanceof Function || typeof column?.canEdit === 'function')) {
      return column.canEdit(index) ?? false;
    }
    return true;
  }

  calculateColumnWidths(): void {
    const minWidth = 50; // Minimum width for a column
    const maxWidth = 300; // Maximum width for a column

    // Initialize column widths
    this.columnWidths = this.columns.map(() => 0);

    // Calculate maximum width for each column
    this.data.forEach((row) => {
      this.columns.forEach((col, i) => {
        const cellContent = row[col.name]?.toString() || '';
        const width = this.getTextWidth(cellContent, '16px Arial');
        this.columnWidths[i] = Math.max(this.columnWidths[i], width);
      });
    });

    // Apply min and max width constraints
    this.columnWidths = this.columnWidths.map((width) => Math.max(minWidth, Math.min(maxWidth, width)));

    // Optional: Adjust actions column width
    this.actionsColumnWidth = Math.max(
      ...this.actions.map((action) => this.getTextWidth(action.label, '16px Arial')),
      this.actionsColumnWidth
    );
  }

  confirmChange() {
    this.modal.dismiss(null, 'confirm').then(() => {
      this.valueChange.emit({
        column: this.contextHeaderColumn,
        value: this.contextNewValue,
        oldValue: this.contextRow[this.contextHeaderColumn],
        index: this.contextIndex,
        data: this.contextRow
      });
      this.isEditingRow = false;
      this.contextIndex = -1;
      this.contextColumnIndex = -1;
      this.contextHeaderColumn = '';
      this.contextRow = { };
      this.contextNewValue = undefined;
    });
  }

  cancel() {
    this.modal.dismiss(null, 'cancel').then(() => {
      this.isEditingRow = false;
      this.contextIndex = -1;
      this.contextColumnIndex = -1;
      this.contextHeaderColumn = '';
      this.contextRow = { };
      this.contextNewValue = undefined;
      this.contextTemplate = undefined;
    });
  }

  getDisplayName(index: number, colIndex: number): string {
    const column = this.columns[colIndex].name;
    const cell = this.data[index];
    const data = cell[column];
    const emptyText = '[ None ]';
    try {
      if (typeof this.columns[colIndex]?.getValue === 'function') {

        const result = this.columns[colIndex]?.getValue!(cell);
        if (result) {
          return result.toString();
        }
      }

      if (typeof data !== 'object'){
        if (moment(data, moment.ISO_8601, true).isValid()) {
          return formatDate(data, 'mm/dd/yy HH:mm', 'en-US');
        }
        return cell[column].toString();
      } else {
        const cellDescription = data.description || data.name || data.title || data.id || column;
        if (cellDescription === column ) {
          if (Array.isArray(data)) {
            return data.map((item: any) => item.roleName || item.description || item.name || item.title || item.id).join(', ');
          }
        }
        return cellDescription.toString() ?? 'emptyText';
      }
    } catch {
      return emptyText;
    }
  }

  setNewValue(event: any) {
    this.contextNewValue = event.target.value;
  }
}
