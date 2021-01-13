import Polygon from '@arcgis/core/geometry/Polygon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from './../services/loading.service';
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
import Map from '@arcgis/core/Map'; // Map instance
import MapView from '@arcgis/core/views/MapView'; // 2D view of a Map instance
import WebMap from '@arcgis/core/WebMap';
import Home from '@arcgis/core/widgets/Home'; // Home button
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery'; // Basemap Gallery
import Search from '@arcgis/core/widgets/Search';

import Expand from '@arcgis/core/widgets/Expand'; // clickable button for opening a widget
import LayerList from '@arcgis/core/widgets/LayerList';
import FeatureTable from '@arcgis/core/widgets/FeatureTable';
import esriConfig from '@arcgis/core/config';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import * as projection from '@arcgis/core/geometry/projection';
import Graphic from '@arcgis/core/Graphic';
// import {IdentityManagementService} from '../services/identity-management.service';
import { ActivatedRoute, Router, NavigationEnd, ParamMap, Params } from '@angular/router';
import LayerView = __esri.LayerView;
import FeatureLayerView = __esri.FeatureLayerView;
import Handle = __esri.Handle;
import Geometry from '@arcgis/core/geometry/Geometry';
import { ProjectService } from '../services/project.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first, switchMap, tap } from 'rxjs/operators';
import { zip } from 'rxjs';
import { ArcBaseService } from '../services/arc-base.service';
import Zoom from '@arcgis/core/widgets/Zoom';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

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
  mode = 'none'; // options: none, add, complete, edit, featureSelected, select
  spatialSelect = false;
  private params: Params;
  createGraphic: any;
  private dupProjService: ArcBaseService;


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

  constructor(public router: Router, public route: ActivatedRoute, public projectService: ProjectService, public dialog: MatDialog, public loadingService: LoadingService, public snackBar: MatSnackBar) {
    this.dupProjService = new ArcBaseService(environment.layers.review, snackBar, loadingService);

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
      // if this.mode
      // const defaultParams: Params;
      // defaultParams = { mode: 'none' };
      // this.updateQueryParams(defaultParams);
      // this.cancelFeature();
      // this.mode = 'none';
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
        this.updateQueryParams({ mode: this.mode });
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
    }
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
              const featLayer = layer as FeatureLayer;
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
          if (this.mode === 'add') {
            this.onGraphicCreate(evt);
          } else {
            this.onCompleteSelection(evt);
          }
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
        this.projectService.updateFeature(this.createGraphic).subscribe((results: Array<any>) => {
          console.log(results);
          this.mode = 'featureSelected';
          this.updateQueryParams({ mode: this.mode });
        });
      });
      this.mode = 'featureSelected';
      this.updateQueryParams({ mode: this.mode });
    }
  }

  onGraphicCreate(event: any) {
    if (event.state === 'complete') {
      console.log('create complete', event);
      this.mode = 'complete';
      this.updateQueryParams({ mode: this.mode });
      this.createGraphic = event.graphic;
    }
  }

  onCompleteSelection(event: any) {
    if (event.state === 'complete') {
      console.log('select complete', event);
      this.mode = 'complete';
      this.updateQueryParams({ mode: this.mode });
      // this.projectService.filter.geometry = this.filter.geometry.fromJSON();

      // this.projectService.geometry = JSON.stringify(event.graphic.geometry.toJSON());
      this.projectService.geometry = event.graphic.geometry as Polygon;


      // this.projectService.filter.geometry = Polygon.fromJSON(event.graphic.geometry.toJSON());
      // this.dupProjService.filter.returnIdsOnly = true;
      // this.dupProjService.filter.outFields = 'OBJECTID';
      this.updateQueryParams({ mode: 'none' });
      this.sketchViewModel.complete();

      this.projectService.getItems().subscribe();
    }
  }

  zngDoCheck() {
    this._id = this.route.snapshot.children[0].paramMap.get('id');
    console.log(this._id);
    if (this._id) {
      this.highlightFeature(this._id);
      this.mode = 'featureSelected';
      this.updateQueryParams({ mode: this.mode });
    }
  }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(mapView => {
      this._highLightLayer = this._view.map.allLayers.find(v => v.title === environment.mapLayerName);
      console.log('_highlight ready: ', this._highLightLayer);
      this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true);
      this._view.ui.components = ['attribution']; // prevent zoom from loading so it can be placed lower
      this.addWidgets();
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
            this.updateQueryParams({ mode: this.mode });
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
        // first(),
        switchMap((params: ParamMap) => {
          this.applyQueryParams(params);
          const relevantKeys = params.keys.filter(key => !['page', 'page_size', 'ordering', 'table_visible'].includes(key));
          // if (relevant_keys.length > 0) {
          //   this.apply_next_extent = true;
          //   this.apply_highlighting = true;
          // }
          return zip(
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
      // this.dupProjService.dataChange.pipe(tap(() => {
      //   if (this.dupProjService.data.length > 0) {
      //     console.log(this.dupProjService);
      //     console.log(this.projectService.filter);

      //   }
      //   // this.updateQueryParams(this.projectService.filter);
      // })).subscribe();
    });
  }

  updateQueryParams(queryParam: Params) {
    // if (queryParam.hasOwnProperty('mine_globalid_in')) {
    //   queryParam = { ...queryParam };
    //   delete queryParam.mine_globalid_in;
    // }

    if (queryParam.hasOwnProperty('mode')) { this.mode = queryParam.mode; }

    this.router.navigate([], { queryParams: queryParam, queryParamsHandling: 'merge' });
  }

  applyQueryParams(params: ParamMap) {
    if (params.has('mode')) {
      this.mode = params.get('mode');
    } else {
      this.mode = 'none';
      this.updateQueryParams({ mode: this.mode });
    }
    for (const key of params.keys) {
      if (!['table_visible', 'mine_globalid_in', 'chapter'].includes(key)) {
        this.projectService.filter[key] = params.get(key);
        if (params.get(key) === 'true') { this.projectService.filter[key] = true; }
        if (params.get(key) === 'false') { this.projectService.filter[key] = false; }
      }
      if (['mode'].includes(key)) {
        if (params.get(key) === 'select') { this.enterSelectMode(); }
      }
      if (['spatialSelect'].includes(key)) {
        if (params.get(key) === 'false') { this.exitSelectMode(); }
      }
    }
  }

  enterSelectMode() {
    console.log('enable select');
    this.graphicsLayer.removeAll();
    this.sketchViewModel.create('rectangle');
  }

  exitSelectMode() {
    console.log('exit select');
    this.graphicsLayer.removeAll();
    this.sketchViewModel.complete();
  }

  addWidgets() {
    const search = new Search({
      view: this._view
    });
    this._view.ui.add(search, 'top-left');

    const zoom = new Zoom({
      view: this._view
    });
    this._view.ui.add(zoom, 'top-left');

    const homeBtn = new Home({  // Home button
      view: this._view
    });
    this._view.ui.add(homeBtn, 'top-left');  // Add to top left corner of view

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

    this._view.ui.add('sketchPanel', 'top-right'); // used for map icons
  }

  enterDeleteMode() {
    console.log('delete dialog');
    // this.mode = 'delete';
    this.delete();
  }

  enterAddMode(params: Params) {
    console.log('sketch mode');
    this.updateQueryParams(params);
    this.editLyr.opacity = .2;
    this.sketchViewModel.create('polygon', { mode: 'hybrid' });
  }

  saveNewFeature() {
    console.log('save new feature');
    this.editLyr.opacity = .5;
    this.graphicsLayer.removeAll();

    if (this.mode === 'complete') {
      this.projectService.addFeature(this.createGraphic).subscribe((results: Array<any>) => {
        const globalId = results[0].globalId;
        if (this._highlightHandler) {
          this._highlightHandler.remove();
        }
        this.mode = 'featureSelected';
        this.updateQueryParams({ mode: this.mode });
        this.projectService.editing = true;
        this._view.goTo(this.createGraphic);
        this.router.navigate(['/app/edit', globalId]);
      });
    } else {
      this.sketchViewModel.complete();
    }
  }

  editFeature() {
    console.log('edit feature');
    this.mode = 'edit';
    this.updateQueryParams({ mode: this.mode });
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
      this.updateQueryParams({ mode: this.mode });
    } else {
      this.mode = 'none';
      this.updateQueryParams({ mode: this.mode });
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
        this.projectService.delete(this._selectedFeature).subscribe(() => {
          this.updateQueryParams({ mode: 'none' });
          this.router.navigate(['/app/projects']);
        });
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
