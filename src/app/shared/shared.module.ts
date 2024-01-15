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
import { MatIconRegistry } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppMaterialsModule } from "../app-materials.module";
import { InputModalComponent } from "./input-modal/input-modal.component";
import { ModalInputComponent } from "./input-modal/modal-input/modal-input.component";


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
        ModalComponent,
        InputModalComponent,
        ModalInputComponent
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
        InputModalComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedModule {}