import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { IonChip, IonIcon, IonLabel, PopoverController } from "@ionic/angular/standalone";
import { Tag } from "../../model/tag";
import { UserService } from "../../services/user.service";
import { TagEditPopover } from "./tag-edit/tag-edit.component";
import { IconImportService } from "../../services/iconimport.service";
import { NoteService } from "../../services/note.service";
import { User } from "../../model/user";


@Component({
    selector: 'app-tag',
    templateUrl: './tag.component.html',
    standalone: true,
    imports: [
        CommonModule,
        IonLabel,
        IonIcon,
        IonChip
    ],
    styles: [`
        :host {
        margin: 0 0.1rem 0.1rem 0;
        }

        :host ion-chip {
        border-color: rgba(var(--ion-text-color-rgb, 0, 0, 0), 1);
        margin: 0 0.1rem 0.1rem 0;
        }

        ::ng-deep .tag-edit-popover {
        --width: 600px;
        }
    `]
})
export class TagComponent implements OnInit {

    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() tag!: Tag;
    @Input() canEdit!: boolean;

    iconAdded = false;

    get isGlobalTag() {
        if (this.tag) {
            if (!this.tag.userId) {
                return true
            }
        }
        return false;
    }

    get ownsTag() { // TODO
        return false;
    }

    constructor(private userService: UserService,
        private noteService: NoteService,
        private popover: PopoverController
    ) {
    }

    async ngOnInit(): Promise<void> {
    }

    tagClicked(event: any) {
        if (event instanceof MouseEvent) {
            event.stopPropagation();
        }
        this.popover.create({
            component: TagEditPopover,
            size: 'cover',
            cssClass: 'tag-edit-popover',
            componentProps: {
                tag: this.tag,
                canEdit: this.ownsTag
            },
            backdropDismiss: true
        }).then((pop) => {
            pop.present();
            return pop.onDidDismiss();
        }).then(result => {
            if (result.data) {
                this.noteService.editTag(this.tag.id!, {
                    name: result.data.name,
                    color: result.data.color.replace('#', ''),
                    icon: result.data.icon
                }).subscribe(() => {
                    this.tag.color = result.data.color.replace('#', '');
                    this.tag.name = result.data.name;
                    this.tag.icon = result.data.icon;
                });
            }
        });
    }

    iconNameWithDash(iconName: string) {
        return iconName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }
}
