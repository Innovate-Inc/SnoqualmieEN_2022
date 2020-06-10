import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {
  // Set our map properties
  mapCenter = [-121.841574, 47.518784];
  basemapType = 'streets-relief-vector';
  mapZoomLevel = 15;

  constructor() {
  }

  ngOnInit(): void {
  }

  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }

}
