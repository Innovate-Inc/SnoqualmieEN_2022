import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, finalize } from 'rxjs/operators';
import { ArcBaseService } from 'src/app/services/arc-base.service';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';
import { ChanceEncounterFormComponent } from '../chance-encounter-form/chance-encounter-form.component';

@Component({
  selector: 'app-chance-encounter-tab',
  templateUrl: './chance-encounter-tab.component.html',
  styleUrls: ['./chance-encounter-tab.component.css']
})
export class ChanceEncounterTabComponent implements OnInit {
  displayedColumns: string[] = ['CE_Who', 'CreationDate', 'Creator'];
  activityService: ArcBaseService;
  projectId: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchItem: string = '';

  constructor(public  loadingService: LoadingService, private route: ActivatedRoute, snackBar: MatSnackBar, public dialog: MatDialog) {
    this.activityService = new ArcBaseService(environment.layers.activities,  snackBar, loadingService);
  }
 
  ngOnInit(): void {
    this.loadingService.show();
    this.route.parent.parent.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.projectId = params.get('id');
        return this.activityService.layerIsLoaded.pipe(
          switchMap(() => {
            this.activityService.filter.where = `parentglobalid = '${this.projectId}' and Activity_Type = 'chance'`;
            return this.activityService.getItems().pipe(finalize(() => {
              this.loadingService.hide();
            }));
          })
        );
      })).subscribe(()=>this.loadingService.hide());
  }
  openDialog(task: any): void {
    this.dialog.open(ChanceEncounterFormComponent, {
      height: '700px',
      width: '600px',
      data: {activityTask: task, meta: this.activityService.meta},
    }).afterClosed().subscribe(confirmed => {
      this.ngOnInit();
    });
  }
  execute(){
    this.activityService.filter.where = `(Activity_Date like '%${this.searchItem}%' or Activity_Staff like '%${this.searchItem}%' or Activity_Department like '%${this.searchItem}%' or Creator like '%${this.searchItem}%' or CE_Doc_Note like '%${this.searchItem}%' or CE_Who like '%${this.searchItem}%' or CE_Notes like '%${this.searchItem}%') and parentglobalid = '${this.projectId}' and Activity_Type = 'chance'`;
    this.activityService.getItems().subscribe();
  }
}
