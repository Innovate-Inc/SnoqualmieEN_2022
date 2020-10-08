import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BehaviorSubject, iif, Subject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-field-work-form',
  templateUrl: './field-work-form.component.html',
  styleUrls: ['./field-work-form.component.css']
})
export class FieldWorkFormComponent implements OnInit {
  activities: Subject<any>;

  activityForm = new FormGroup({
    objectid: new FormControl(),
    globalid: new FormControl(),
    Activity_Type: new FormControl(),
    parentglobalid: new FormControl(),
    CreationDate: new FormControl(),
    Creator: new FormControl(),
    EditDate: new FormControl(),
    Editor: new FormControl(),
    Field_Doc_Note: new FormControl(),
  });
  
  constructor(public projectService: ProjectService, private route: ActivatedRoute,
    public  loadingService: LoadingService) { }

  ngOnInit(): void { 
    this.loadingService.show();
    this.activities = new BehaviorSubject(null);
    this.route.parent.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return iif(() => params.get('id') === 'new',
          this.projectService.create_new_project(),
          this.projectService.selectFeature(params.get('id'), null));
      }),
      map(activities => {
        this.activities.next(activities);
        if (activities.attributes.globalid !== 'new') {
         
          this.activityForm.patchValue(activities.attributes);
        }
      }),
    ).subscribe(() => this.loadingService.hide());
  }

  save(abstracty: any) {
    console.log(abstracty);
    abstracty.attributes = this.activityForm.value;
    this.projectService.layerIsLoaded.subscribe(() => {
        this.projectService.updateFeature(abstracty).subscribe();
      }
    );

  }
}
