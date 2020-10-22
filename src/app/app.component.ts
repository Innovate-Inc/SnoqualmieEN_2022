import { Component } from '@angular/core';
import {IdentityManagementService} from './services/identity-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from './services/project.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Assert';


   // constructor(private activatedRoute: ActivatedRoute, private identityManager: IdentityManagementService) {
    constructor(public router: Router, private identityManager: IdentityManagementService, public projectService: ProjectService) {

  }
  // See app.component.html
  logMeOut() {
    this.identityManager.logout();
    this.router.navigate(['welcome']);
  }

  log(){
    console.log(this.projectService.editing);
  }
}
