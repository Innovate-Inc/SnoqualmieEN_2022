import {Component, Inject, OnInit, AfterViewInit  } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ProjectService} from '../services/project.service';
import {DocuService} from '../services/docu.service';
import {LoadingService} from '../services/loading.service';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-doc-popup',
  templateUrl: './doc-popup.component.html',
  styleUrls: ['./doc-popup.component.css']
})
export class DocPopupComponent implements OnInit , AfterViewInit {
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

  constructor(public dialogRef: MatDialogRef<DocPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public docuService: DocuService, public  loadingService: LoadingService) {
  }
  ready: any;
  meta: any;
  ngOnInit(): void {
    this.featureForm.patchValue(this.data.docTask.attributes);
  }

  ngAfterViewInit(): void {
    this.ready = this.data.ready;
    this.meta = this.data.meta;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.data.docTask.attributes = this.featureForm.value;
    if (this.data.docTask.attributes.GlobalID === 'new') {
      this.docuService.addFeature(this.data.docTask).subscribe(() => this.dialogRef.close());
    } else {
      this.docuService.updateFeature(this.data.docTask).subscribe(() => this.dialogRef.close());
    }
  }
}

