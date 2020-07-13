import { Component, OnInit } from '@angular/core';
import { IdentityManagementService } from '../services/identity-management.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  // constructor(private activatedRoute: ActivatedRoute, private identityManager: IdentityManagementService) {
  constructor(public router: Router, private identityManager: IdentityManagementService) {

  }
  // See app.component.html
  logMeOut() {
    this.identityManager.logout();
    this.router.navigate(['welcome']);
  }

}
