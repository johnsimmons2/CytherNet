import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, EventEmitter, forwardRef, Input, Output } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { IonButton, IonIcon, IonInput, IonItem } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { createOutline, checkboxOutline, closeCircleOutline } from 'ionicons/icons';


@Component({
  selector: 'app-editable-field',
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonInput,
    IonIcon
  ],
  template: `
  <span style="display: flex; align-items: center; gap: 0.5rem;">
    <ion-input [placeholder]="actualValue" type="text" [value]="actualValue" (ionChange)="onChange($event)" [disabled]="!isEditing">
    </ion-input>
    <ion-button *ngIf="!isEditing" fill="clear" slot="end" (click)="editMode()" enabled="true">
      <ion-icon slot="icon-only" name="create-outline" size="large"></ion-icon>
    </ion-button>
    <ion-button *ngIf="isEditing" fill="clear" slot="end" (click)="submit()">
      <ion-icon slot="icon-only" name="checkbox-outline" size="large"></ion-icon>
    </ion-button>
    <ion-button *ngIf="isEditing" fill="clear" slot="end" (click)="cancel()">
      <ion-icon slot="icon-only" name="close-circle-outline" size="large"></ion-icon>
    </ion-button>
</span>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableFieldComponent),
      multi: true
    }
  ]
})
export class EditableFieldComponent implements ControlValueAccessor {

  @Input() set value(value: string) {
    this.initialValue = value;
    this.actualValue = value;
  };
  @Input() field: string = '';

  @Output() valueChange = new EventEmitter<any>();

  initialValue: string = '';
  actualValue: string = '';
  isEditing: boolean = false;
  isDisabled: boolean = false;

  private onChangeFn: (_: any) => void = () => {};
  private onTouchedFn: () => void = () => {};

  constructor() {
    addIcons({ createOutline, checkboxOutline, closeCircleOutline });
  }

  writeValue(obj: any): void {
    this.value = obj || '';
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChange(event: any) {
    this.actualValue = event.target.value;
    this.onChangeFn(this.actualValue);
  }

  editMode() {
    this.isEditing = true;
  }

  cancel() {
    this.value = this.initialValue;
    this.submit();
  }

  submit() {
    this.isEditing = false;
    this.valueChange.emit({
      value: this.actualValue,
      initial: this.initialValue,
      field: this.field,
      change: this.actualValue !== this.initialValue
    });
  }
}
