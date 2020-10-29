import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ArcBaseService } from 'src/app/services/arc-base.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-call-form',
  templateUrl: './call-form.component.html',
  styleUrls: ['./call-form.component.css']
})
export class CallFormComponent implements OnInit {
  uploadService: ArcBaseService;
  dialogService: DialogService;
  
  constructor(public dialog: MatDialog) {
    this.dialogService = new DialogService(this.uploadService, this.dialog)
   }

  ngOnInit(): void {
  }

}
