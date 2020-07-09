import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wild-card',
  templateUrl: './wild-card.component.html',
  styleUrls: ['./wild-card.component.css']
})
export class WildCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  addOperator(selection: string){
    console.log(selection);
  }
}
