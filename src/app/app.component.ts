import { Component } from '@angular/core';
import {IdentityManagementService} from './services/identity-management.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SnoqualmieEN';

  // Set our map properties
  mapCenter = [-121.841574, 47.518784];
  basemapType = 'streets-relief-vector';
  mapZoomLevel = 15;
 constructor( private identityManager: IdentityManagementService) {

  }
  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }

}
