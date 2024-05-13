import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { from, map } from "rxjs";
import { ApiResult } from "src/app/model/apiresult";
import { Class } from "src/app/model/class";
import { ClassService } from "src/app/services/class.service";
import { StatsService } from "src/app/services/stats.service";

@Component({
    selector: 'create-class-app',
    templateUrl: './create-class.component.html',
})
export class CreateClassComponent implements OnInit {

  classForm: FormGroup;
  subclassForm: FormGroup;

  spellcaster: boolean = false;
  spellcastingAbility: string = '';

  subclasses: Class[] = [];
  selectedClass: number = 0;
  classes: Class[] = [];
  stats: any[] = [];

  constructor(private classService: ClassService,
              private statService: StatsService,
              private formBuilder: FormBuilder,
              public location: Location) {
    this.classForm = new FormGroup({
      nameForm: this.formBuilder.control('', [Validators.required]),
      descriptionForm: this.formBuilder.control('', [Validators.required]),
      subclassesForm: this.formBuilder.control({}),
      subclassNameForm: this.formBuilder.control(''),
      subclassDescForm: this.formBuilder.control('')
    });
    this.subclassForm = new FormGroup({
      subSelectedClassForm: this.formBuilder.control(0, [Validators.required]),
      subNameForm: this.formBuilder.control('', [Validators.required]),
      subDescForm: this.formBuilder.control('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.classService.classes$.subscribe((classes: Class[]) => {
      this.classes = classes;
      this.classes.sort((a, b) => a.name.localeCompare(b.name));
    });
    this.stats = this.statService.statDescriptions;
  }

  public selectClass(event: any): void {
    this.selectedClass = event;
  }

  public removeSubclass(subclass: Class): void {
    const index = this.subclasses.indexOf(subclass);
    if (index > -1) {
      this.subclasses.splice(index, 1);
    }

    this.classForm.controls['subclassesForm'].setValue(this.subclasses);
  }

  public addSubclass(): void {
    const subclassName = this.classForm.controls['subclassNameForm'].value;
    const subclassDesc = this.classForm.controls['subclassDescForm'].value;

    if (subclassName !== '' && subclassDesc !== '') {
      this.subclasses.push({
          name: subclassName,
          description: subclassDesc
      });

      this.classForm.controls['subclassesForm'].setValue(this.subclasses);
      this.classForm.controls['subclassNameForm'].setValue('');
      this.classForm.controls['subclassDescForm'].setValue('');
    } else {
      this.classForm.controls['subclassNameForm'].setErrors({ 'incorrect': true });
    }
  }

  public setSelectedClass(event: any): void {
      console.log(event);
  }

  submit() {
    if (this.classForm.valid) {
      const clazz: Class = {
        name: this.classForm.controls['nameForm'].value,
        description: this.classForm.controls['descriptionForm'].value,
        spellCastingAbility: this.spellcastingAbility,
      };

      this.classService.create(clazz).subscribe((classRes: ApiResult) => {
        if (classRes.success) {
          const classId = classRes.data.id;

          if (this.subclasses.length > 0) {
            this.classService.createSubclasses(classId, this.subclasses).subscribe();
          }
          this.location.back();
        }
      });
    }
  }

  submitSubclass() {
    console.log(this.selectedClass);
    console.log(this.subclassForm);

    if (this.subclassForm.valid) {
      const subclass: Class = {
        name: this.subclassForm.controls['subNameForm'].value,
        description: this.subclassForm.controls['subDescForm'].value,
      };
      const classId = this.subclassForm.controls['subSelectedClassForm'].value;

      this.classService.createSubclasses(classId, [subclass]).subscribe((res: ApiResult) => {
        if (res.success) {
            this.location.back();
        }
      });
    }
  }

}
