import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";
import { environment } from "../../environments/environment";
import { finalize, map } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DataSource } from "@angular/cdk/collections";
import { LoadingService } from "./loading.service";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import StatisticDefinition from "@arcgis/core/tasks/support/StatisticDefinition";
import Polygon from "@arcgis/core/geometry/Polygon";
import Point from "@arcgis/core/geometry/Point";
import Query from "@arcgis/core/tasks/support/Query";
import { load, project } from "@arcgis/core/geometry/projection";
import Graphic from "@arcgis/core/Graphic";

export class ArcBaseService {
  loading: boolean;
  foreignKeyField: string;
  layer: FeatureLayer;
  layerIsLoaded: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  listenerActive: boolean;
  listener: any;
  meta: any;
  public filter: any;
  public params: any;
  count: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  currentPage = 0;
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  datasource: BaseDataSource;
  geometry: Polygon;
  dateStart: string;
  dateEnd: string;

  constructor(
    url: string,
    public snackBar: MatSnackBar,
    public loadingService: LoadingService
  ) {
    this.datasource = new BaseDataSource(this);
    this.filter = { num: 25, start: 0, outFields: ["*"], returnIdsOnly: false };
    this.params = {
      num: 25,
      start: 0,
      searchText: "",
      dateStart: "",
      dateEnd: "",
    };
    this.layer = new FeatureLayer({
      url,
      outFields: ["*"],
    });
    this.layer.load();
    this.layer.when(() => {
      this.meta = this.prep_fields_meta(this.layer.fields);
      this.layerIsLoaded.next(true);
      this.layerIsLoaded.complete();
    });
  }

  private save(feature: Graphic, type: string, quiet = false) {
    return new Observable((obs) => {
      // @ts-ignore
      if (
        feature.geometry !== null &&
        feature.geometry !== undefined &&
        feature.geometry.type === "polygon" &&
        (feature.geometry as any).isSelfIntersecting
      ) {
        obs.error("Polygons cannot be self intersecting.");
      } else {
        this.layerIsLoaded.subscribe(() => {
          // const tempFeature = new graphic({attributes: feature.attributes});
          // this.projectPoint(feature.coordinates, new sr(3857)).subscribe(point => {
          //   if (point !== undefined) tempFeature.geometry = point;
          //   else tempFeature.geometry = feature.geometry;
          // get geometry to null if its empty so the server does not reject it
          const features = this.prepForServer([feature.clone()]);
          if (type === "add") {
            this.layer
              .applyEdits({ addFeatures: features })
              .then((results) => {
                obs.next(results.addFeatureResults);
                if (!quiet) {
                  this.openSnackBar("Added!", "");
                }
              })
              .catch((e) => {
                const details = e.details !== undefined ? e.details[0] : "";
                this.openSnackBar(
                  `${e.toString()} ${details}`,
                  "Dismiss",
                  true
                );
                obs.error(e);
              });
          } else if (type === "update") {
            this.layer
              .applyEdits({ updateFeatures: features })
              .then((results) => {
                obs.next(results.updateFeatureResults);
                this.layer.refresh();
                if (!quiet) {
                  this.openSnackBar("Updated!", "");
                }
              })
              .catch((e) => {
                this.openSnackBar(
                  e.toString() + " " + e.details[0],
                  "Dismiss",
                  true
                );
                obs.error(e);
              });
          }
          // });
        });
      }
    });
  }

  openSnackBar(message: string, action: string, error = false) {
    this.snackBar.open(message, action, {
      duration: error ? null : 5000,
      panelClass: error ? ["error-snackbar"] : "",
    });
  }

  private prep_fields_meta(fields: any) {
    const fieldsMeta: { [index: string]: any } = {};
    this.layer.fields.forEach((field) => {
      fieldsMeta[field.name] = field;
    });
    return fieldsMeta;
  }

  query() {
    return new Observable<any>((observer) => {
      this.layerIsLoaded.subscribe(() => {
        this.loading = true;

        // let clonedFilter = { ...this.filter };
        if (this.geometry) {
          // const polyJSON = JSON.parse(this.geometry);
          // filter.geometry = Polygon.fromJSON(JSON.parse(this.geometry));
          this.filter.geometry = this.geometry; // Polygon.fromJSON(polyJSON);
        } else {
          this.filter.geometry = null;
        }

        this.layer
          .queryFeatures(this.filter)
          .then((featureSet) => {
            // featureSet.features.forEach(function (feature, i) {
            //   featureSet.features[i] =
            // })
            console.log("featureset: ", featureSet);

            // featureSet.features.fields = this.prep_fields_meta();
            featureSet.features = this.convertFromEpoch(featureSet.features);
            observer.next(featureSet.features);
            this.layer.queryFeatureCount(this.filter).then((count) => {
              this.count.next(count);
            });
            observer.complete();
          })
          .catch((e) => {
            this.openSnackBar(
              e.toString() + " " + e.details[0],
              "Dismiss",
              true
            );
            observer.error(e);
          });
      });
    });
  }

  queryMax() {
    const vm = this;
    return new Observable<any>((observer) => {
      this.layerIsLoaded.subscribe(() => {
        const q = {} as Query;
        const statDef = new StatisticDefinition();
        this.loading = true;
        statDef.statisticType = "max";
        statDef.onStatisticField = "ProjectNumber";
        statDef.outStatisticFieldName = "ProjectNumMAX";
        q.returnGeometry = false;
        q.where = "1=1";
        q.outFields = ["*"];
        q.outStatistics = [statDef];
        this.layer
          .queryFeatures(q)
          .then((featureSet) => {
            observer.next(featureSet.features);
            observer.complete();
          })
          .catch((e) => {
            vm.openSnackBar(e.toString() + " " + e.details[0], "Dismiss", true);
            observer.error(e);
          });
      });
    });
  }

  projectPoint(point: Point, outSR = { wkid: 4326 }) {
    return new Observable<any>((observer) => {
      load().then(() => {
        const projectedPoint = project(point, outSR);
        observer.next(projectedPoint);
      });
    });
  }

  // todo: move to wherever the mapview is maintained
  selectFeature(globalId: string, objectId: number, outFields = ["*"]) {
    const vm = this;
    return new Observable<any>((obs) => {
      this.layerIsLoaded.subscribe(() => {
        let q;
        if (globalId) {
          q = { where: `globalid='${globalId}'`, outFields };
        } else if (objectId) {
          q = { objectIds: [objectId], outFields };
        }
        if (globalId || objectId) {
          this.layer.queryFeatures(q).then(
            (featureSet) => {
              const features = vm.convertFromEpoch(featureSet.features);
              obs.next(features[0]);

              // this._view.goTo(featureSet.features);
            },
            (e) => {
              vm.openSnackBar(
                e.toString() + " " + e.details[0],
                "Dismiss",
                true
              );
              obs.error(e);
            }
          );
        }
      });
    });
  }

  convertFromEpoch(features: Graphic[]) {
    const keys = Object.keys(this.meta);
    features.map((feature) => {
      for (const key of keys) {
        if (
          this.meta[key].type === "date" &&
          feature.attributes[key] !== null
        ) {
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

  prepForServer(features: Graphic[]) {
    const keys = Object.keys(this.meta);
    features.map((feature) => {
      for (const key of keys) {
        if (
          this.meta[key].type === "date" &&
          feature.attributes &&
          feature.attributes[key] instanceof Date
        ) {
          feature.attributes[key] = feature.attributes[key].getTime();
        }
      }
      // if (feature.geometry.type === 'polygon' && feature.geometry.rings.length === 0) delete feature.geometry;
    });
    return features;
  }

  addFeature(feature: Graphic, quiet = false) {
    return this.save(feature, "add", quiet);
  }

  updateFeature(feature: Graphic) {
    return this.save(feature, "update");
  }

  delete(feature: Graphic) {
    return new Observable((obs) => {
      this.layer
        .applyEdits({ deleteFeatures: [feature] })
        .then((results) => {
          obs.next(results.deleteFeaturesResult);
          this.openSnackBar("Item deleted", "");
        })
        .catch((e) => {
          const details = e.details !== undefined ? e.details[0] : "";
          this.openSnackBar(`${e.toString()} ${details}`, "Dismiss", true);
          obs.error(e);
        });
    });
  }

  get data(): any[] {
    return this.dataChange.value;
  }

  getItems() {
    this.loadingService.show();
    return this.query().pipe(
      map((features) => {
        this.dataChange.next(features);
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  getPage(event: any) {
    // this.loadingService.setLoading(true);
    this.filter.start = event.pageIndex * event.pageSize;
    this.filter.num = event.pageSize;
    this.getItems().subscribe();
  }

  getAttachments(objectId: number) {
    return new Observable((obs) => {
      this.layer
        .queryAttachments({ objectIds: [objectId] })
        .then((attachments) => {
          if (attachments[objectId]) {
            attachments[objectId].forEach((attachment: any) => {
              if (attachment.contentType.substring(0, 5) === "image") {
                attachment.previewUrl = attachment.url;
              } else {
                attachment.previewUrl =
                  "assets/images/Very-Basic-File-icon.png";
                attachment.extension = attachment.name.split(".").pop();
              }
            });
            obs.next(attachments);
          }
        });
    });
  }

  uploadAttachments(graphic: Graphic, data: any) {
    return new Observable((obs) => {
      this.layer
        .addAttachment(graphic, data)
        .then((result) => {
          let objectId: number;
          if (result.objectId) {
            objectId = result.objectId;
          }
          obs.next(result.objectId);
          this.openSnackBar("Attachment Added!", "");
        })
        .catch((e) => {
          this.openSnackBar(e.error.message, "Dismiss", true);
          obs.error(e);
        });
    });
  }

  deleteAttachments(graphic: Graphic, attachmentId: number) {
    return new Observable((obs) => {
      this.layer
        .deleteAttachments(graphic, [attachmentId])
        .then((response) => {
          obs.next(response);
          this.openSnackBar("Attachment Deleted!", "");
        })
        .catch((e) => {
          this.openSnackBar(e.toString() + " " + e.details[0], "Dismiss", true);
          obs.error(e);
        });
    });
  }

  convertToDomainValue(val: any, field: string) {
    if (val && field) {
      const domain = this.meta[field].domain.codedValues.find(
        (x: any) => x.code === val
      );

      if (domain) {
        return domain.name;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }
  searchDomainValues(searchText: string, field: string) {
    if (searchText && field) {
      const domains = this.meta[field].domain.codedValues.filter(
        (x: __esri.CodedValue) =>
          x.name.toLowerCase().includes(searchText.toLowerCase())
      );
      return domains.map((x: __esri.CodedValue) => x.code);
    }
  }
}

export class BaseDataSource extends DataSource<any> {
  constructor(private projectDatabase: ArcBaseService) {
    super();
  }

  connect(): Observable<any[]> {
    return this.projectDatabase.dataChange;
  }

  disconnect() {}
}
