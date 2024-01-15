
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
})
export class CreateUserComponent implements OnInit {

  /**
   * TODO: Actually set up the form to accept user info to add new users.
   * Set up data default inserting into database, such as admin account / dm account.
   * Let users set their images and see their info / stat sheet
   * DM can edit stat sheets
   */
  characterForm: FormGroup;

  constructor(private router: Router, private loginService: UserService, private formBuilder: FormBuilder) {
    this.characterForm = this.formBuilder.group({
      characterNameForm: this.formBuilder.control('', [Validators.required, Validators.maxLength(30)]),
      classForm: this.formBuilder.control('', Validators.required),
      levelForm: this.formBuilder.control({value: 1, disabled: true}, [Validators.max(20), Validators.min(1)]),
      characterTypeForm: this.formBuilder.control(0),
      subclassForm: this.formBuilder.control('', Validators.required),
      raceForm: this.formBuilder.control('', Validators.required),
      statsForm: new FormControl(''),
      backgroundForm: new FormControl(''),
      alignmentForm: new FormControl(''),
      personalityForm: new FormControl(''),
      spellsForm: new FormControl(''),
      cantripsForm: new FormControl(''),
    });
  }

  ngOnInit(): void {
  }

  createCharacter() {
    this.router.navigate(['create/character']);
  }

}
