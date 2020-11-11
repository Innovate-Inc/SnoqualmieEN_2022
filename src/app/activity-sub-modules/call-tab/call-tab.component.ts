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


@Component({
  selector: 'app-call-tab',
  templateUrl: './call-tab.component.html',
  styleUrls: ['./call-tab.component.css']
})

export class CallTabComponent implements OnInit {
  displayedColumns: string[] = ['Call_Who', "Call_Number", 'CreationDate', 'Creator'];
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
            this.activityService.filter.where = `parentglobalid = '${this.projectId}' and Activity_Type = 'call'`;
            return this.activityService.getItems().pipe(finalize(() => {
              this.loadingService.hide();
            }));
          })
        );
      })).subscribe(()=>this.loadingService.hide());
  }
  openDialog(task: any): void {
    this.dialog.open(CallFormComponent, {
      height: '700px',
      width: '600px',
      data: {activityTask: task, meta: this.activityService.meta},
    }).afterClosed().subscribe(confirmed => {
      this.ngOnInit();
    });
  }
  execute(){
    this.activityService.filter.where = `(Creator like '%${this.searchItem}%' or Call_Who like '%${this.searchItem}%' or Call_Number like '%${this.searchItem}%' or Call_Address = '${this.searchItem}' or Call_Email = '${this.searchItem}') and parentglobalid = '${this.projectId}' and Activity_Type = 'call'`;
    this.activityService.getItems().subscribe();
  }
}
