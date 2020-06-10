import { Component } from '@angular/core';
import {IdentityManagementService} from './services/identity-management.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SnoqualmieEN';


 constructor( private identityManager: IdentityManagementService) {

  }
  // See app.component.html

}
