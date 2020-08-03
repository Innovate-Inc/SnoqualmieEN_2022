import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

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
  highlightId: Observable<string>;

  constructor(public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.highlightId = this.route.paramMap.pipe(filter(params => params.has('id')),
      map(params => params.get('id')));
  }

  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }

}
