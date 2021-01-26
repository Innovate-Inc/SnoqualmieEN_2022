import { Component } from '@angular/core';
import { IdentityManagementService } from './services/identity-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from './services/project.service';
import { DataService } from './services/data.service';
import { FormGroup, FormControl } from '@angular/forms';
import moment from 'moment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Assert';
  showFiller = false;

  filterForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });

  // constructor(private activatedRoute: ActivatedRoute, private identityManager: IdentityManagementService) {
  constructor(public router: Router, private identityManager: IdentityManagementService,
              public projectService: ProjectService, public data: DataService) {

  }
  // See app.component.html
  logMeOut() {
    this.identityManager.logout();
    this.router.navigate(['welcome']);
  }

  // generateReport() {

  // }

  generateSpreadsheet() {

  }

}
