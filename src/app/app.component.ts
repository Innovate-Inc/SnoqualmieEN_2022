import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SnoqualmieEN';

  // Set our map properties
  mapCenter = [-121.841574, 47.518784];
  basemapType = 'topo';
  mapZoomLevel = 15;

  // See app.component.html
  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }

}
