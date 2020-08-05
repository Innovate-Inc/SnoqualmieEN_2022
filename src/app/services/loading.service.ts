import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
@Injectable(
  // {providedIn: 'root'}
  )
export class LoadingService {
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }
  show() {
    this.loading.next(true);
    console.log('SHOW!');
  }
  hide() {
    this.loading.next(false);
    console.log('HIDE!');
  }
}
