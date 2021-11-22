import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import Graphic from "@arcgis/core/Graphic";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { UploadDialogComponent } from "../upload-dialog/upload-dialog.component";
import { ArcBaseService } from "./arc-base.service";

@Injectable({
  providedIn: "root",
})
export class DialogService {
  newlyAddedFeatureId: number;
  attachments: Array<any> = [];
  maxAttachments: number;
  item: Graphic;

  constructor(public uploadService: ArcBaseService, public dialog: MatDialog) {
    this.maxAttachments = environment.maxAttachments;
  }
  //sets the max attachments
  setAttachmentsMax(max: number) {
    this.maxAttachments = max;
  }
  //gets all the attachments for the specific Esri Graphic
  getAttachments() {
    this.attachments = [];
    this.uploadService
      .getAttachments(this.item.attributes.objectid)
      .subscribe((attachments: Object) => {
        (<any>Object).values(attachments).forEach((val: Array<any>) => {
          this.attachments = val;
        });
      });
  }
  //opens a dialog for deleting a photo
  showDeleteDialog(attachment: any, $event: any) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: "500px",
      data: {
        msg: "Are you sure you want to delete " + attachment.name + " ?",
        positiveText: "Yes",
        negativeText: "No",
      },
    });
    dialog.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.uploadService
          .deleteAttachments(this.item, attachment.id)
          .subscribe(() => {
            this.getAttachments();
          });
      }
    });
  }

  // opens a dialog for uploading a photo
  showDocuUploadDialog($event: any) {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: "550px",
      height: "420px",
      data: {
        object: this.item,
        maxAttach: this.maxAttachments,
        attached: this.attachments.length,
        uploadLayer: environment.layers.docu,
      },
    });
    return dialogRef.afterClosed().pipe(
      tap((result) => {
        this.getAttachments();
      })
    );
  }

  // opens a dialog for uploading a photo
  showActivityUploadDialog($event: any) {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: "550px",
      height: "300px",
      data: {
        object: this.item,
        maxAttach: this.maxAttachments,
        attached: this.attachments.length,
        uploadLayer: environment.layers.activities,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getAttachments();
    });
  }
}
