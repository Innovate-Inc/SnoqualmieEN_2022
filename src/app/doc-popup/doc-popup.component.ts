import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { DocuService } from "../services/docu.service";
import { LoadingService } from "../services/loading.service";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { finalize, map, switchMap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { ArcBaseService } from "../services/arc-base.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UploadDialogComponent } from "../upload-dialog/upload-dialog.component";
import { DialogService } from "../services/dialog.service";
import Graphic from "@arcgis/core/Graphic";
import { link } from "fs";

@Component({
  selector: "app-doc-popup",
  templateUrl: "./doc-popup.component.html",
  styleUrls: ["./doc-popup.component.css"],
})
export class DocPopupComponent implements OnInit {
  objectID: number;
  featureForm = new FormGroup({
    Docu_Type: new FormControl(),
    Docu_Type_Other: new FormControl(),
    Docu_Note: new FormControl(),
    Docu_Link: new FormControl(),
    Docu_More_Note: new FormControl(),
    parentglobalid: new FormControl(),
    CreationDate: new FormControl(),
    Creator: new FormControl({ value: "", disabled: true }),
    EditDate: new FormControl(),
    Editor: new FormControl(),
    globalid: new FormControl(),
    objectid: new FormControl(),
  });

  uploadService: ArcBaseService;
  getItemService: ArcBaseService;
  linkService: ArcBaseService;
  dialogService: DialogService;
  newRow: boolean = false;
  links: Subject<any[]> = new Subject<any[]>();

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DocPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public docuService: DocuService,
    public loadingService: LoadingService,
    public snackBar: MatSnackBar
  ) {
    this.uploadService = new ArcBaseService(
      environment.layers.docu,
      this.snackBar,
      this.loadingService
    );
    this.getItemService = new ArcBaseService(
      environment.layers.docu,
      this.snackBar,
      this.loadingService
    );
    this.linkService = new ArcBaseService(
      environment.layers.links,
      this.snackBar,
      this.loadingService
    );
    this.dialogService = new DialogService(this.uploadService, this.dialog);
  }

  meta: any;
  saved: boolean = false;
  ngOnInit() {
    this.meta = this.data.meta;
    this.featureForm.patchValue(this.data.docTask.attributes);
    if (this.data.docTask.attributes.globalid == "new") {
      this.newRow = true;
    } else {
      this.saved = true;
      this.dialogService.item = this.data.docTask;
      this.loadingService.show();
      this.objectID = this.data.objectID;
      this.dialogService.getAttachments();
      this.getLinks().subscribe();
      this.linkService.dataChange.subscribe((l) => this.links.next(l));
      this.loadingService.hide();
    }
  }

  getLinks() {
    const projectId = this.data.docTask.attributes.globalid;
    return this.linkService.layerIsLoaded.pipe(
      switchMap(() => {
        this.linkService.filter.where = `RELGUID = '${projectId}'`;
        return this.linkService.getItems().pipe(finalize(() => {}));
      })
    );
  }

  addFeature() {
    if (this.data.docTask.attributes.globalid == "new") {
      // this.data.docTask.attributes.Docu_Note = this.featureForm.controls['Docu_Note'].value;
      // this.data.docTask.attributes.Docu_Type = this.featureForm.controls['Docu_Type'].value;
      let feature = new Graphic(this.data.docTask);
      this.data.docTask = feature;
      this.uploadService.addFeature(feature).subscribe((res: Array<any>) => {
        this.dialogService.item = new Graphic(res[0]);
        this.dialogService.item.attributes = {};
        this.dialogService.item.attributes.objectid = res[0].objectId;
        this.dialogService.item.attributes.globalid = res[0].globalId;
        this.featureForm.patchValue({
          globalid: res[0].globalId,
          objectid: res[0].objectId,
        });
        this.data.docTask.attributes = this.featureForm.value;
      });

      this.saved = true;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  save() {
    if (this.data.docTask.attributes.globalid == "new") {
      this.addFeature();
    } else {
      this.data.docTask.attributes = this.featureForm.value;
      this.docuService.updateFeature(this.data.docTask).subscribe();
    }
  }

  async dlAttach(attachment: any) {
    const image = await fetch(attachment.url);
    const imageBlob = await image.blob();
    const imageURL = URL.createObjectURL(imageBlob);
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async downloadLink(url: string) {
    const fileName = url.replace(/^.*[\\\/]/, "");
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.dispatchEvent(new MouseEvent("click"));
  }

  shopenAddAttachmentDialog(e: Event) {
    this.dialogService
      .showDocuUploadDialog(e)
      .pipe(switchMap(() => this.getLinks()))
      .subscribe();
  }

  //opens a dialog for deleting a photo
  showDeleteLinkDialog(linkFeature: any, $event: any) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: "500px",
      data: {
        msg:
          "Are you sure you want to delete " +
          linkFeature.attributes.NAME +
          " ?",
        positiveText: "Yes",
        negativeText: "No",
      },
    });
    dialog.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.linkService.delete(linkFeature).subscribe(() => {
          this.getLinks().subscribe();
        });
      }
    });
  }
}
