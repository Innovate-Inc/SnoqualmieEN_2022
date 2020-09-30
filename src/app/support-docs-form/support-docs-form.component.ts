import {Component, OnInit} from '@angular/core';
import {LoadingService} from '../services/loading.service';
import {DocuService} from '../services/docu.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {finalize, switchMap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DocPopupComponent} from '../doc-popup/doc-popup.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-support-docs-form',
  templateUrl: './support-docs-form.component.html',
  styleUrls: ['./support-docs-form.component.css']
})
export class SupportDocsFormComponent implements OnInit {
  displayColumns = ['type', 'date', 'Creator'];
  projectId: string;
  docService: DocuService;
  ready: any;

  constructor(public  loadingService: LoadingService, private route: ActivatedRoute, snackBar: MatSnackBar, public dialog: MatDialog) {
    this.docService = new DocuService(snackBar, loadingService);
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
      })).subscribe();
  }

  openDialog(task: any): void {
    // if (task.attributes.GlobalID === 'new') {
    //   this.docService.create_new_fieldwork(this.project_id).subscribe(new_fieldwork => {
    //     this.dialog.open(DocPopupComponent, {
    //       width: '650px',
    //       data: {fieldwork: new_fieldwork}
    //     }).afterClosed().pipe(flatMap(result => {
    //       console.log('The dialog was closed');
    //       return this.fieldworkService.getItems();
    //     })).subscribe();
    //   });
    // } else {
    this.dialog.open(DocPopupComponent, {
      width: '650px',
      data: {docTask: task, ready: this.ready, meta: this.docService.meta}
    });
  }
}


