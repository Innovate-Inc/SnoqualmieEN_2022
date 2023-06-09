import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import Graphic from '@arcgis/core/Graphic';
import { SaveChangesDialogComponent } from 'src/app/save-changes-dialog/save-changes-dialog.component';
import { ArcBaseService } from 'src/app/services/arc-base.service';
import { DialogService } from 'src/app/services/dialog.service';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';
import { CommentFormComponent } from '../comment-form/comment-form.component';

@Component({
  selector: 'app-meeting-form',
  templateUrl: './meeting-form.component.html',
  styleUrls: ['./meeting-form.component.css']
})
export class MeetingFormComponent implements OnInit {
  uploadService: ArcBaseService;
  activityService: ArcBaseService;
  dialogService: DialogService;
  meta: any;
  objectID: number;
  isNew: boolean = true;

  activityForm = new FormGroup({
    Activity_Type: new FormControl(),
    Activity_Department: new FormControl(),
    Activity_Staff: new FormControl(),
    Activity_Date: new FormControl(),
    Meet_Who: new FormControl(),
    Meet_Doc_Note: new FormControl(),
    Meeting_Notes: new FormControl(),
    parentglobalid: new FormControl(),
    created_date: new FormControl(),
    created_user: new FormControl({ value: '', disabled: true }),
    last_edited_date: new FormControl(),
    last_edited_user: new FormControl(),
    globalid: new FormControl(),
    objectid: new FormControl()
  });

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar,
    public loadingService: LoadingService, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CommentFormComponent>) {

    this.uploadService = new ArcBaseService(environment.layers.activities, this.snackBar, loadingService);
    this.activityService = new ArcBaseService(environment.layers.activities, this.snackBar, this.loadingService);

    this.dialogService = new DialogService(this.uploadService, this.dialog);

  }

  ngOnInit(): void {
    this.meta = this.data.meta;
    this.activityForm.patchValue(this.data.activityTask.attributes);
    if (this.data.activityTask.attributes.globalid !== 'new') {
      this.isNew = false;
      this.dialogService.item = this.data.activityTask;
      this.loadingService.show();
      this.objectID = this.data.activityTask.attributes.objectid;
      this.dialogService.getAttachments();
      this.loadingService.hide();
    }
  }

  async save(): Promise<void> {

    if (this.activityForm.valid) {

      if (this.isNew) {

        this.data.activityTask.attributes = this.activityForm.value;
        this.data.activityTask.attributes.Activity_Type = 'meeting';

        let feature = new Graphic(this.data.activityTask);
        this.data.activityTask = feature;
        this.activityService.addFeature(this.data.activityTask).subscribe(async (res: Array<any>) => {
          this.data.activityTask.attributes.objectid = res[0].objectId;
          this.data.activityTask.attributes.globalid = res[0].globalId;
          this.activityForm.patchValue({ 'globalid': res[0].globalId, 'objectid': res[0].objectId });
          this.isNew = false;

          this.activityService.filter.where = `objectid = '${res[0].objectId}'`;

          await this.activityService.query().subscribe(results => {
            this.dialogService.item = results[0];
          });
        });
      }
      else {
        this.data.activityTask.attributes = this.activityForm.value;
        this.activityService.updateFeature(this.data.activityTask).subscribe();
      }

      Object.keys(this.activityForm.controls).forEach((key) => {
        this.activityForm.get(key).markAsPristine();
      });
      await this.sleep(200); // allows the save to happen so that when this component is closed, the correct data loads
    }
  }
  showSaveChangesDialog() {
    if (!this.activityForm.pristine) {
      this.dialog.open(SaveChangesDialogComponent, {
        width: '550px',
        height: '175px'
      }).afterClosed().subscribe(async (res) => {
        if (res === 0) { // Don't save
          this.dialogRef.close();
        }
        else if (res === 2) { // Save
          this.save();
          await this.sleep(600); // allows the save to happen so that when this component is closed, the correct data loads
          this.dialogRef.close();
        }
        else { // Go back
          return;
        }
      });
    }
    else {
      this.dialogRef.close();
    }
  }
  sleep(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async dlAttach(attachment: any) {
    const image = await fetch(attachment.url);
    const imageBlob = await image.blob();
    const imageURL = URL.createObjectURL(imageBlob);
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
