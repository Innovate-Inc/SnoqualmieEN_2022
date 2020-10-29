import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ArcBaseService } from 'src/app/services/arc-base.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-chance-encounter-form',
  templateUrl: './chance-encounter-form.component.html',
  styleUrls: ['./chance-encounter-form.component.css']
})
export class ChanceEncounterFormComponent implements OnInit {

  uploadService: ArcBaseService;
  dialogService: DialogService;
  
  constructor(public dialog: MatDialog) {
    this.dialogService = new DialogService(this.uploadService, this.dialog)
   }
  ngOnInit(): void {
  }

}
