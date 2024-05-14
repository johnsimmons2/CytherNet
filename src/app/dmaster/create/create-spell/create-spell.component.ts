import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Feat } from "src/app/model/feat";
import { Location as loc } from '@angular/common';
import { SpellService } from "src/app/services/spell.service";
import { ApiResult } from "src/app/model/apiresult";
import { Spell } from "src/app/model/spell";


@Component({
    selector: 'app-create-spell',
    templateUrl: './create-spell.component.html'
})
export class CreateSpellComponent implements OnInit {

  spellId: number = -1;
  isEditMode: boolean = false;

  spellForm: FormGroup;
  spellComponentsForm: FormGroup;
  feats: Feat[] = [];

  constructor(
      public route: ActivatedRoute,
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
      schoolForm: this.formBuilder.control('', [Validators.required]),

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

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      console.log(params);
      if (params.get('id')) {
        this.spellId = parseInt(params.get('id')!);
        this.loadSpell();
      }
    });
  }

  submit(): void {
    if (this.isEditMode) {
      this.spellService.update(this.spellId, this.getFormAsSpell()).subscribe((x: ApiResult) => {
        if (x.success) {
          this.router.navigate(['dmaster/spells']);
        }
      });
    } else {
      this.spellService.create(this.getFormAsSpell()).subscribe((x: ApiResult) => {
        if (x.success) {
          this.router.navigate(['dmaster/spells']);
        }
      });
    }

  }

  public getFormAsSpell(): Spell {
    return {
      id: this.spellId,
      name: this.spellForm.get('nameForm')?.value,
      level: this.spellForm.get('levelForm')?.value,
      castingTime: this.spellForm.get('castingTimeForm')?.value,
      duration: this.spellForm.get('durationForm')?.value,
      range: this.spellForm.get('rangeForm')?.value,
      description: this.spellForm.get('descriptionForm')?.value,
      school: this.spellForm.get('schoolForm')?.value,

      ritual: this.spellForm.get('ritualForm')?.value,
      concentration: this.spellForm.get('concentrationForm')?.value,
      somatic: this.spellForm.get('somaticForm')?.value,
      verbal: this.spellForm.get('verbalForm')?.value,
      material: this.spellForm.get('materialForm')?.value,
      components: {
        spellId: this.spellId,
        itemId: this.spellComponentsForm.get('itemIdForm')?.value,
        quantity: this.spellComponentsForm.get('quantityForm')?.value,
        goldValue: this.spellComponentsForm.get('goldValueForm')?.value
      }
    };
  }

  public loadSpell(): void {
    this.spellService.get(this.spellId).subscribe((x: ApiResult) => {
      if (x.success) {
        this.isEditMode = true;

        this.spellForm.setValue({
          nameForm: x.data.name,
          levelForm: x.data.level,
          castingTimeForm: x.data.castingTime,
          durationForm: x.data.duration,
          rangeForm: x.data.range,
          descriptionForm: x.data.description,
          schoolForm: x.data.school,

          ritualForm: x.data.ritual,
          concentrationForm: x.data.concentration,
          somaticForm: x.data.somatic,
          verbalForm: x.data.verbal,
          materialForm: x.data.material
        });

        if (x.data.material) {
          this.spellComponentsForm.setValue({
            itemIdForm: x.data.components.itemId,
            quantityForm: x.data.components.quantity,
            goldValueForm: x.data.components.goldValue
          });
        }
      }
    });
  }
}
