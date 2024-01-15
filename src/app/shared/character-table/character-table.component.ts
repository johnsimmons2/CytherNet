import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { MatTable } from "@angular/material/table";
import { Character } from "src/app/model/character";
import { User } from "src/app/model/user";

@Component({
  selector: 'character-table',
  templateUrl: './character-table.component.html',
})
export class CharacterTableComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() userId!: string;
    @Input() dataSource: Character[] = [];

    @ViewChild(MatTable) table: MatTable<Character> | undefined;

    //TODO: Hover on level shows xp, hover on stats shows a stat block
    xcolumns: string[] = ['name', 'race', 'class', 'level', 'stats', 'type', 'actions'];

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
      console.log(changes);
      if (changes['dataSource']) {
        this.dataSource = changes['dataSource'].currentValue;
      }
    }

    ngAfterViewInit() {
      if (this.table) {
        this.table.renderRows();
      }
    }

}
