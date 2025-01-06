import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonRouterLink, IonText } from '@ionic/angular/standalone';
import { TableActon } from 'src/app/common/components/table/table.actions';
import { TableColumn } from 'src/app/common/components/table/table.column';
import { TableComponent } from 'src/app/common/components/table/table.component';
import { Note } from 'src/app/common/model/note';
import { NoteService } from 'src/app/common/services/note.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    IonRouterLink,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonText,
    TableComponent
  ]
})
export class NotesComponent  implements OnInit {

  notes: Note[] = [];
  cols: TableColumn[] = [
    {
      name: 'name',
    },
    {
      name: 'description',
    }
  ]

  constructor(private noteService: NoteService) { }

  ngOnInit() {
    this.noteService.notes$.subscribe(notes => {
      this.notes = notes;
    });
  }

  saveChanges(event: any) {
    console.log('Save Changes', event);
  }

  getTableActions(): TableActon[] {
    return [
      {
        label: 'Edit',
        disabled: ((note: Note) => false),
        color: 'secondary',
        action: (note: Note) => {
          console.log('Edit', note);
        }
      },
      {
        label: 'Delete',
        disabled: ((note: Note) => false),
        color: 'primary',
        action: (note: Note) => {
          console.log('Edit', note);
        }
      }
    ];
  }

}
