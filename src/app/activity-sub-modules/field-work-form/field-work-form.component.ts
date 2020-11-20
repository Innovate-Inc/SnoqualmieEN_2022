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

  constructor(public projectService: ProjectService, private route: ActivatedRoute,
    public  loadingService: LoadingService, public snackBar: MatSnackBar) {
      this.fieldWorkService = new ArcBaseService(environment.layers.activities, this.snackBar, this.loadingService);
     }

  ngOnInit(): void { 
    this.loadingService.show();
    this.route.parent.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.projectId = params.get('id');
        return this.fieldWorkService.layerIsLoaded.pipe(
          switchMap(() => {
            this.fieldWorkService.filter.where = `parentglobalid = '${this.projectId}'`;
            return this.fieldWorkService.getItems().pipe(finalize(() => {
              this.loadingService.hide();
              this.ready = true;
            }));
          })
        );
      })).subscribe();
  }

  save() {
  }
}
