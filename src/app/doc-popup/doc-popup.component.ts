import {Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {DocuService} from '../services/docu.service';
import {LoadingService} from '../services/loading.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ArcBaseService } from '../services/arc-base.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadDialogComponent } from '../upload-dialog/upload-dialog.component';


@Component({
  selector: 'app-doc-popup',
  templateUrl: './doc-popup.component.html',
  styleUrls: ['./doc-popup.component.css']
})
export class DocPopupComponent implements OnInit , AfterViewInit {
  objectID: number;
  attachments: Array<any> = [];
  maxAttachments: number;

  featureForm = new FormGroup({
    Docu_Type: new FormControl(),
    Docu_Type_Other: new FormControl(),
    Docu_Note: new FormControl(),
    Docu_Link: new FormControl(),
    Docu_More_Note: new FormControl(),
    parentglobalid: new FormControl(),
    CreationDate: new FormControl(),
    Creator: new FormControl(),
    EditDate: new FormControl(),
    Editor: new FormControl(),
    globalid: new FormControl(),
    objectid: new FormControl()
  });

  uploadService: ArcBaseService;

  constructor(private route: ActivatedRoute, private dialog: MatDialog, public dialogRef: MatDialogRef<DocPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public docuService: DocuService, 
              public  loadingService: LoadingService, public snackBar: MatSnackBar) {
                this.uploadService = new ArcBaseService(environment.layers.docu, this.snackBar, this.loadingService);
              }
  meta: any;
  async ngOnInit() {
    if (!this.data.objectID) {
      console.log(this.data.objectID)
      //this.data.docTask = this.docuService.addFeature(this.data.docTask).subscribe();
    }
    await this.featureForm.patchValue(this.data.docTask.attributes);
    this.maxAttachments = environment.maxAttachments;
    this.loadingService.show();
    this.objectID = this.data.objectID
    this.uploadService.getAttachments(this.objectID).subscribe((attachments: Object) => {
      (<any>Object).values(attachments).forEach((val: Array<any>) =>{
        this.attachments = val;
      })
    });
    
  }

  ngAfterViewInit(): void {
    this.meta = this.data.meta;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.data.docTask.attributes = this.featureForm.value;
    if (!this.data.objectID) {
    
      this.data.docTask.attributes.globalid = null;
      console.log(this.data.docTask.attributes);
      this.docuService.addFeature(this.data.docTask).subscribe(() => this.dialogRef.close());
    } else {
      this.docuService.updateFeature(this.data.docTask).subscribe(() => this.dialogRef.close());
    }
  }
  showDeleteDialog(attachment: any, $event: any) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {msg: 'Are you sure you want to delete ' + attachment.name + ' ?', positiveText: 'Yes', negativeText: 'No'}
    });
    dialog.afterClosed().subscribe(confirmed => {
      if (confirmed){
        this.uploadService.deleteAttachments(this.data.docTask, attachment.id).subscribe(() =>
          this.uploadService.getAttachments(this.objectID).subscribe((attachments: Object) => {
            (<any>Object).values(attachments).forEach((val: Array<any>) =>{
              this.attachments = val;
            })
        }));
      }
    });
  }

  showUploadDialog($event: any) {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '550px',
      height: '300px',
      // height: '205px',
      data: { object: this.data.docTask, maxAttach: this.maxAttachments, 
        attached: this.attachments.length, uploadLayer: environment.layers.docu
      }
     });
    dialogRef.afterClosed().subscribe(result => {
      this.uploadService.getAttachments(this.objectID).subscribe((attachments: Object) => {
        (<any>Object).values(attachments).forEach((val: Array<any>) =>{
          this.attachments = val;
        })
      });
    });
  }

}

