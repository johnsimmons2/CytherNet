import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-filterable-select',
    templateUrl: './filterable-select.component.html',
})
export class FilterableSelectComponent implements OnInit, OnChanges {
    
    @Input() label: string = '';
    @Input() multiple: boolean = false;
    @Input() routeTo: string = '';
    @Input() disabled: boolean = false;
    
    @Input() dataSource!: any[];
    filteredDataSource: any[] = [];

    @Input() selections: number[] = [];
    @Output() selectionsChange: EventEmitter<any[]> = new EventEmitter<any[]>();

    constructor(public router: Router, private cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.filteredDataSource = this.dataSource;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['dataSource'] !== undefined) {
            this.dataSource = changes['dataSource'].currentValue;
            this.filteredDataSource = changes['dataSource'].currentValue;
        }
        this.cdr.detectChanges();
    }

    search(event: any) {
        if (this.dataSource === undefined) {
            return;
        }
        if (event.target.value === '') {
            this.filteredDataSource = this.dataSource;
            return;
        }
        this.filteredDataSource = this.dataSource.filter(x => x.name.toLowerCase().includes(event.target.value.toLowerCase()));
    }

    inFilter(id: number): boolean {
        if (this.dataSource === undefined) {
            return false;
        }
        return this.filteredDataSource.find(x => x.id === id) !== undefined;
    }

    selectionChange(event: any) {
        this.selectionsChange.emit(event.value);
    }

    clearSelection(): void {
        this.selections = [];
        this.search({ target: { value: '' } })
        this.selectionsChange.emit([]);
    }
}