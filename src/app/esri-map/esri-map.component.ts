import { environment, url } from './../../environments/environment.prod';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy, OnChanges, SimpleChanges, Inject

} from '@angular/core';

// Load modules from the Esri ArcGIS API for JavaScript
import Map from 'esri/Map'; // Map instance
import MapView from 'esri/views/MapView'; // 2D view of a Map instance
import WebMap from 'esri/WebMap';
import Home from 'esri/widgets/Home'; // Home button
import BasemapGallery from 'esri/widgets/BasemapGallery'; // Basemap Gallery
import Search from 'esri/widgets/Search';

import Expand from 'esri/widgets/Expand'; // clickable button for opening a widget
import LayerList from 'esri/widgets/LayerList';
import FeatureTable from 'esri/widgets/FeatureTable';
import esriConfig from 'esri/config';
import SketchViewModel from 'esri/widgets/Sketch/SketchViewModel';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import * as projection from 'esri/geometry/projection';
import Graphic from 'esri/Graphic';
// import {IdentityManagementService} from '../services/identity-management.service';
import { ActivatedRoute, Router, NavigationEnd, ParamMap, Params } from '@angular/router';
import LayerView = __esri.LayerView;
import FeatureLayerView = __esri.FeatureLayerView;
import Handle = __esri.Handle;
import Geometry from 'esri/geometry/Geometry';
import { ProjectService } from '../services/project.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first, switchMap, tap } from 'rxjs/operators';
import { zip } from 'rxjs';

// import {ProjectService} from '../services/project.service';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})

export class EsriMapComponent implements OnInit, OnDestroy, OnChanges {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();
  navigationSubscription: any;
  // The <div> where we will place the map
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

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
  private _highLightLayer: any; // FeatureLayerView;
  private _highlightHandler: Handle;
  private _id: any;
  private _selectedFeature: any;
  private sketchViewModel: any;
  private graphicsLayer: any;
  private editLyr: any;
  mode = 'none'; // options: none, add, complete, edit, featureSelected
  createGraphic: any;


  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input() highlightSelectFeature: string;

  @Input() selectMode: boolean;

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

  constructor(public router: Router, public route: ActivatedRoute, public projectService: ProjectService, public dialog: MatDialog) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.refreshMap();
      }
    });
  } // private identityManager: IdentityManagementService) { }

  refreshMap() {
    // Set default values and re-fetch any data you need.
    if ((this.router.url.indexOf('/app/projects') > -1) && (this._loaded)) {
      console.log('init map');
      if (this._highlightHandler) {
        this._highlightHandler.remove();
      }
      this.cancelFeature();
      this.mode = 'none';
      this._view.goTo({ zoom: this._zoom, center: this._center });

    }
  }

  highlightFeature(id: string) {
    console.log('highlight run');
    let biskit: any;
    this._view.whenLayerView(this._highLightLayer).then((layerView: any) => {
      this._highLightLayer.queryFeatures({ where: `globalid='${id}'`, outFields: '*', returnGeometry: true }).then((result: any) => {
        if (this._highlightHandler) {
          this._highlightHandler.remove();
        }
        this._highlightHandler = layerView.highlight(result.features);
        if (result.geometryType === 'point') {
          biskit = result.features;

        } else {
          biskit = result.features[0].geometry;
          this._selectedFeature = result.features[0];
        }
        console.log('biskit', biskit);
        this._view.goTo(biskit).catch((error: any) => {
          console.log(error);
        });
        this.mode = 'featureSelected';
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // from Travis,
    //     changes.highlightSelectFeature
    // changes.highlightSelectFeature = {newValue, oldValue}
    console.log(changes);
    if (changes.hasOwnProperty('highlightSelectFeature')) {
      if (changes.highlightSelectFeature.previousValue !== changes.highlightSelectFeature.currentValue && changes.highlightSelectFeature.currentValue !== null) {
        this.highlightFeature(changes.highlightSelectFeature.currentValue);
      }
    } else if (changes.hasOwnProperty('selectMode')) {
      if (changes.selectMode.currentValue === true) {
        this.turnOnSelect();
      }
    }
  }

  turnOnSelect() {
    console.log('turnOnSelect');
  }

  async initializeMap() {
    try {
      esriConfig.portalUrl = environment.portalSetting.url;

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
      await this._view.when(() => {
        this.graphicsLayer = new GraphicsLayer();
        this._view.map.add(this.graphicsLayer);
        this.sketchViewModel = new SketchViewModel({
          view: this._view,
          layer: this.graphicsLayer,
          updateOnGraphicClick: false,
          defaultUpdateOptions: {
            // set the default options for the update operations
            toggleToolOnClick: false // only reshape operation will be enabled
          },
          defaultCreateOptions: {
            mode: 'hybrid'
          }
        });

        this.sketchViewModel.on('update', (evt: any) => {
          this.onGraphicUpdate(evt);
        });
        this.sketchViewModel.on('create', (evt: any) => {
          this.onGraphicCreate(evt);
        });

        this.editLyr = this._view.map.allLayers.find((layer: any) => {
          const lyrUrl = `${layer.url}/${layer.layerId}`;
          return environment.layers.review === lyrUrl;
        });
      });

      return this._view;
    } catch (error) {
      console.log('EsriLoader: ', error);
    }
  }

  onGraphicUpdate(event: any) {
    if (event.state === 'complete' && !event.aborted) {
      console.log(event);
      // save
      projection.load().then(() => {
        const geometry = projection.project(event.graphics[0].geometry, this.editLyr.spatialReference) as Geometry;
        const tempGraphic = new Graphic();
        tempGraphic.geometry = geometry;
        tempGraphic.attributes = { ObjectId: this._selectedFeature.attributes.OBJECTID };
        this._selectedFeature.geometry = geometry;
        this.editLyr.applyEdits({ updateFeatures: [tempGraphic] }).then((results: any) => {
          console.log(results);
          this.mode = 'featureSelected';
        });
      });
      this.mode = 'featureSelected';
    }
  }

  onGraphicCreate(event: any) {
    if (event.state === 'complete') {
      console.log('create complete', event);
      this.mode = 'complete';
      this.createGraphic = event.graphic;
    }
  }

  zngDoCheck() {
    this._id = this.route.snapshot.children[0].paramMap.get('id');
    console.log(this._id);
    if (this._id) {
      this.highlightFeature(this._id);
      this.mode = 'featureSelected';
    }
  }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(mapView => {
      this._highLightLayer = this._view.map.allLayers.find(v => v.title === environment.mapLayerName);
      console.log('_highlight ready: ', this._highLightLayer);
      this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true);
      this.addHome();  // Home button
      this.addBasemapGallery();  // Basemap Gallery
      this.addSearch();
      this._view.on('click', event => {
        this._view.hitTest(event).then((response: any) => {
          if (response.results.length) {
            const graphic = response.results.filter((result: any) => {
              return result.graphic.layer.url.includes(url);
            })[0].graphic;
            if (this._highlightHandler) {
              this._highlightHandler.remove();
            }
            // this._view.goTo(graphic);
            this.mode = 'featureSelected';
            this.router.navigate(['/app/edit', graphic.attributes.globalid]);
          }
        })
          .catch(e => {
          });
      });

      // this._view.on('pointer-move', evt => {
      //   if (this.mode === 'delete') {
      //     const screenPoint = {
      //       x: evt.x,
      //       y: evt.y
      //     };

      //     this._view.hitTest(screenPoint)
      //       .then(response => {
      //         // this.changeCursor(response);
      //         this.getGraphics(response);
      //       });
      //   }
      // });

    }).then(() => {
      this.zngDoCheck();
      this._center = [this._view.center.longitude, this._view.center.latitude];
      this._zoom = this._view.zoom;


      this.route.queryParamMap.pipe(
        first(),
        switchMap((params: ParamMap) => {
          this.applyQueryParams(params);
          const relevantKeys = params.keys.filter(key => !['page', 'page_size', 'ordering', 'table_visible'].includes(key));
          // if (relevant_keys.length > 0) {
          //   this.apply_next_extent = true;
          //   this.apply_highlighting = true;
          // }
          return zip (
          //   this.projectService.fullResponse.pipe(
          //     filter(() => {
          //       const proceed = this.applyNextExtent;
          //       this.applyNextExtent = true;
          //       return proceed;
          //     }),
          //     tap(results => {
          //       //this.extent = results['extent'];
          //       //this.tableVisibility(true);
          //     }),
          //     filter(() => {
          //       const proceed = this.applyHighlighting;
          //       this.applyHighlighting = true;
          //       return proceed;
          //     }),
          //     tap(results => this.setHighlighting(results['pks']))
          //   ),
          //   this.runSearch()
          );
        })
      ).subscribe();
      this.projectService.dataChange.pipe(tap(() => {
        this.updateQueryParams(this.projectService.filter);
      })).subscribe();
    });
  }

  updateQueryParams(queryParam: Params) {
    if (queryParam.hasOwnProperty('mine_globalid_in')) {
      queryParam = { ...queryParam };
      delete queryParam.mine_globalid_in;
    }
    // queryParam.select = this.selectMode;
    this.router.navigate([], { queryParams: queryParam, queryParamsHandling: 'merge' });
  }

  applyQueryParams(params: ParamMap) {
    for (const key of params.keys) {
      if (!['table_visible', 'mine_globalid_in', 'chapter'].includes(key)) {
        this.projectService.filter[key] = params.get(key);
        if (params.get(key) === 'true') { this.projectService.filter[key] = true; }
        if (params.get(key) === 'false') { this.projectService.filter[key] = false; }
      }
    }
  }


  // changeCursor(response: any) {
  //   if (response.results.length > 0) {
  //     response.results.forEach((graphic: { graphic: { layer: { url: any; }; }; }) => {
  //       if (graphic.graphic.layer === this.editLyr) {
  //         this.mapViewEl.nativeElement.style.cursor = 'pointer';
  //       }
  //     });
  //   } else {
  //     this.mapViewEl.nativeElement.style.cursor = 'default';
  //   }
  // }

  // getGraphics(response: any) {
  //   // let highlightSelect: any;
  //   if (response.results.length > 0) {
  //     response.results.forEach((graphic: any) => {
  //       const selectedGraphic = graphic.graphic;

  //       if (selectedGraphic.layer === this.editLyr) {
  //         this.mapViewEl.nativeElement.style.cursor = 'pointer';

  //         // symbolize all line segments with the given
  //         // storm name with the same symbol
  //         const highlightSymbol = new SimpleFillSymbol({
  //           outline: { width: 1.5, color: [253, 18, 18, 1] },
  //           color: [0, 0, 0, 0]
  //         });

  //         // this._view.whenLayerView(selectedGraphic.layer).then(layerView => {
  //         //   highlightSelect = layerView.highlight(selectedGraphic);
  //         // });


  //         const highlightGraphic = new Graphic({geometry: selectedGraphic.geometry, symbol: highlightSymbol});

  //         this.graphicsLayer.add(highlightGraphic);
  //       }
  //     });
  //   } else {
  //     this._view.whenLayerView(this.editLyr).then(layerView => {
  //       // if (highlightSelect) {
  //       //   highlightSelect.remove();
  //       // }
  //       this.mapViewEl.nativeElement.style.cursor = 'default';

  //       this.graphicsLayer.removeAll();
  //     });
  //   }
  // }

  addHome() {
    const homeBtn = new Home({  // Home button
      view: this._view
    });
    this._view.ui.add(homeBtn, 'top-left');  // Add to top left corner of view
  }

  addSearch() {
    const search = new Search({
      view: this._view
    });
    this._view.ui.add(search, 'top-right');  // Add to top left corner of view
  }

  addEditing() {
    const sketchViewModel = new SketchViewModel({
      view: this._view,
      updateOnGraphicClick: false,
      defaultUpdateOptions: {
        // set the default options for the update operations
        toggleToolOnClick: false // only reshape operation will be enabled
      }
    });
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
    this._view.ui.add(layerListExpand, 'top-left');
    this._view.ui.add('sketchPanel', 'top-right');
  }

  enterDeleteMode() {
    console.log('delete dialog');
    // this.mode = 'delete';
    this.delete();
  }

  enterSketchMode(params: Params) {
    console.log('sketch mode');
    this.updateQueryParams(params);

    this.mode = 'add';
    this.editLyr.opacity = .2;
    this.sketchViewModel.create('polygon', { mode: 'hybrid' });
    // this._view.ui.add('instructions', 'top-right');
  }

  saveNewFeature() {
    console.log('save new feature');
    // this._view.ui.remove('instructions');
    this.editLyr.opacity = .5;
    this.graphicsLayer.removeAll();

    if (this.mode === 'complete') {
      this.editLyr.applyEdits({ addFeatures: [this.createGraphic] }).then((results: any) => {
        console.log(results);
        if (results.addFeatureResults.length) {
          const objectId = results.addFeatureResults[0].objectId;
          const globalId = results.addFeatureResults[0].globalId;

          if (this._highlightHandler) {
            this._highlightHandler.remove();
          }
          this.mode = 'featureSelected';
          this.projectService.editing = false;
          this._view.goTo(this.createGraphic);
          this.router.navigate(['/app/edit', globalId]);
        }
      });
    } else {
      this.sketchViewModel.complete();
    }
  }

  editFeature() {
    console.log('edit feature');
    this.mode = 'edit';
    this.editLyr.opacity = .2;
    projection.load().then(() => {
      const geometry = projection.project(this._selectedFeature.geometry, this._view.spatialReference) as Geometry;

      const tempGraphic = new Graphic();
      tempGraphic.geometry = geometry;
      this.graphicsLayer.add(tempGraphic);
      this.sketchViewModel.update([tempGraphic], { tool: 'reshape' });
    });
  }

  cancelFeature() {
    console.log('cancel feature');
    // this._view.ui.remove('instructions');
    this.sketchViewModel.cancel();
    this.editLyr.opacity = .5;
    this.graphicsLayer.removeAll();
    if (this.mode === 'edit') {
      this.mode = 'featureSelected';
    } else {
      this.mode = 'none';
    }
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if (this._view) {
      this._view.container = null;  // destroy the map view
    }
  }

  delete() {
    const dialogRef = this.dialog.open(DeleteSiteComponent, {
      width: '400px',
      height: '330px' // ,
      // data: {date: element.attributes?.INV_InvoiceDate, invoiceID: element.attributes?.OBJECTID,
      //       encroachmentID: element.attributes?.INV_EncID, permitID: element.attributes?.INV_PermitID}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.projectService.delete(this._selectedFeature);
      }
    });
  }
}

@Component({
  selector: 'app-delete-site',
  templateUrl: 'delete-site.html',
})
export class DeleteSiteComponent {

  constructor(public dialogRef: MatDialogRef<DeleteSiteComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  close(ret: string) {
    this.dialogRef.close(ret);

    // routerLink="/app/projects"
  }
}
