import { Component, OnInit, ViewChild } from '@angular/core';
import { ArcBaseService } from '../services/arc-base.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  invoiceService: ArcBaseService;
  @ViewChild('invoiceTabs') invoiceTabs: MatTabGroup;

  constructor(snackBar: MatSnackBar) {
    this.invoiceService = new ArcBaseService(environment.layers.invoices, snackBar);
  }

  ngOnInit(): void {
    // this.invoiceService.filter()
    this.invoiceService.getItems().subscribe();
  }

  addOperator(selection: string) {
    console.log(selection);
  }

  public nextClick() {
    this.goToNextTabIndex(this.invoiceTabs);
  }

  public backClick() {
    this.goToPreviousTabIndex(this.invoiceTabs);
  }

  private goToNextTabIndex(tabGroup: MatTabGroup) {
    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) { return; }
    const tabCount = tabGroup._tabs.length;
    tabGroup.selectedIndex = (tabGroup.selectedIndex + 1) % tabCount;
  }

  private goToPreviousTabIndex(tabGroup: MatTabGroup) {
    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) { return; }
    const tabCount = tabGroup._tabs.length;
    tabGroup.selectedIndex = (tabGroup.selectedIndex - 1) % tabCount;
  }
}
