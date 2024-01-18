import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTable } from "@angular/material/table";
import { Router } from "@angular/router";
import { ApiResult } from "src/app/model/apiresult";
import { Race } from "src/app/model/race";
import { RaceService } from "src/app/services/race.service";
import { ModalComponent } from "src/app/shared/subtle-modal/modal/modal.component";


@Component({
    selector: 'app-manage-races',
    templateUrl: './manage-races.component.html',
    styleUrls: ['./manage-races.component.scss']
})
export class ManageRacesComponent implements AfterViewInit {
    races: Race[] = []
    racesColumns: string[] = ['id', 'name', 'description', 'size', 'alignment', 'languages', 'feats', 'actions']

    sizes: string[] = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
    previousNames: { [key: string]: string } = {};
    previousSizes: { [key: string]: string } = {};

    @ViewChild(MatTable) table!: MatTable<Race>;

    constructor(private raceService: RaceService, 
        public dialog: MatDialog,
        public router: Router) {
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
            console.log(event);
        }
    }

    public updateLanguages(event: any, raceId: number): void {
        if (event !== undefined) {
            const race = this.races.find(x => x.id === raceId);
            race!.languages = event as string; 

            this.updateTableIfSucceeded(true, race!);
        }
    }
    
    deleteRow(raceId: number): void {
        this.raceService.delete(raceId).subscribe((res: ApiResult) => {
            if (res.success) {
                this.getInitialRaces();
            }
        });
    }

    resetTable(): void {
        this.races = this.races.sort((a: any, b: any) => {
            return a.id - b.id;
        });
        this.races.forEach((x: any) => {
            x.size = this.previousSizes[x.name];
            x.name = this.previousNames[x.id];
        });
        this.table.renderRows();
    }

    getInitialRaces(): void {
        this.raceService.getRaces().subscribe((res: ApiResult) => {  
            if (res.success && res.data) {

                this.races = [];

                res.data.forEach((x: any) => {
                    this.races.push({
                        id: x.id,
                        name: x.name,
                        description: x.description,
                        size: x.size,
                        alignment: x.alignment,
                        languages: x.languages,
                        feats: (x.feats && x.feats.length) > 0 ? x.feats.map((y: any) => {
                            return {
                                id: y.id,
                                name: y.name,
                                description: y.description
                            }
                        }) : [],
                    })
                });

                this.races.forEach((x: any) => {
                    this.previousSizes[x.name] = x.size;
                    this.previousNames[x.id] = x.name;
                });
        
                this.resetTable();
            }
        });
    }

    ngAfterViewInit(): void {
        this.getInitialRaces();
    }
}