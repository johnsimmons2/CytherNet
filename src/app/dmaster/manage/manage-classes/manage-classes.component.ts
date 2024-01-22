import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { ApiResult } from "src/app/model/apiresult";
import { Class } from "src/app/model/class";
import { ClassService } from "src/app/services/class.service";
import { ModalComponent } from "src/app/shared/subtle-modal/modal/modal.component";

@Component({
    selector: 'app-manage-classes',
    templateUrl: './manage-classes.component.html',
    styleUrls: ['./manage-classes.component.scss']
})
export class ManageClassesComponent implements OnInit, AfterViewInit {

    xcolumns: string[] = ["id", "name", "description", "actions"];
    classes: Class[] = [];
    classesDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

    @ViewChild(MatTable) table!: MatTable<Class>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private classService: ClassService, private dialog: MatDialog, public router: Router) { }

    ngOnInit(): void {
        this.resetTable();
    }

    ngAfterViewInit(): void {
        this.classesDataSource.paginator = this.paginator;
    }

    public updateDescription(event: any, featId: number): void {
        if (event !== undefined) {
            const clazz = this.classes.find(x => x.id === featId);
            clazz!.description = event as string;

            this.classService.update(clazz!).subscribe((res: ApiResult) => {
                if (res.success) {
                    this.resetTable();
                }
            });
        }
    }

    public resetTable(): void {
        this.classService.getClasses().subscribe((classes: Class[]) => {
            this.classes = classes;
            this.classes.sort((a, b) => a.name.localeCompare(b.name));
            this.classesDataSource.data = classes;
            this.table.renderRows();
        });
    }

    public confirmDelete(event: any): void {
        const modalRef = this.dialog.open(ModalComponent, {
            data: {
                title: "Delete?",
                cancel: true,
            }
        });

        modalRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.deleteClass(event);
                this.resetTable();
            }
        });
    }

    public deleteClass(classId: number): void {
        this.classService.delete(classId).subscribe((res: any) => {
            if (res.success) {
                this.resetTable();
            }
        });
    }

}