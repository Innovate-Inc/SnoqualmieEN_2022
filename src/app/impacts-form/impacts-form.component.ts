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
  archeologySite: string;
  Enviro_Impact: string;

  featureForm = new FormGroup({
    // ProjectNumber: new FormControl(),
    OBJECTID: new FormControl(),
    globalid: new FormControl(),
    Reviewer_Name: new FormControl(),
    Review_Name_Note: new FormControl(),
    Date_Received: new FormControl(),
    Reviewer_Department: new FormControl(),
    ID_DAHP: new FormControl(),
    ID_Initials: new FormControl(),
    Notification_ID: new FormControl(),
    ID_DAHP_full: new FormControl(),
    Project_Name: new FormControl(),
    Jurisdiction: new FormControl(),
    Jurisdiction_other: new FormControl(),
    Jurisdiction_Type: new FormControl(),
    Project_Phase: new FormControl(),
    Notification_Type: new FormControl(),
    Note_Concern: new FormControl(),
    Noti_Dept_Select: new FormControl(),
    Noti_Dept_Select_other: new FormControl(),
    Noti_Tribe: new FormControl(),
    Noti_Tribe_Text: new FormControl(),
    Location_Type: new FormControl(),
    Abstract: new FormControl(),
    Docu_YN: new FormControl(),
    Docu_Repeat_count: new FormControl(),
    Impact_YN: new FormControl(),
    Enviro_Impact: new FormControl(),
    Enviro_Impact_Type: new FormControl(),
    Wetland_Likert: new FormControl(),
    Aquatic_Likert: new FormControl(),
    Storm_Likert: new FormControl(),
    Veg_Likert: new FormControl(),
    Watertype_Likert: new FormControl(),
    Impact_Culture: new FormControl(),
    Culture_Type: new FormControl(),
    Culture_Note: new FormControl(),
    CreationDate: new FormControl(),
    Creator: new FormControl(),
    EditDate: new FormControl(),
    Editor: new FormControl()
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
    abstracty.attributes = this.featureForm.value;
    this.projectService.layerIsLoaded.subscribe(() => {
        this.projectService.updateFeature(abstracty).subscribe();
      }
    );

  }
  test(){
    console.log(this.Enviro_Impact);
  }

}
