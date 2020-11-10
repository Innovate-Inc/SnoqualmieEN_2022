import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import Graphic from 'esri/Graphic';
import { ArcBaseService } from 'src/app/services/arc-base.service';
import { DialogService } from 'src/app/services/dialog.service';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-call-form',
  templateUrl: './call-form.component.html',
  styleUrls: ['./call-form.component.css']
})
export class CallFormComponent implements OnInit {
  uploadService: ArcBaseService;
  dialogService: DialogService;
  isNew: boolean = true;

  activityForm = new FormGroup({
    Activity_Type: new FormControl(),
    Activity_Department: new FormControl(),
    Activity_Staff: new FormControl(),
    Activity_Date: new FormControl(),
    Call_Who: new FormControl(),
    Call_Number: new FormControl(),
    Call_Email: new FormControl(),
    Call_Address: new FormControl(),
    Call_Type: new FormControl(),
    Call_Doc_Note: new FormControl(),
    parentglobalid: new FormControl(),
    CreationDate: new FormControl(),
    Creator: new FormControl({ value: '', disabled: true }),
    EditDate: new FormControl(),
    Editor: new FormControl(),
    globalid: new FormControl(),
    objectid: new FormControl()
  });

  activityService: ArcBaseService;
  meta: any;
  objectID: number;

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar, 
    public loadingService: LoadingService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogService = new DialogService(this.uploadService, this.dialog)
    this.activityService = new ArcBaseService(environment.layers.call, this.snackBar, this.loadingService);
    this.dialogService = new DialogService(this.activityService, this.dialog);
 
  }

  ngOnInit(): void {
    this.meta = this.data.meta;
    this.activityForm.patchValue(this.data.activityTask.attributes);
    if(this.data.activityTask.attributes.globalid != "new"){
      console.log(this.data.activityTask);
      this.isNew = false;
      this.dialogService.item = this.data.activityTask;
      this.loadingService.show();
      this.objectID = this.data.activityTask.attributes.objectid;
      this.dialogService.getAttachments();
      this.loadingService.hide()
    }
  }

  save(): void {

    if(this.activityForm.valid){

      if (this.isNew) {

        this.data.activityTask.attributes = this.activityForm.value;
        this.data.activityTask.attributes.Activity_Type = "call";
        this.data.activityTask.attributes.Activity_Date = new Date();

        let feature = new Graphic(this.data.activityTask);
        this.data.activityTask = feature;
        this.activityService.addFeature(this.data.activityTask).subscribe((res: Array<any>) =>{
          this.data.activityTask.attributes.objectid = res[0].objectId;
          this.data.activityTask.attributes.globalid = res[0].globalId;
          this.activityForm.patchValue({'globalid': res[0].globalId, 'objectid': res[0].objectId});
        });
        this.isNew = false;
      }  
      else {
        this.data.activityTask.attributes = this.activityForm.value;
        this.activityService.updateFeature(this.data.activityTask).subscribe();
      }   

    }
  }    

}
