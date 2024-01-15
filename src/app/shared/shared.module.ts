import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CharacterTableComponent } from "./character-table/character-table.component";
import { ConfirmationModal } from "./confirmation-modal/confirmation-modal.component";
import { DiceComponent } from "./dice-component/dice.component";
import { HealthComponent } from "./health-component/health.component";
import { HttpInterceptorImplementation } from "./http-interceptor/http-interceptor";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { SpellSlotComponent } from "./spell-slot/spell-slot.component";
import { StatsFormComponent } from "./stats-form-component/stats-form.component";
import { SubtleModalComponent } from "./subtle-modal/subtle-modal.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { HeaderButtonComponent } from "./toolbar/header-button/header-button.component";
import { ModalComponent } from "./subtle-modal/modal/modal.component";
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from "@angular/common/http";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatCommonModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "../app-routing.module";
import { AppMaterialsModule } from "../app-materials.module";


@NgModule({
    declarations: [
        CharacterTableComponent,
        ConfirmationModal,
        DiceComponent,
        HealthComponent,
        LoadingSpinnerComponent,
        SpellSlotComponent,
        StatsFormComponent,
        SubtleModalComponent,
        ToolbarComponent,
        HeaderButtonComponent,
        ModalComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        FlexLayoutModule,

        AppMaterialsModule
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
    exports: [
        CharacterTableComponent,
        ConfirmationModal,
        DiceComponent,
        HealthComponent,
        LoadingSpinnerComponent,
        SpellSlotComponent,
        StatsFormComponent,
        SubtleModalComponent,
        ToolbarComponent,
        HeaderButtonComponent,
        ModalComponent,
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedModule {}