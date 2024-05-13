import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiResult } from "src/app/model/apiresult";
import { Feat } from "src/app/model/feat";
import { Race } from "src/app/model/race";
import { FeatService } from "src/app/services/feat.service";
import { RaceService } from "src/app/services/race.service";
import { Location as loc } from '@angular/common';
import { SpellService } from "src/app/services/spell.service";


@Component({
    selector: 'app-create-spell',
    templateUrl: './create-spell.component.html'
})
export class CreateSpellComponent {

  spellForm: FormGroup;
  spellComponentsForm: FormGroup;
  feats: Feat[] = [];

  constructor(
        public router: Router,
        public location: loc,
        private formBuilder: FormBuilder,
        private spellService: SpellService) {

    this.spellForm = this.formBuilder.group({
        nameForm: this.formBuilder.control('', [Validators.required]),
        levelForm: this.formBuilder.control(0, [Validators.required]),
        castingTimeForm: this.formBuilder.control('', [Validators.required]),
        durationForm: this.formBuilder.control('', [Validators.required]),
        rangeForm: this.formBuilder.control('', [Validators.required]),
        descriptionForm: this.formBuilder.control('', [Validators.required]),
        ritualForm: this.formBuilder.control(false),
        concentrationForm: this.formBuilder.control(false),
        somaticForm: this.formBuilder.control(false),
        verbalForm: this.formBuilder.control(false),
        materialForm: this.formBuilder.control(false)
    });

    this.spellComponentsForm = this.formBuilder.group({
      itemIdForm: this.formBuilder.control(0, []),
      quantityForm: this.formBuilder.control(0, []),
      goldValueForm: this.formBuilder.control(0, [])
    });
  }

  submit(): void {

  }
}
