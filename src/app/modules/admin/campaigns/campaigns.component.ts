import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonCol, IonContent, IonDatetime, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonRouterLink, IonRow, IonSelect, IonSelectOption, IonText, IonTextarea } from "@ionic/angular/standalone";
import { User, UserDto } from "src/app/common/model/user";
import { UserService } from "src/app/common/services/user.service";
import { TableComponent } from "src/app/common/components/table/table.component";
import { TableActon } from "src/app/common/components/table/table.actions";
import { of, tap } from "rxjs";
import { Campaign } from "src/app/common/model/campaign";
import { CampaignService } from "src/app/common/services/campaign.service";
import { TableColumn } from "src/app/common/components/table/table.column";
import { ApiResult } from "src/app/common/model/apiresult";
import { ToastService } from "src/app/common/services/toast.service";
import { addCircleOutline } from "ionicons/icons";
import { addIcons } from "ionicons";
import { RouterModule } from "@angular/router";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";


@Component({
  selector: 'app-users',
  templateUrl: './campaigns.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonTextarea,
    IonInput,
    IonModal,
    IonLabel,
    IonCheckbox,
    IonItem,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonText,
    IonSelectOption,
    IonSelect,
    TableComponent
  ]
})
export class CampaignsComponent implements OnInit {

  newCampaignForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    active: new FormControl(true, []),
  });
  userToCampaignForm = new FormGroup({
    userId: new FormControl('', [Validators.required]),
    campaignId: new FormControl('', [Validators.required]),
  });
  characterToCampaignForm = new FormGroup({
    characterId: new FormControl('', [Validators.required]),
    campaignId: new FormControl('', [Validators.required]),
  });
  campaigns: Campaign[] = [];
  users: User[] = [];
  cols: TableColumn[] = [
    {
      name: 'id'
    },
    {
      name: 'description'
    },
    {
      name: 'created'
    },
    {
      name: 'updated'
    },
    {
      name: 'active'
    },
    {
      name: 'characters',
      canEdit: (index) => false
    },
    {
      name: 'users',
      canEdit: (index) => false
    }
  ]

  @ViewChild('addCampaignModal') addCampaignModal!: IonModal;
  @ViewChild('addUserToCampaignModal') addUserToCampaignModal!: IonModal;
  @ViewChild('addCharacterToCampaignModal') addCharacterToCampaignModal!: IonModal;

  constructor(private campaignService: CampaignService, private toastService: ToastService, private userService: UserService) {
    addIcons({addCircleOutline});
  }

  get rightNow() {
    return new Date().toISOString();
  }

  getTableActions(): TableActon[] {
    return [
      {
        label: 'Delete',
        disabled: () => false,
        color: 'secondary',
        action: (index) => this.deleteCampaign(index)
      }
    ];
  }

  ngOnInit() {
    this.campaignService.getCampaigns().pipe(
      tap((res: ApiResult) => {
        if (res.success) {
          this.campaigns = res.data as Campaign[];
        } else {
          this.toastService.show({
            message: res.message ?? 'Failed to load campaigns',
            type: 'warning'
          });
        }
      })
    ).subscribe();

    this.userService.getUsers().pipe(
      tap((res: ApiResult) => {
        if (res.success) {
          this.users = res.data as User[];
        } else {
        }
      })
    ).subscribe();
  }

  editCampaign(index: number) {
    console.log(index);
  }

  addCampaign() {
    const campaign: Campaign = {
      description: this.newCampaignForm.value.description!,
      name: this.newCampaignForm.value.name!,
      created: new Date(),
      updated: new Date(),
      active: this.newCampaignForm.value.active ?? true,
      characters: [],
      users: []
    };

    this.campaignService.createCampaign(campaign).pipe(
      tap((res: ApiResult) => {
        if (res.success) {
          this.campaigns.push(res.data as Campaign);
          this.addCampaignModal.dismiss(null, 'saved');
          this.toastService.show({
            message: res.message ?? 'Created',
            type: 'success'
          });
        } else {
          this.toastService.show({
            message: res.message ?? 'Failed to create campaign',
            type: 'warning'
          });
        }
      })
    ).subscribe();
  }

  addUserToCampaign() {
    const id = +this.userToCampaignForm.value.campaignId!;
    this.campaignService.updateCampaignUsers(id, [+this.userToCampaignForm.value.userId!]).pipe(
      tap((res: ApiResult) => {
        if (res.success) {
          this.addUserToCampaignModal.dismiss();
          this.toastService.show({
            message: 'User added to campaign',
            type: 'success'
          });
        }
      })
    ).subscribe();
  }

  addCharacterToCampaign() {

  }

  closeAddUserToCampaign() {
    this.addUserToCampaignModal.dismiss();
  }

  closeAddCharacterToCampaign() {
    this.addCharacterToCampaignModal.dismiss();
  }

  closeNewCampaign() {
    this.addCampaignModal.dismiss();
  }

  deleteCampaign(index: number) {
    const campaign = this.campaigns[index].id!;

    this.campaignService.deleteCampaign(campaign).subscribe(() => {
      this.campaigns = this.campaigns.filter(u => u.id !== campaign);
    });
  }
}
