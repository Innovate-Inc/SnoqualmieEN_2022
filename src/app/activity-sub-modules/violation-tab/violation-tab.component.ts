import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, finalize } from 'rxjs/operators';
import { ArcBaseService } from 'src/app/services/arc-base.service';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';
import { ViolationFormComponent } from '../violation-form/violation-form.component';


@Component({
  selector: 'app-violation-tab',
  templateUrl: './violation-tab.component.html',
  styleUrls: ['./violation-tab.component.css']
})

export class ViolationTabComponent implements OnInit {
  displayedColumns: string[] = ['Violation_Code', 'Violation_Location', 'CreationDate', 'Creator'];
  activityService: ArcBaseService;
  projectId: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchItem = '';


  constructor(public loadingService: LoadingService, private route: ActivatedRoute, snackBar: MatSnackBar, public dialog: MatDialog) {
    this.activityService = new ArcBaseService(environment.layers.activities, snackBar, loadingService);
  }

  ngOnInit(): void {
    this.loadingService.show();
    this.route.parent.parent.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.projectId = params.get('id');
        return this.activityService.layerIsLoaded.pipe(
          switchMap(() => {
            this.activityService.filter.where = `parentglobalid = '${this.projectId}' and Activity_Type = 'violations'`;
            return this.activityService.getItems().pipe(finalize(() => {
              this.loadingService.hide();
            }));
          })
        );
      })).subscribe(() => this.loadingService.hide());
  }

  openDialog(task: any): void {
    this.dialog.open(ViolationFormComponent, {
      height: '700px',
      width: '600px',
      data: { activityTask: task, meta: this.activityService.meta },
    }).afterClosed().subscribe(confirmed => {
      this.ngOnInit();
    });
  }

  execute() {
    this.activityService.filter.where = `(Violation_Code like '%${this.searchItem}%' or Violation_Location like '%${this.searchItem}%' or CreationDate like '%${this.searchItem}%' or Creator like '%${this.searchItem}%') and parentglobalid = '${this.projectId}' and Activity_Type = 'violations'`;
    this.activityService.getItems().subscribe();
  }
}
