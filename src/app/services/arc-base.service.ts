import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {environment} from '../../environments/environment';
import FeatureLayer from 'arcgis-js-api/layers/FeatureLayer';
import Query from 'arcgis-js-api/tasks/support/Query';
import StatisticDefinition from 'arcgis-js-api/tasks/support/StatisticDefinition';
import projection from 'arcgis-js-api/geometry/projection';
import {finalize, map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DataSource} from '@angular/cdk/collections';

export abstract class ArcBaseService {
  loading: boolean;
  foreignKeyField: string;
  layer: FeatureLayer;
  layerIsLoaded: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  listenerActive: boolean;
  listener;
  meta;
  filter: Query;
  count: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  currentPage = 0;
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  datasource: BaseDataSource;


  constructor(url: string, public snackBar: MatSnackBar) {
    this.datasource = new BaseDataSource(this);
    this.filter = {num: 25, start: 0};
    this.layer = new FeatureLayer(`${environment.rest_setting.url}${url}`, {
      outFields: ['*'],
      mode: FeatureLayer.MODE_SNAPSHOT
    });
    this.layer.when(() => {
      this.meta = this.prep_fields_meta(this.layer.fields);
      this.layerIsLoaded.next(true);
      this.layerIsLoaded.complete();
    });
  }

  private save(feature, type, quiet = false) {
    return new Observable(obs => {
      if (feature.geometry !== null && feature.geometry !== undefined && feature.geometry.type === 'polygon' && feature.geometry.isSelfIntersecting()) {
        obs.error('Polygons cannot be self intersecting.');
      } else {
        this.layerIsLoaded.subscribe(() => {
          // const tempFeature = new graphic({attributes: feature.attributes});
          // this.projectPoint(feature.coordinates, new sr(3857)).subscribe(point => {
          //   if (point !== undefined) tempFeature.geometry = point;
          //   else tempFeature.geometry = feature.geometry;
          // get geometry to null if its empty so the server does not reject it
          const features = this.prepForServer([feature.clone()]);
          if (type === 'add') {
            this.layer.applyEdits(features, null, null).then(results => {
              obs.next(results);
              if (!quiet) {
                this.openSnackBar('Added!', '');
              }
            }).catch(e => {
              const details = e.details !== undefined ? e.details[0] : '';
              this.openSnackBar(`${e.toString()} ${details}`, '');
              obs.error(e);
            });
          } else if (type === 'update') {
            this.layer.applyEdits(null, features, null).then(([addResults, updateResults]) => {
              obs.next(updateResults);
              if (!quiet) {
                this.openSnackBar('Updated!', '');
              }
            }).catch(e => {
              this.openSnackBar(e.toString() + ' ' + e.details[0], '');
              obs.error(e);
            });
          }
          // });
        });
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  private prep_fields_meta(fields) {
    const fieldsMeta = {};
    this.layer.fields.forEach(field => {
      fieldsMeta[field.name] = field;
    });
    return fieldsMeta;
  }

  query() {
    return new Observable<any>(observer => {
      this.layerIsLoaded.subscribe(() => {

        this.loading = true;

        this.layer.queryFeatures(this.filter).then(featureSet => {
          // featureSet.features.forEach(function (feature, i) {
          //   featureSet.features[i] =
          // })

          // featureSet.features.fields = this.prep_fields_meta();
          featureSet.features = this.convertFromEpoch(featureSet.features);
          observer.next(featureSet.features);
          this.layer.queryCount(this.filter).then(count => {
            this.count.next(count);
          });
          observer.complete();
        }).catch(e => {
          this.openSnackBar(e.toString() + ' ' + e.details[0], '');
          observer.error(e);
        });
      });
    });
  }

  queryMax() {
    const vm = this;
    return new Observable<any>(observer => {
      this.layerIsLoaded.subscribe(() => {
        const q: Query = {};
        const statDef = new StatisticDefinition();
        this.loading = true;
        statDef.statisticType = 'max';
        statDef.onStatisticField = 'ProjectNumber';
        statDef.outStatisticFieldName = 'ProjectNumMAX';
        q.returnGeometry = false;
        q.where = '1=1';
        q.outFields = ['*'];
        q.outStatistics = [statDef];
        this.layer.queryFeatures(q).then(featureSet => {
          observer.next(featureSet.features);
          observer.complete();
        }).catch(e => {
          vm.openSnackBar(e.toString() + ' ' + e.details[0], '');
          observer.error(e);
        });
      });
    });
  }

  projectPoint(point, outSR = {wkid: 4326}) {
    return new Observable<any>(observer => {
      projection.load().then(() => {
        projection.project(point, outSR).then(projectedPoint => {
          observer.next(projectedPoint);
        });
      });
    });
  }

  // todo: move to wherever the mapview is maintained
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

  convertFromEpoch(features) {
    const vm = this;
    const keys = Object.keys(this.meta);
    features.map(feature => {
      for (const key of keys) {
        if (vm.meta[key].type === 'esriFieldTypeDate' && feature.attributes[key] !== null) {
          if (feature.attributes[key] === -2209132800000) {
            feature.attributes[key] = null;
          } else {
            feature.attributes[key] = new Date(feature.attributes[key]);
          }
        }
      }
    });
    return features;
  }

  prepForServer(features) {
    const vm = this;
    const keys = Object.keys(this.meta);
    features.map(feature => {
      for (const key of keys) {
        if (vm.meta[key].type === 'esriFieldTypeDate' && feature.attributes[key] instanceof Date) {
          feature.attributes[key] = feature.attributes[key].getTime();
        }
      }
      // if (feature.geometry.type === 'polygon' && feature.geometry.rings.length === 0) delete feature.geometry;
    });
    return features;
  }

  addFeature(feature, quiet = false) {
    return this.save(feature, 'add', quiet);
  }

  updateFeature(feature) {
    return this.save(feature, 'update');
  }

  delete(feature) {
    return new Observable(obs => {
      this.layer.applyEdits(null, null, [feature]).then(([a, b, results]) => {
        obs.next(results);
      }).catch(e => {
        this.openSnackBar(e.toString() + ' ' + e.details[0], '');
        obs.error(e);
      });
    });
  }

  addClickListener(callback) {
    this.listener = this.layer.on('click', callback);
    this.listenerActive = true;
  }

  removeClickListener() {
    this.listener.remove();
  }

  get data(): any[] {
    return this.dataChange.value;
  }

  getItems() {
    // this.loadingService.show();
    return this.query().pipe(
      map(features => {
        this.dataChange.next(features);
      }),
      // finalize(() => this.loadingService.hide())
    );
  }

  getPage(event) {
    // this.loadingService.setLoading(true);
    this.filter.start = event.pageIndex * event.pageSize;
    this.filter.num = event.pageSize;
    this.getItems()
      .subscribe();
  }

  getAttachments(objectId: number) {
    return new Observable(obs => {
      this.layer.queryAttachments({objectIds: [objectId]}).then(attachments => {
        attachments.forEach(attachment => {
          if (attachment.contentType.substring(0, 5) === 'image') {
            attachment.previewUrl = attachment.url;
          } else {
            attachment.previewUrl = 'assets/images/Very-Basic-File-icon.png';
            attachment.extension = attachment.name.split('.').pop();
          }
        });
        obs.next(attachments);
      });
    });
  }

  uploadAttachments(graphic: __esri.Graphic, data) {
    return new Observable(obs => {
      this.layer.addAttachment(graphic, data).then(result => {
        obs.next(result.attachmentId);
        this.openSnackBar('Attachment Added!', '');
      }).catch(e => {
        this.openSnackBar(e.toString() + ' ' + e.details[0], '');
        obs.error(e);
      });
    });
  }


  deleteAttachments(graphic: __esri.Graphic, attachmentId: number) {
    return new Observable(obs => {
      this.layer.deleteAttachments(graphic, [attachmentId]).then(response => {
        obs.next(response);
        this.openSnackBar('Attachment Deleted!', '');
      }).catch(e => {
        this.openSnackBar(e.toString() + ' ' + e.details[0], '');
        obs.error(e);
      });
    });
  }


}


export class BaseDataSource extends DataSource<any> {
  constructor(private projectDatabase: ArcBaseService) {
    super();
  }

  connect(): Observable<any[]> {
    return this.projectDatabase.dataChange;
  }

  disconnect() {
  }
}
