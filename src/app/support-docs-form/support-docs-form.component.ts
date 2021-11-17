import { Component, OnInit } from "@angular/core";
import { LoadingService } from "../services/loading.service";
import { DocuService } from "../services/docu.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { finalize, switchMap } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DocPopupComponent } from "../doc-popup/doc-popup.component";
import { MatDialog } from "@angular/material/dialog";
import { ArcBaseService } from "../services/arc-base.service";
import { environment } from "src/environments/environment";
import { DeleteAttachComponent } from "../esri-map/esri-map.component";

@Component({
  selector: "app-support-docs-form",
  templateUrl: "./support-docs-form.component.html",
  styleUrls: ["./support-docs-form.component.css"],
})
export class SupportDocsFormComponent implements OnInit {
  displayColumns = ["type", "date", "Creator", "delete"];
  // displayColumns = ['type', 'date', 'Creator', 'delete'];
  projectId: string;
  docService: ArcBaseService;
  ready: any;
  searchItem: string = "";

  constructor(
    public loadingService: LoadingService,
    private route: ActivatedRoute,
    snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.docService = new ArcBaseService(
      environment.layers.docu,
      snackBar,
      loadingService
    );
  }

  ngOnInit(): void {
    this.loadingService.show();
    this.route.parent.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.projectId = params.get("id");
          return this.docService.layerIsLoaded.pipe(
            switchMap(() => {
              this.docService.filter.where = `parentglobalid = '${this.projectId}'`;
              return this.docService.getItems().pipe(
                finalize(() => {
                  this.loadingService.hide();
                  this.ready = true;
                })
              );
            })
          );
        })
      )
      .subscribe(() => this.loadingService.hide());
  }

  openDialog(task: any): void {
    this.dialog
      .open(DocPopupComponent, {
        width: "650px",
        data: {
          docTask: task,
          meta: this.docService.meta,
          objectID: task.attributes.objectid,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        this.ngOnInit();
      });
  }
  openEmptyDialog(): void {
    this.dialog
      .open(DocPopupComponent, {
        width: "650px",
        data: {
          docTask: {
            attributes: { globalid: "new", parentglobalid: this.projectId },
          },
          meta: this.docService.meta,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        this.ngOnInit();
      });
  }
  execute() {
    this.docService.filter.where = `(Creator like '%${this.searchItem}%' or Docu_Type like '%${this.searchItem}%' or Docu_Note like '%${this.searchItem}%') and parentglobalid = '${this.projectId}'`;
    this.docService.getItems().subscribe();
  }

  delete(feature: any, i: number) {
    const dialogRef = this.dialog.open(DeleteAttachComponent, {
      width: "400px",
      height: "330px", // ,
      // data: {date: element.attributes?.INV_InvoiceDate, invoiceID: element.attributes?.OBJECTID,
      //       encroachmentID: element.attributes?.INV_EncID, permitID: element.attributes?.INV_PermitID}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === "true") {
        this.docService.delete(feature).subscribe(() => {
          this.refresh();
        });
      }
    });
  }

  refresh() {
    this.docService.getItems().subscribe();
  }
}
