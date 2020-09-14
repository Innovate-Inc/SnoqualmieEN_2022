import {environment, url} from './../../environments/environment.prod';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy, OnChanges, SimpleChanges
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
import {Router} from '@angular/router';
import LayerView = __esri.LayerView;
import FeatureLayerView = __esri.FeatureLayerView;
import Handle = __esri.Handle;

// import {ProjectService} from '../services/project.service';


@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})

export class EsriMapComponent implements OnInit, OnDestroy, OnChanges {
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
  private _highLightLayer: FeatureLayerView;
  private _highlightHandler: Handle;

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input() highlightSelectFeature: string;

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

  constructor(public router: Router) {
  } // private identityManager: IdentityManagementService) { }

  highlightFeature(id: string) {
    console.log("WHAT the hell");
    this._highLightLayer.queryFeatures({where: `globalid='${id}'`}).then(result => {
      if (this._highlightHandler) {
        this._highlightHandler.remove();
      }
      this._highlightHandler = this._highLightLayer.highlight(result.features);
      this._view.goTo(result.features);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // from Travis,
    //     changes.highlightSelectFeature
    // changes.highlightSelectFeature = {newValue, oldValue}
    if (changes.hasOwnProperty('highlightSelectFeature')) {
      if (changes.highlightSelectFeature.previousValue !== changes.highlightSelectFeature.currentValue && changes.highlightSelectFeature.currentValue !== null) {
        console.log('changes:');
        console.log(changes);
        this.highlightFeature(changes.highlightSelectFeature.currentValue);
      }
    }
  }

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

      webMap.load()
        .then(() => {
          webMap.layers
            .filter(layer => layer.type === 'feature')
            .map(layer => {
              const featLayer = layer as __esri.FeatureLayer;
              featLayer.outFields = ['*'];
              return featLayer;
            });
        });
      this._view.map = webMap;
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
      //this._highLightLayer = mapView.layerViews.find(v => v.layer.title === 'Snoq_Survey - Review Tracking');
      console.log('mapView ready: ', this._view.ready);
      this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true);
      this.addHome();  // Home button
      this.addBasemapGallery();  // Basemap Gallery
      // Add parcels
      console.log('layers: ', this._view.map.allLayers);
      this._view.on('click', event => {
        // const screenPoint = {
        //   x: event.x,
        //   y: event.y
        // };
        this._view.hitTest(event).then((response: any) => {
          // console.log(screenPoint);
          // console.log(response);
          if (response.results.length) {
            const graphic = response.results.filter((result: any) => {
              // console.log(result);
              return result.graphic.layer.url.includes(url);
            })[0].graphic;
            this._view.goTo(graphic);
            this.router.navigate(['/app/edit', graphic.attributes.globalid]);
          }
        })
          .catch(e => {
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


// selectFeature(globalId, objectId, outFields = ['*']) {
  //   const vm = this;
  //   return new Observable<any>(obs => {
  //     this.layerIsLoaded.subscribe(() => {
  //       const q = new vm.Query();
  //
  //       if (globalId) {
  //         q.where = `GlobalID='${globalId}'`;
  //       } else if (objectId) {
  //         q.objectIds = [objectId];
  //       }
  //       q.outFields = outFields;
  //       this.layer.clearSelection();
  //       if (globalId || objectId) {
  //         this.layer.selectFeatures(q, FeatureLayer.SELECTION_NEW, function(features) {
  //           features = vm.convertFromEpoch(features);
  //           if (features[0].geometry !== null && features[0].geometry.rings.length === 0) {
  //             // features[0].setGeometry(new vm.Polygon(new vm.SpatialReference(3857)));
  //             features[0].setSymbol(vm.layer.renderer.getSymbol());
  //           }
  //           obs.next(features[0]);
  //         }, function(e) {
  //           vm.openSnackBar(e.toString() + ' ' + e.details[0], '');
  //           obs.error(e);
  //         });
  //       }
  //     });
  //   });
  // }

}
