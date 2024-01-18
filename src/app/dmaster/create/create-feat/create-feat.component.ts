import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FeatService } from "src/app/services/feat.service";

@Component({
    selector: 'app-create-feat',
    templateUrl: './create-feat.component.html'
})
export class CreateFeatComponent {

    createError: boolean = false;
    featForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private featService: FeatService, private router: Router) { 
        this.featForm = this.formBuilder.group({
            nameForm: this.formBuilder.control('', [Validators.required]),
            descriptionForm: this.formBuilder.control('', [Validators.required]),
            prerequisiteForm: this.formBuilder.control(''),
        });
    }

    submit() {
        if (this.featForm.valid) {
            let featDto = {
                name: this.featForm.get('nameForm')?.value,
                description: this.featForm.get('descriptionForm')?.value,
                prerequisite: this.featForm.get('prerequisiteForm')?.value,
            }
            this.featService.createFeat(featDto).subscribe((res: any) => {
                if (res.success) {
                    this.router.navigate(['dmaster/feats']);
                } else {
                    console.log(res);
                    this.createError = true;
                }
            });
        }
    }
}