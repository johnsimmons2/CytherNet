import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CreateCharacterComponent } from "./create-character/create-character.component";
import { CreateUserComponent } from "./create-user/create-user.component";
import { ManageCharactersComponent } from "./manage-characters/manage-characters.component";
import { ManageClassesComponent } from "./manage-classes/manage-classes.component";
import { ManageRacesComponent } from "./manage-races/manage-races.component";
import { ManageUsersComponent } from "./manage-users/manage-users.component";
import { DungeonMasterComponent } from "./dmaster.component";
import { AppMaterialsModule } from "../app-materials.module";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from "@angular/common/http";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { SharedModule } from "../shared/shared.module";
import { MatIconRegistry } from "@angular/material/icon";
import { HttpInterceptorImplementation } from "../shared/http-interceptor/http-interceptor";
import { ManageSpellsComponent } from "./manage-spells/manage-spells.component";

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        AppMaterialsModule,
        SharedModule
    ],
    declarations: [
        CreateCharacterComponent,
        CreateUserComponent,
        ManageCharactersComponent,
        ManageClassesComponent,
        ManageRacesComponent,
        ManageUsersComponent,
        ManageSpellsComponent,
        DungeonMasterComponent
    ],
    exports: [
        CreateCharacterComponent,
        CreateUserComponent,
        ManageCharactersComponent,
        ManageClassesComponent,
        ManageRacesComponent,
        ManageUsersComponent,
        DungeonMasterComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptorImplementation,
            multi: true
        },
        MatIconRegistry,
        HttpClient
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DmasterModule {

}
