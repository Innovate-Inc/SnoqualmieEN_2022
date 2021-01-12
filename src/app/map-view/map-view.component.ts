import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, OnDestroy {
  // Set our map properties
  mapCenter = [-121.841574, 47.518784];
  basemapType = 'streets-relief-vector';
  mapZoomLevel = 15;
  highlightId: Observable<string>;
  geomSelect: Observable<boolean>;

  constructor(public route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.highlightId = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      // tap(event => console.log(event))
      // there is only one parameter of id in route tree
      // route.snapshot.children[0].params.id
      filter(() => this.route.snapshot.children.length > 0 && this.route.snapshot.children[0].paramMap.has('id')),
      map(() => this.route.snapshot.children[0].paramMap.get('id'))
    );
    // this.highlightId = this.route.paramMap.pipe(filter(params => params.has('id')),
    //    map(params => params.get('id')));
  }

  mapLoadedEvent(status: boolean) {
    console.log('The map loaded: ' + status);
  }

  ngOnDestroy() {
  }
}
