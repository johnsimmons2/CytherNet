import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CreateCharacterComponent } from "./create/create-character/create-character.component";
import { CreateUserComponent } from "./create/create-user/create-user.component";
import { ManageCharactersComponent } from "./manage/manage-characters/manage-characters.component";
import { ManageClassesComponent } from "./manage/manage-classes/manage-classes.component";
import { ManageRacesComponent } from "./manage/manage-races/manage-races.component";
import { ManageUsersComponent } from "./manage/manage-users/manage-users.component";
import { DungeonMasterComponent } from "./dmaster.component";
import { AppMaterialsModule } from "../app-materials.module";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { CreateRaceComponent } from "./create/create-race/create-race.component";
import { ManageFeatComponent } from "./manage/manage-feat/manage-feat.component";
import { CreateFeatComponent } from "./create/create-feat/create-feat.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        
        AppMaterialsModule,
        SharedModule
    ],
    declarations: [
        CreateCharacterComponent,
        CreateUserComponent,
        CreateRaceComponent,
        CreateFeatComponent,
        ManageCharactersComponent,
        ManageClassesComponent,
        ManageRacesComponent,
        ManageUsersComponent,
        ManageFeatComponent,
        DungeonMasterComponent,
    ],
    exports: [
        CreateCharacterComponent,
        CreateUserComponent,
        CreateRaceComponent,
        CreateFeatComponent,
        ManageCharactersComponent,
        ManageClassesComponent,
        ManageRacesComponent,
        ManageUsersComponent,
        ManageFeatComponent,
        DungeonMasterComponent,
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DmasterModule {

}