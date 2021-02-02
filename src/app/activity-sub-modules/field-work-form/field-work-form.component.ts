import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BehaviorSubject, iif, Subject } from 'rxjs';
import { switchMap, map, finalize } from 'rxjs/operators';
import { ArcBaseService } from 'src/app/services/arc-base.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ProjectService } from 'src/app/services/project.service';
import { environment } from 'src/environments/environment';

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
  ready: any;
  fieldWorkService: ArcBaseService;
  projectId: string;
  isNew: true;

  constructor(public projectService: ProjectService, private route: ActivatedRoute,
    public loadingService: LoadingService, public snackBar: MatSnackBar) {
    this.fieldWorkService = new ArcBaseService(environment.layers.activities, this.snackBar, this.loadingService);
  }

  ngOnInit(): void {
    this.loadingService.show();
    this.route.parent.parent.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.projectId = params.get('id');
        return this.fieldWorkService.layerIsLoaded.pipe(
          switchMap(() => {
            this.fieldWorkService.filter.where = `parentglobalid = '${this.projectId}' and Activity_Type = 'fieldwork'`;
            return this.fieldWorkService.getItems().pipe(finalize(() => {
              this.loadingService.hide();
              this.ready = true;
            }));
          })
        );
      })).subscribe();
  }

  async save(): Promise<void> {
    // if (this.isNew) {

    //   this.data.activityTask.attributes = this.activityForm.value;
    //   this.data.activityTask.attributes.Activity_Type = 'fieldwork';

    //   const feature = new Graphic(this.data.activityTask);
    //   this.data.activityTask = feature;
    //   this.activityService.addFeature(this.data.activityTask).subscribe((res: Array<any>) => {
    //     this.data.activityTask.attributes.objectid = res[0].objectId;
    //     this.data.activityTask.attributes.globalid = res[0].globalId;
    //     this.activityForm.patchValue({ 'globalid': res[0].globalId, 'objectid': res[0].objectId });
    //     this.isNew = false;
    //   });
    // }
    // else {
    //   this.data.activityTask.attributes = this.activityForm.value;
    //   this.activityService.updateFeature(this.data.activityTask).subscribe();
    // }

    // Object.keys(this.activityForm.controls).forEach((key) => {
    //   this.activityForm.get(key).markAsPristine();
    // });
    // await this.sleep(200); // allows the save to happen so that when this component is closed, the correct data loads
  }

  sleep(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
