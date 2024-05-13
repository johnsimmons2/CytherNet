import { Component, ViewChild } from "@angular/core";
import { MatTable } from "@angular/material/table";
import { Spell } from "src/app/model/spell";
import { SpellService } from "src/app/services/spell.service";

@Component({
  selector: "manage-spells-app",
  templateUrl: "./manage-spells.component.html",
})
export class ManageSpellsComponent {
  spells: Spell[] = [];
  spellsColumns: string[] = ['id', 'name', 'level', 'components', 'castingTime', 'types', 'actions'];

  @ViewChild(MatTable) table!: MatTable<Spell>;

  constructor(private spellService: SpellService) {
  }
}
