import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, finalize } from 'rxjs/operators';
import { ArcBaseService } from 'src/app/services/arc-base.service';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';
import { CommentFormComponent } from '../comment-form/comment-form.component';


@Component({
  selector: 'app-comment-tab',
  templateUrl: './comment-tab.component.html',
  styleUrls: ['./comment-tab.component.css']
})
export class CommentTabComponent implements OnInit {
  displayedColumns: string[] = ['Contact_Name', 'Comm_Status', 'Creator', 'CreationDate' ];
  activityService: ArcBaseService;
  projectId: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;

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

  openDialog(task: any): void {
    this.dialog.open(CommentFormComponent, {
      height: '700px',
      width: '600px',
      data: {activityTask: task, meta: this.activityService.meta},
    }).afterClosed().subscribe(confirmed => {
      this.ngOnInit();
    });
  }

}
