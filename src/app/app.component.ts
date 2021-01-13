import { Component } from '@angular/core';
import {IdentityManagementService} from './services/identity-management.service';
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
  applyFilter(num: number){
    if(num === 0){ // apply filters
      let fromDate = moment(this.filterForm.controls['fromDate'].value).format("YYYY/MM/DD");
      let toDate = moment(this.filterForm.controls['toDate'].value).format("YYYY/MM/DD");
      if(this.filterForm.controls['fromDate'].value && this.filterForm.controls["toDate"].value){
        this.projectService.filter.where = `created_date between '${fromDate}' and '${toDate}'`;
      }
      else if (this.filterForm.controls['fromDate'].value) {
        this.projectService.filter.where = ` created_date > '${fromDate}'`;
      }
      else if(this.filterForm.controls["toDate"].value){
        this.projectService.filter.where = `created_date < '${toDate}'`;
      }
      else {
        this.projectService.filter.where = `Project_Name like '%' or ID_DAHP_full like '%' or Jurisdiction like '%' or created_user like '%'`;
      }
      this.projectService.layerIsLoaded.subscribe(() =>{
        this.projectService.filter.orderByFields = [`ID_DAHP_full DESC`];
        this.projectService.getItems().subscribe();
      });
    }
    else { //clear all filters
      this.filterForm.setValue({"fromDate": "", "toDate": ""})
      this.projectService.layerIsLoaded.subscribe(() => {
        this.projectService.filter.where = `Project_Name like '%' or ID_DAHP_full like '%' or Jurisdiction like '%' or created_user like '%'`;
        this.projectService.getItems().subscribe();
      });
    }
  }
}
