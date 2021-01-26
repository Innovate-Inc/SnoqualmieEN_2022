import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, iif, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-impacts-form',
  templateUrl: './impacts-form.component.html',
  styleUrls: ['./impacts-form.component.css']
})
export class ImpactsFormComponent implements OnInit {
  impacts: Subject<any>;
  //following vars are a workaround for ngModel
  archeologySite: any;
  ethographicSite: any;
  Impact_Enviro_var: any = "No";
  Culture_Impact_var: any = "No";

  featureForm = new FormGroup({
    // ProjectNumber: new FormControl(),
    OBJECTID: new FormControl(),
    globalid: new FormControl(),
    Reviewer_Name: new FormControl(),
    Review_Name_Note: new FormControl(),
    Enviro_Impact: new FormControl(),
    Enviro_Impact_Type: new FormControl(),
    Wetland_Likert: new FormControl(),
    Aquatic_Likert: new FormControl(),
    Storm_Likert: new FormControl(),
    Veg_Likert: new FormControl(),
    Watertype_Likert: new FormControl(),
    Mitigation: new FormControl(),
    Type_of_mitigation: new FormControl(),
    Impact_Culture: new FormControl(),
    Culture_Type: new FormControl(),
    Culture_Note: new FormControl(),
    Archeology: new FormControl(),
    Arch_YN_study: new FormControl(),
    Arch_Resources: new FormControl(),
    Mitigation_Desc: new FormControl(),
    Ethnographic: new FormControl(),
    Ethno_Name: new FormControl(),
    CreationDate: new FormControl(),
    Creator: new FormControl(),
    EditDate: new FormControl(),
    Editor: new FormControl()
  });

  constructor(public projectService: ProjectService, private route: ActivatedRoute,
    public loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingService.show();
    this.impacts = new BehaviorSubject(null);
    this.route.parent.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return iif(() => params.get('id') === 'new',
          this.projectService.create_new_project(),
          this.projectService.selectFeature(params.get('id'), null));
      }),
      map(impacts => {

        this.impacts.next(impacts);
        if (impacts.attributes.globalid !== 'new') {

          this.featureForm.patchValue(impacts.attributes);
          if (this.featureForm.controls["Enviro_Impact"].value === "Yes") {
            this.Impact_Enviro_var = "Yes";
          }
          if (this.featureForm.controls["Impact_Culture"].value === "Yes") {
            this.Culture_Impact_var = "Yes";
          }
          if (this.featureForm.controls["Archeology"].value === "Yes") {
            this.archeologySite = "Yes";
          }
          if (this.featureForm.controls["Ethnographic"].value === "Yes") {
            this.ethographicSite = "Yes";
          }
        }
      }),
    ).subscribe(() => this.loadingService.hide());
  }

  save(abstracty: any) {
    Object.keys(this.featureForm.controls).forEach((key) => {
      this.featureForm.get(key).markAsPristine();
    });
    console.log(abstracty);
    abstracty.attributes = this.featureForm.value;
    this.projectService.layerIsLoaded.subscribe(() => {
      this.projectService.updateFeature(abstracty).subscribe();
    }
    );
  }

  //The following four functions are a workaround for ngModel. The purpose of them is to hide or show a block of html
  enviroClick(option: any) {
    if (this.projectService.editing) {
      if (option == 1) {
        this.Impact_Enviro_var = "Yes";
      }
      else {
        this.Impact_Enviro_var = "No";
      }
    }
  }
  impactCulture(option: any) {
    if (this.projectService.editing) {
      if (option == 1) {
        this.Culture_Impact_var = "Yes";
      }
      else {
        this.Culture_Impact_var = "No";
      }
    }
  }
  archeologyClick(option: any) {
    if (this.projectService.editing) {
      if (option == 1) {
        this.archeologySite = "Yes";
      }
      else {
        this.archeologySite = "No";
      }
    }
  }
  ethographicClick(option: any) {
    if (this.projectService.editing) {
      if (option == 1) {
        this.ethographicSite = "Yes";
      }
      else {
        this.ethographicSite = "No";
      }
    }
  }
  //end ngModel workaround functions
}
