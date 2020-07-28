import {environment} from './../../environments/environment.prod';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';

// Load modules from the Esri ArcGIS API for JavaScript
import Map from 'esri/Map'; // Map instance
import MapView from 'esri/views/MapView'; // 2D view of a Map instance
import WebMap from 'esri/WebMap';
import Home from 'esri/widgets/Home'; // Home button
import BasemapGallery from 'esri/widgets/BasemapGallery'; // Basemap Gallery
import Expand from 'esri/widgets/Expand'; // clickable button for opening a widget
import LayerList from 'esri/widgets/LayerList';
import FeatureTable from 'esri/widgets/FeatureTable';
import esriConfig from 'esri/config';
// import {IdentityManagementService} from '../services/identity-management.service';
// import {Router} from '@angular/router';
// import {ProjectService} from '../services/project.service';


@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})

export class EsriMapComponent implements OnInit, OnDestroy {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  @ViewChild('mapViewNode', {static: true}) private mapViewEl: ElementRef;

  /**
   * _zoom sets map zoom
   * _center sets map center
   * _basemap sets type of map
   * _loaded provides map loaded status
   */
  private _zoom = 15;
  private _center: Array<number> = [-121.841574, 47.518784]; //
  private _basemap = 'topo';
  private _loaded = false;
  private _view: MapView = null;

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  constructor() {
  } // private identityManager: IdentityManagementService) { }

  async initializeMap() {
    try {
      esriConfig.portalUrl = environment.portalSetting.url;

      // Configure the Map
      // const mapProperties = {
      //   basemap: this._basemap
      // };

      // const map: Map = new Map(mapProperties);

      const webMap = new WebMap({
        portalItem: { // autocasts as new PortalItem()
          // id: 'e691172598f04ea8881cd2a4adaa45ba'
          id: environment.portalSetting.mapId
        }
      });

      // Initialize the MapView
      const mapViewProperties = {
        container: this.mapViewEl.nativeElement,
        // center: this._center,
        // zoom: this._zoom,
        map: webMap
      };

      this._view = new MapView(mapViewProperties);

      // BaseMap Gallery
      /*
      const basemapGalleryWidget = new BasemapGallery({
        view: this._view
      });
      const baseMapExpand = new Expand({
       expandIconClass: 'esri-icon-basemap',
       view: this._view,
       expandTooltip: 'Basemap Gallery',
       content: basemapGalleryWidget
      });
      this._view.ui.add(baseMapExpand, 'top-left');
      */

      // wait for the map to load
      await this._view.when();
      return this._view;
    } catch (error) {
      console.log('EsriLoader: ', error);
    }
  }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(mapView => {
      console.log('mapView ready: ', this._view.ready);
      this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true);
      this.addHome();  // Home button
      this.addBasemapGallery();  // Basemap Gallery
      // Add parcels
      console.log('layers: ', this._view.map.allLayers);

      this._view.on('click', event => {
        const screenPoint = {
          x: event.x,
          y: event.y
        };
        this._view.hitTest(screenPoint).then( (response: any)  => {
          console.log(screenPoint);
          console.log(response);
          if (response.results.length) {
            const graphic = response.results.filter((result: any) => {
              console.log(result.graphic.layer);
              return result.graphic.layer === 'Snoq_Survey_1147';
            })[0].graphic;
            console.log(graphic.attributes);
          }
        });
      });
    });
  }

  addHome() {
    const homeBtn = new Home({  // Home button
      view: this._view
    });
    this._view.ui.add(homeBtn, 'top-left');  // Add to top left corner of view
  }

  addBasemapGallery() {
    const basemapGalleryWidget = new BasemapGallery({
      view: this._view
    });
    const baseMapExpand = new Expand({
      expandIconClass: 'esri-icon-basemap',
      view: this._view,
      expandTooltip: 'Basemap Gallery',
      content: basemapGalleryWidget
    });
    this._view.ui.add(baseMapExpand, 'top-left');

    const layerList = new LayerList({
      view: this._view,
      listItemCreatedFunction(event) {
        const item = event.item;
        if (item.layer.type !== 'group') {
          // don't show legend twice
          item.panel = {
            content: 'legend',
            open: true
          };
        }
      }
    });
    const layerListExpand = new Expand({
      expandIconClass: 'esri-icon-layers',
      view: this._view,
      expandTooltip: 'Layer List',
      content: layerList
    });
    this._view.ui.add(layerListExpand, 'top-right');

  }

  ngOnDestroy() {
    if (this._view) {
      this._view.container = null;  // destroy the map view
    }
  }
}
