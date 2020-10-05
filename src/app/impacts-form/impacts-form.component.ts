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
    Impact_YN: new FormControl(),
    Enviro_Impact: new FormControl(),
    Enviro_Impact_Type: new FormControl(),
    Wetland_Likert: new FormControl(),
    Aquatic_Likert: new FormControl(),
    Storm_Likert: new FormControl(),
    Veg_Likert: new FormControl(),
    Watertype_Likert: new FormControl(),
    Mitigation: new FormControl(),
    Impact_Culture: new FormControl(),
    Culture_Type: new FormControl(),
    Culture_Note: new FormControl(),
    Archeology: new FormControl(),
    Arch_YN_study: new FormControl(),
    Arch_Resources: new FormControl(),
    Mitigation_Desc: new FormControl(),
    Ethnographic: new FormControl(),
    Ethno_Name: new FormControl(),
  });
  
  constructor(public projectService: ProjectService, private route: ActivatedRoute, private router: Router,
    public  loadingService: LoadingService) { }

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
        }
      }),
    ).subscribe(() => this.loadingService.hide());
  }

  save(abstracty: any) {
    console.log(abstracty);
    abstracty.attributes = this.featureForm.value;
    this.projectService.layerIsLoaded.subscribe(() => {
        this.projectService.updateFeature(abstracty).subscribe();
      }
    );

  }

  //The following four functions are a workaround for ngModel. The purpose of them is to hide or show a block of html
  enviroClick(option: any){
    if(option == 1){
      this.Impact_Enviro_var = "Yes";
    }
    else{
      this.Impact_Enviro_var = "No";
    }
  }
  impactCulture(option: any){
    if(option == 1){
      this.Culture_Impact_var = "Yes";
    }
    else{
      this.Culture_Impact_var = "No";
    }
  }
  archeologyClick(option: any){
    if(option == 1){
      this.archeologySite = "Yes";
    }
    else{
      this.archeologySite = "No";
    }
  }
  ethographicClick(option: any){
    if(option == 1){
      this.ethographicSite = "Yes";
    }
    else{
      this.ethographicSite = "No";
    }
  }
  //end ngModel workaround functions
}
