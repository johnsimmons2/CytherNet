import { AfterViewInit, Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatTable } from "@angular/material/table";
import { Character } from "src/app/model/character";
import { User } from "src/app/model/user";

@Component({
  selector: 'character-table',
  templateUrl: './character-table.component.html',
})
export class CharacterTableComponent implements OnInit, AfterViewInit {

    @Input() userId!: string;
    @Input() dataSource: Character[] = [];

    @ViewChild(MatTable) table!: MatTable<Character>;

    xcolumns: string[] = ['name', 'race', 'class', 'level', 'health', 'actions'];

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
      this.table.renderRows();
    }

}
