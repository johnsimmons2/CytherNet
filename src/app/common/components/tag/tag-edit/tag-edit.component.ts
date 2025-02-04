import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { PopoverController, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonChip, IonCol, IonGrid, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonPopover, IonRow, IonSelect, IonSelectOption, IonTitle } from "@ionic/angular/standalone";
import { Tag } from "src/app/common/model/tag";
import { NoteService } from "src/app/common/services/note.service";
import { ColorSketchModule } from "ngx-color/sketch";
import { UserSelectComponent } from "../../userSelect/user-select..component";
import { User } from "src/app/common/model/user";
import { UserService } from "src/app/common/services/user.service";
import { ApiResult } from "src/app/common/model/apiresult";

@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonItem,
    IonItemDivider,
    IonList,
    IonCheckbox,
    IonButton,
    IonInput,
    IonLabel,
    IonIcon,
    IonTitle,
    IonChip,
    IonPopover,
    IonGrid,
    IonRow,
    IonCol,
    IonSelect,
    IonSelectOption,
    ColorSketchModule,
    UserSelectComponent
  ],
  styles: [`
  `]
})
export class TagEditPopover implements OnInit {
  @Input() tag!: Tag;
  @Input() canEdit!: boolean;

  iconPopOpen: boolean = false;
  showIconList = false;

  tagColor: string = '#000000';
  tagIcon: string = '';
  tagIconOptions?: { name: string, value: string }[];
  tagSharedUsers: User[] = [];

  constructor(private noteService: NoteService, private userService: UserService, private popover: PopoverController) {
  }

  ngOnInit(): void {
    this.tagColor = '#' + this.tag.color || '#000000';
    this.tagIcon = this.tag.icon || '';
    this.noteService.getAllTagIcons().subscribe(icons => {
      console.log(icons);
      this.tagIconOptions = icons.map((icon: any) => ({ name: icon, value: icon }));
    });

    if (this.tag) {
      console.log(this.tag, this.tag.id!.toString());
      // data == list of user ids
      this.noteService.getTagShareStatus(this.tag.id!.toString()).subscribe(status => {
        if (status.success) {
          status.data.forEach((shareTag: any) => {
            this.userService.getUser(shareTag.sharedWithId).subscribe(user => {
              this.tagSharedUsers.push(user);
            });
          });
        }
      });
    }
  }

  iconNameWithDash(iconName: string) {
    return iconName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  iconNameWithSpaces(iconName: string) {
    const name = iconName.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
    return name.replace(/outline/g, '');
  }

  colorChange(color: any) {
    this.tagColor = color;
  }

  toggleTagSelection(event: any, tag: any) {
    event.stopPropagation();
    this.tagIcon = tag.name;
  }

  isIconSelected(icon: string) {
    return this.tagIcon === icon;
  }

  finishEdits() {
    this.popover.dismiss({
      color: this.tagColor,
      name: this.tag.name,
      icon: this.tagIcon
    });
  }

  toggleIconPicker() {
    this.showIconList = !this.showIconList;
  }

  cancel() {
    this.popover.dismiss();
  }

  shareTagWithUser(user: User) {
    this.noteService.shareTag(this.tag, [user]).subscribe((res: ApiResult) => {
      console.log(res);
    });
  }

  unshareTagWithUser(user: User) {
    this.noteService.unShareTag(this.tag, [user]).subscribe((res: ApiResult) => {
      console.log(res);
    });
  }

}
