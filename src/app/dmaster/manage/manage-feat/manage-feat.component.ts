import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Feat } from "src/app/model/feat";
import { FeatService } from "src/app/services/feat.service";

@Component({
    selector: 'app-manage-feat',
    templateUrl: './manage-feat.component.html',
    styleUrls: ['./manage-feat.component.scss']
})
export class ManageFeatComponent implements OnInit, AfterViewInit {

    xcolumns: string[] = ["id", "name", "description", "actions"];
    feats: Feat[] = []
    featDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

    @ViewChild(MatTable) table!: MatTable<Feat>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private featService: FeatService, public router: Router) {
    }

    ngAfterViewInit(): void {
        this.featDataSource.paginator = this.paginator;
    }

    ngOnInit(): void {
        this.resetTable();
    }

    public applyFilter(event: any): void {
        if (event.target.value !== '') {
            this.featDataSource.filter = event.target.value.trim().toLowerCase();
        } else {
            this.featDataSource.filter = '';
        }
    }

    public updateDescription(event: any, featId: number): void {
        if (event !== undefined) {
            const feat = this.feats.find(x => x.id === featId);
            feat!.description = event as string;

            this.updateTable(feat!);
        }
    }

    public deleteFeat(featId: number): void {
        this.featService.delete(featId).subscribe((res: any) => {
            if (res.success) {
                this.resetTable();
            }
        });
    }

    public resetTable(): void {
        this.featService.getFeats().subscribe((res: any) => {
            if (res.success) {
                this.feats = [];
                this.featDataSource.data = [];

                res.data.forEach((feat: any) => {
                    this.feats.push({
                        id: feat.id,
                        description: feat.description,
                        name: feat.name,
                    });
                });
                this.feats = this.feats.sort((a: any, b: any) => {
                    return a.id - b.id;
                });
                this.featDataSource.data = this.feats;
                this.table.renderRows();
            }
        });
    }

    private updateTable(feat: Feat): void {
        this.featService.updateFeat(feat).subscribe((res: any) => {
            if (res.success) {
                this.resetTable();
            }
        });
    }

}