import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-filterable-select',
    templateUrl: './filterable-select.component.html',
})
export class FilterableSelectComponent implements OnInit {
    
    @Input() label: string = '';
    @Input() multiple: boolean = false;
    @Input() routeTo: string = '';
    
    @Input() dataSource!: any[];
    filteredDataSource: any[] = [];

    selections: any[] = [];

    @Output() selected: EventEmitter<any[]> = new EventEmitter<any[]>();

    constructor(public router: Router) {
    }

    ngOnInit(): void {
        this.filteredDataSource = this.dataSource;
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
        this.selected.emit(event.value);
    }

    clearSelection(): void {
        this.selections = [];
        this.search({ target: { value: '' } })
        this.selected.emit([]);
    }
}