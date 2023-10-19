import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './dmaster.component.html',
  styleUrls: ['./dmaster.component.scss']
})
export class DungeonMasterComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  createCharacter() {
    this.router.navigate(['create/character']);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

}
