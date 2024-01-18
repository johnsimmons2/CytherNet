import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Feat } from "src/app/model/feat";
import { FeatService } from "src/app/services/feat.service";

@Component({
    selector: 'app-create-race',
    templateUrl: './create-race.component.html'
})
export class CreateRaceComponent implements OnInit {

    raceForm: FormGroup;
    feats: Feat[] = [];
    filteredFeats: Feat[] = [];

    constructor(
            public router: Router,
            private formBuilder: FormBuilder, 
            private featService: FeatService) { 
        this.raceForm = this.formBuilder.group({
            nameForm: this.formBuilder.control('', [Validators.required]),
            descriptionForm: this.formBuilder.control(''),
            sizeForm: this.formBuilder.control(''),
            languagesForm: this.formBuilder.control(''),
            alignmentForm: this.formBuilder.control(''),
            featsForm: this.formBuilder.control('')
        });
    }

    ngOnInit(): void {
        this.featService.getFeats().subscribe((res: any) => {
            if (res.success) {
                res.data.forEach((feat: any) => {
                    this.feats.push({
                        id: feat.id,
                        description: feat.description,
                        name: feat.name,
                    });
                });
                this.feats.sort((a, b) => a.name.localeCompare(b.name));
                this.filteredFeats = this.feats;
            }
        });
    }

    search(event: any) {
        if (event.target.value === '') {
            this.filteredFeats = this.feats;
            return;
        }
        this.filteredFeats = this.feats.filter(x => x.name.toLowerCase().includes(event.target.value.toLowerCase()));
    }

    submit() {

    }

}