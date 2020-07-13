import { WildCardComponent } from './../wild-card/wild-card.component';
import { Component, OnInit } from '@angular/core';
import { ArcBaseService } from '../services/arc-base.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  invoiceService: ArcBaseService;
  constructor(snackBar: MatSnackBar) {
    this.invoiceService = new ArcBaseService(environment.layers.invoices, snackBar);
    

  }

  ngOnInit(): void {
    // this.invoiceService.filter()
    this.invoiceService.getItems().subscribe();
  }

  addOperator(selection: string){
    console.log(selection);
  }

}
