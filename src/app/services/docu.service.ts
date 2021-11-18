import {Injectable} from '@angular/core';
import {ArcBaseService} from './arc-base.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoadingService} from './loading.service';
import {Observable} from 'rxjs';
import {Project} from './project.service';
import {environment} from '../../environments/environment';





@Injectable({
  providedIn: 'root'
})
export class DocuService extends ArcBaseService {

  constructor(snackBar: MatSnackBar, loadingService: LoadingService) {
    super(environment.layers.docu, snackBar, loadingService);
  }

  create_new_docs() {
    // const vm = this;
    // const project = new Project();
    // const config = new ConfigService();
    return new Observable<Project>(obs => {
      this.layerIsLoaded.subscribe(() => {
        // loadModules(['@arcgis/core/graphic', '@arcgis/core/geometry/Polygon', '@arcgis/core/SpatialReference'], environment.jsapiConfig).then(([Graphic, Polygon, SpatialReference]) => {
        // const project = new Graphic(this.layer.templates[0].toJSON());
        // project.setSymbol(this.layer.renderer.getSymbol());
        // project.setGeometry(new Polygon(new SpatialReference(3857)));
        // project.attributes.GlobalID = 'new';
        // obs.next(project);
        // obs.complete();
      });
    });
    // });
  }
}
