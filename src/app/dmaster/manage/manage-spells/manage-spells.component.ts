import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatTable } from "@angular/material/table";
import { Router } from "@angular/router";
import { Spell } from "src/app/model/spell";
import { SpellService } from "src/app/services/spell.service";

@Component({
  selector: "manage-spells-app",
  templateUrl: "./manage-spells.component.html",
})
export class ManageSpellsComponent implements AfterViewInit {
  spells: Spell[] = [];
  spellsColumns: string[] = ['id', 'name', 'level', 'components', 'castingTime', 'types', 'actions'];

  @ViewChild(MatTable) table!: MatTable<Spell>;

  constructor(private spellService: SpellService, public router: Router) {
  }

  ngAfterViewInit(): void {
    this.spellService.spells$.subscribe((spells: Spell[]) => {
      this.spells = spells.sort((a, b) => a.id - b.id);
    });
  }
}
