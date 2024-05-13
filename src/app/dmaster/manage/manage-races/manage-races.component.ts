import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTable } from "@angular/material/table";
import { Router } from "@angular/router";
import { lastValueFrom } from "rxjs";
import { ApiResult } from "src/app/model/apiresult";
import { Feat } from "src/app/model/feat";
import { Race } from "src/app/model/race";
import { FeatService } from "src/app/services/feat.service";
import { RaceService } from "src/app/services/race.service";
import { ModalComponent } from "src/app/shared/subtle-modal/modal/modal.component";


@Component({
    selector: 'app-manage-races',
    templateUrl: './manage-races.component.html',
    styleUrls: ['./manage-races.component.scss']
})
export class ManageRacesComponent implements AfterViewInit {
  races: Race[] = [];
  feats: Feat[] = [];
  racesColumns: string[] = ['id', 'name', 'description', 'size', 'alignment', 'languages', 'feats', 'actions'];

  sizes: string[] = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan', 'Colossal'];
  previousNames: { [key: string]: string } = {};
  previousSizes: { [key: string]: string } = {};

  @ViewChild(MatTable) table!: MatTable<Race>;
  @ViewChild('featmodal') featModalTemplate!: TemplateRef<any>;

  constructor(private raceService: RaceService,
    private featService: FeatService,
    public dialog: MatDialog,
    public router: Router) {
  }

  public getFeatName(featId: number): string {
    return this.feats.find(x => x.id === featId)?.name ?? '';
  }

  public async openFeatModal(id: number, name: string): Promise<void> {
    const feats: Feat[] = await lastValueFrom(this.featService.getRacialFeatsFor(id));
    const featIds: number[] = feats.map(x => x.id!);

    const modalRef = this.dialog.open(this.featModalTemplate, {
      width: '800px',
      data: {
        id: id,
        name: name,
        description: name,
        currentFeatIds: featIds,
        allFeats: this.feats
      }
    });

    modalRef.afterClosed().subscribe((result: any) => {
      if (result !== undefined) {
        const race = this.races.find(x => x.id === id);
        race!.featIds = result as number[];

        this.updateTableIfSucceeded(true, race!);
      }
    });
  }

  public confirmNameChange(event: any, raceId: number): void {
    const first = this.previousNames[raceId];
    const confirmationText = `Change the name of the race from <b>${first}</b> to <b>${event.target.value}</b>?`;

    const modalRef = this.dialog.open(ModalComponent, {
      data: {
        title: "Confirm Changes?",
        cancel: true,
        content: confirmationText
      }
    });

    modalRef.afterClosed().subscribe((result: any) => {
      const race = this.races.find(x => x.id === raceId);

      this.updateTableIfSucceeded(result, race!);
    });
  }

  public confirmSizeChange(event: any, name: string): void {
    const confirmationText = `Change the size of ${name} to <b>${event.value}</b>?`;
    const race = this.races.find(x => x.name === name);

    const modalRef = this.dialog.open(ModalComponent, {
      data: {
        title: "Confirm Changes?",
        cancel: true,
        content: confirmationText
      }
    });

    modalRef.afterClosed().subscribe((result: any) => {
      this.updateTableIfSucceeded(result, race!);
    });
  }

  public updateRaceDesc(event: string | undefined, raceId: number): void {
    if (event !== undefined) {
      const race = this.races.find(x => x.id === raceId);
      race!.description = event as string;

      this.updateTableIfSucceeded(true, race!);
    }
  }

  public updateTableIfSucceeded(result: boolean | undefined, race: Race): void {;
    if (result && result === true) {
      this.raceService.updateRace(race).subscribe((res: ApiResult) => {
        if (!res.success) {
          console.error(res.data);
        }
      });
    } else {
      this.resetTable();
    }
  }

  public updateAlignment(event: any, raceId: number): void {
    if (event !== undefined) {
      const race = this.races.find(x => x.id === raceId);
      race!.alignment = event as string;

      this.updateTableIfSucceeded(true, race!);
    }
  }

  public updateRacialFeats(event: any, raceId: number): void {
    if (event !== undefined) {
      const race = this.races.find(x => x.id === raceId);
      race!.featIds = event as number[];

      this.updateTableIfSucceeded(true, race!)
    }
  }

  public updateLanguages(event: any, raceId: number): void {
    if (event !== undefined) {
      const race = this.races.find(x => x.id === raceId);
      race!.languages = event as string;

      this.updateTableIfSucceeded(true, race!);
    }
  }

  public deselectFeat(featId: number, allFeats: Feat[]): Feat[] {
    // Find the index of the featId in the array
    const index = allFeats.findIndex(x => x.id === featId);
    console.log(featId);
    // If the featId is found, remove it from the array
    if (index !== -1) {
      return allFeats.splice(index, 1);
    }

    return allFeats;
  }

  deleteRow(raceId: number, rowName: string): void {
    const modalRef = this.dialog.open(ModalComponent, {
      data: {
          title: "Delete?",
          cancel: true,
          content: `Are you sure you want to delete ${rowName}?`
      }
    });

    modalRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.raceService.delete(raceId).subscribe((res: ApiResult) => {
          if (res.success) {
              this.getInitialRaces();
              this.resetTable();
          }
        });
      }
    });
  }

  resetTable(): void {
    this.races = this.races.sort((a: any, b: any) => {
      return a.id - b.id;
    });
    this.feats.sort((a: any, b: any) => a.name.localeCompare(b.name));
    this.races.forEach((x: any) => {
      x.size = this.previousSizes[x.name];
      x.name = this.previousNames[x.id];
    });
    this.table.renderRows();
  }

  getInitialRaces(): void {
    this.raceService.races$.subscribe((races: Race[]) => this.races = races);
    this.featService.getFeats().subscribe((feats: Feat[]) => this.feats = feats);

    this.races.forEach((x: any) => {
      this.previousSizes[x.name] = x.size;
      this.previousNames[x.id] = x.name;
    });
    this.resetTable();
  }

  ngAfterViewInit(): void {
    this.getInitialRaces();
  }
}
