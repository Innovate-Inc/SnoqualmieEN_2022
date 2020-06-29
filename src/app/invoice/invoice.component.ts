import { WildCardComponent } from './../wild-card/wild-card.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  constructor() { 
    // let foods = [];
    // this.foods = [
    //   {value: 'steak-0', viewValue: 'Steak'},
    //   {value: 'pizza-1', viewValue: 'Pizza'},
    //   {value: 'tacos-2', viewValue: 'Tacos'}
    // ];
  }

  ngOnInit(): void {
  }

}
