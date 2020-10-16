import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SiteVisitFormComponent } from '../site-visit-form/site-visit-form.component';
export interface PeriodicElement {
  attributes: {
    Call_Who: string;
    Call_Type: number;
    Call_Email: string;
    Call_Number: number;
  }
}

const ELEMENT_DATA: PeriodicElement[] = [
  {attributes: { Call_Type: 1, Call_Who: 'Hydrogen', Call_Number: 1.0079, Call_Email: 'H'}},
  {attributes:{Call_Type: 2, Call_Who: 'Helium', Call_Number: 4.0026, Call_Email: 'He'}},
  {attributes:{Call_Type: 3, Call_Who: 'Lithium', Call_Number: 6.941, Call_Email: 'Li'}},
  {attributes:{Call_Type: 4, Call_Who: 'Beryllium', Call_Number: 9.0122, Call_Email: 'Be'}},
  {attributes:{Call_Type: 5, Call_Who: 'Boron', Call_Number: 10.811, Call_Email: 'B'}},
  {attributes:{Call_Type: 6, Call_Who: 'Carbon', Call_Number: 12.0107, Call_Email: 'C'}},
  {attributes:{Call_Type: 7, Call_Who: 'Nitrogen', Call_Number: 14.0067, Call_Email: 'N'}},
  {attributes:{Call_Type: 8, Call_Who: 'Oxygen', Call_Number: 15.9994, Call_Email: 'O'}},
  {attributes:{Call_Type: 9, Call_Who: 'Fluorine', Call_Number: 18.9984, Call_Email: 'F'}},
  {attributes:{Call_Type: 10, Call_Who: 'Neon', Call_Number: 20.1797, Call_Email: 'Ne'}},
];
@Component({
  selector: 'app-site-visit-tab',
  templateUrl: './site-visit-tab.component.html',
  styleUrls: ['./site-visit-tab.component.css']
})
export class SiteVisitTabComponent implements OnInit {
  displayedColumnsa: string[] = ['nature', 'name', 'email', 'number'];
  dataSource = ELEMENT_DATA;


  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(SiteVisitFormComponent, {
      height: '700px',
      width: '600px',
    });
  }

}
