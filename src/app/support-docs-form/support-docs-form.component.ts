import {Component, OnInit} from '@angular/core';
import {LoadingService} from '../services/loading.service';
import {DocuService} from '../services/docu.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {finalize, switchMap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DocPopupComponent} from '../doc-popup/doc-popup.component';
import {MatDialog} from '@angular/material/dialog';
import { ArcBaseService } from '../services/arc-base.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-support-docs-form',
  templateUrl: './support-docs-form.component.html',
  styleUrls: ['./support-docs-form.component.css']
})
export class SupportDocsFormComponent implements OnInit {
  displayColumns = ['type', 'date', 'Creator'];
  projectId: string;
  docService: ArcBaseService;
  ready: any;
  searchItem: string = '';

  constructor(public  loadingService: LoadingService, private route: ActivatedRoute, snackBar: MatSnackBar, public dialog: MatDialog) {
    this.docService = new ArcBaseService(environment.layers.docu,  snackBar, loadingService);
  }

  ngOnInit(): void {
    this.loadingService.show();
    this.route.parent.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.projectId = params.get('id');
        return this.docService.layerIsLoaded.pipe(
          switchMap(() => {
            this.docService.filter.where = `parentglobalid = '${this.projectId}'`;
            return this.docService.getItems().pipe(finalize(() => {
              this.loadingService.hide();
              this.ready = true;
            }));
          })
        );
      })).subscribe(()=>this.loadingService.hide());
  }

  openDialog(task: any): void {
    this.dialog.open(DocPopupComponent, {
      width: '650px',
      data: {docTask: task, meta: this.docService.meta, objectID: task.attributes.objectid}
    }).afterClosed().subscribe(confirmed => {
      this.ngOnInit();
    });

  }
  openEmptyDialog(): void {
    this.dialog.open(DocPopupComponent, {
      width: '650px',
      data: {docTask: {attributes: {'globalid': 'new', 'parentglobalid': this.projectId }}, meta: this.docService.meta}
    }).afterClosed().subscribe(confirmed => {
      this.ngOnInit();
    });

  }
  execute(){
    console.log(this.searchItem);
    this.docService.filter.where = `(Creator like '%${this.searchItem}%' or Docu_Type like '%${this.searchItem}%' or Docu_Note like '%${this.searchItem}%') and parentglobalid = '${this.projectId}'`;
    this.docService.getItems().subscribe();
  }
}


