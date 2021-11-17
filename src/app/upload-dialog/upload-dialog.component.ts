import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import Graphic from "esri/Graphic";
import { ArcBaseService } from "../services/arc-base.service";
import { DialogService } from "../services/dialog.service";
import { LoadingService } from "../services/loading.service";

export interface UploadDialogData {
  object: Graphic;
  maxAttach: number;
  attached: number;
  uploadLayer: string;
}

@Component({
  selector: "app-upload-dialog",
  templateUrl: "./upload-dialog.component.html",
  styleUrls: ["./upload-dialog.component.css"],
})
export class UploadDialogComponent implements OnInit {
  uploadService: ArcBaseService;
  uploading = false;
  message = "Please pick a file to upload";
  @ViewChild("fileNameInput")
  myInputVariable: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<UploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UploadDialogData,
    public snackBar: MatSnackBar,
    public loadingService: LoadingService
  ) {
    this.uploadService = new ArcBaseService(
      this.data.uploadLayer,
      this.snackBar,
      this.loadingService
    );
  }

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close();
  }

  uploadFile() {
    if (
      (<HTMLInputElement>document.getElementById("attachmentInput")).value !==
      ""
    ) {
      this.uploading = true;

      this.uploadService
        .uploadAttachments(
          this.data.object,
          document.getElementById("attachmentForm")
        )
        .subscribe(
          () => {
            this.uploading = false;
            this.data.attached += 1;
            this.myInputVariable.nativeElement.value = "";
          },
          () => {
            this.uploading = false;
          }
        );
    }
  }
}
