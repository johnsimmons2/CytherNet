import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Router } from "@angular/router";
import { StatsFormComponent } from "../stats-form-component/stats-form.component";

@Component({
    selector: 'app-filterable-select',
    templateUrl: './filterable-select.component.html',
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => FilterableSelectComponent),
        multi: true
      }
    ]
})
export class FilterableSelectComponent implements ControlValueAccessor, OnChanges {

  onChange: any = () => { };
  onTouched: any = () => { };

  @Input() label: string = '';
  @Input() multiple: boolean = false;
  @Input() routeTo: string = '';
  @Input() disabled: boolean = false;

  @Input() dataSource!: any[];
  @Input() dataControl!: FormControl;

  selections: any[] = [];
  filteredDataSource: any[] = [];

  constructor(public router: Router) {
  }

  ngOnChanges(): void {
    this.filteredDataSource = this.dataSource.filter(x => x.name.toLowerCase());
    this.dataControl?.valueChanges.subscribe((value) => {
      this.updateChanges();
    });
  }

  writeValue(obj: any[]): void {
    this.selections = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  updateChanges() {
    this.onChange(this.selections);
  }

  search(event: any) {
    if (this.dataSource === undefined) {
      return;
    }

    if (event.target.value === '') {
      this.filteredDataSource = this.dataSource;
    } else {
      this.filteredDataSource = this.dataSource.filter(x => x.name.toLowerCase().includes(event.target.value.toLowerCase()));
    }
  }

  inFilter(id: number): boolean {
    if (this.dataSource === undefined) {
      return false;
    }
    return this.filteredDataSource.find(x => x.id === id) !== undefined;
  }

  clearSelection(): void {
    this.selections = [];
  }
}
