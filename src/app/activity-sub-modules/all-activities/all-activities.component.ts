import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, finalize } from 'rxjs/operators';
import { ArcBaseService } from 'src/app/services/arc-base.service';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';
import { CallFormComponent } from '../call-form/call-form.component';
import { ChanceEncounterFormComponent } from '../chance-encounter-form/chance-encounter-form.component';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { HearingFormComponent } from '../hearing-form/hearing-form.component';
import { MeetingFormComponent } from '../meeting-form/meeting-form.component';
import { SiteVisitFormComponent } from '../site-visit-form/site-visit-form.component';


@Component({
  selector: 'app-all-activities',
  templateUrl: './all-activities.component.html',
  styleUrls: ['./all-activities.component.css']
})
export class AllActivitiesComponent implements OnInit {
  displayedColumns: string[] = ['Activity_Type', 'Creator', 'CreationDate'];
  activityService: ArcBaseService;
  projectId: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchItem: string = '';

  constructor(public  loadingService: LoadingService, private route: ActivatedRoute, snackBar: MatSnackBar, public dialog: MatDialog) {
    this.activityService = new ArcBaseService(environment.layers.call,  snackBar, loadingService);
  }
 
  ngOnInit(): void {
    this.loadingService.show();
    this.route.parent.parent.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.projectId = params.get('id');
        return this.activityService.layerIsLoaded.pipe(
          switchMap(() => {
            this.activityService.filter.where = `parentglobalid = '${this.projectId}'`;
            return this.activityService.getItems().pipe(finalize(() => {
              this.loadingService.hide();
            }));
          })
        );
      })).subscribe(()=>this.loadingService.hide());
  }
  openForm(task: any){
    var component: any = CallFormComponent;
    if(task.attributes.Activity_Type === "call"){
      component = CallFormComponent;
    }
    else if (task.attributes.Activity_Type === "sitevisit"){
      component = SiteVisitFormComponent;
    }
    else if (task.attributes.Activity_Type === "comment"){
      component = CommentFormComponent;
    }
    else if (task.attributes.Activity_Type === "meeting"){
      component = MeetingFormComponent;
    }
    else if (task.attributes.Activity_Type === "hearing"){
      component = HearingFormComponent;
    }
    else if (task.attributes.Activity_Type === "chance"){
      component = ChanceEncounterFormComponent;
    }
    this.dialog.open(component, {
      height: '700px',
      width: '600px',
      data: {activityTask: task, meta: this.activityService.meta},
    }).afterClosed().subscribe(confirmed => {
      this.ngOnInit();
    });
  }
  execute(){
    this.activityService.filter.where = `(Activity_Type like '%${this.searchItem}%' or Activity_Department like '%${this.searchItem}%' or Activity_Date like '%${this.searchItem}%' or Activity_Staff = '${this.searchItem}' or Creator = '${this.searchItem}') and parentglobalid = '${this.projectId}'`;
    this.activityService.getItems().subscribe();
  }
}
