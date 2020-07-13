import { Component } from '@angular/core';
import {IdentityManagementService} from './services/identity-management.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'k’u’lnshiln';


   //constructor(private activatedRoute: ActivatedRoute, private identityManager: IdentityManagementService) {
    constructor(public router: Router, private identityManager: IdentityManagementService) {

  }
  // See app.component.html
  logMeOut() {
    this.identityManager.logout();
    this.router.navigate(['welcome']);
  }

}
