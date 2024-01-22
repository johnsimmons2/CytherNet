import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiResult } from "src/app/model/apiresult";
import { Feat } from "src/app/model/feat";
import { Race } from "src/app/model/race";
import { FeatService } from "src/app/services/feat.service";
import { RaceService } from "src/app/services/race.service";
import { Location as loc } from '@angular/common';


@Component({
    selector: 'app-create-race',
    templateUrl: './create-race.component.html'
})
export class CreateRaceComponent implements OnInit {

    sizes: string[] = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan', 'Colossal'];

    raceForm: FormGroup;
    feats: Feat[] = [];

    constructor(
            public router: Router,
            public location: loc,
            private formBuilder: FormBuilder, 
            private featService: FeatService,
            private raceService: RaceService) { 

        this.raceForm = this.formBuilder.group({
            nameForm: this.formBuilder.control('', [Validators.required]),
            descriptionForm: this.formBuilder.control('', [Validators.required]),
            sizeForm: this.formBuilder.control('', [Validators.required]),
            languagesForm: this.formBuilder.control('', [Validators.required]),
            alignmentForm: this.formBuilder.control('', [Validators.required]),
            featsForm: this.formBuilder.control([]),
        });
    }

    ngOnInit(): void {
        this.featService.getFeats().subscribe((feats: Feat[]) => {
            this.feats = feats
            this.feats.sort((a, b) => a.name.localeCompare(b.name));
        });
    }

    updateFeatSelection(selection: any) {
        console.log(selection);
        if (selection !== undefined && selection instanceof Array) {
            console.log(selection);
            this.raceForm.controls['featsForm'].setValue(selection);
        }
    }

    submit(): void {
        this.raceForm.markAllAsTouched();

        console.log(this.raceForm);
        if (this.raceForm.valid) {
            console.log('valid');
            let raceDto: Race = {
                name: this.raceForm.get('nameForm')?.value,
                description: this.raceForm.get('descriptionForm')?.value,
                size: this.raceForm.get('sizeForm')?.value,
                languages: this.raceForm.get('languagesForm')?.value,
                alignment: this.raceForm.get('alignmentForm')?.value,
                featIds: this.raceForm.get('featsForm')?.value,
            }
            
            this.raceService.createRace(raceDto).subscribe((res: ApiResult) => {
                console.log(res);
                if (res.success) {
                    this.router.navigate(['dmaster/races']);
                }
            });
        }
    }

}