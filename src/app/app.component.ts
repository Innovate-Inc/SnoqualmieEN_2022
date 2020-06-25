import { Component } from '@angular/core';
import {IdentityManagementService} from './services/identity-management.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SnoqualmieEN';


 constructor( public router: Router, private identityManager: IdentityManagementService) {

  }
  // See app.component.html

}
