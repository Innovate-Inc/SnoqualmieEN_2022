import {Injectable} from '@angular/core';
import {ArcBaseService} from './arc-base.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable} from 'rxjs';
// import {Graphic} from 'esri/Graphic';

// import {loadModules} from 'esri-loader';
// import {ConfigService} from './config.service';
import {environment} from '../../environments/environment';

import {FormControl} from '@angular/forms';
import {LoadingService} from './loading.service';
// import Graphic = __esri.Graphic;
// import {Graphic}
import Graphic = __esri.Graphic;

class Attributes {
  ProjectNumber: number;
  Project_Name: string;
  Primary_Reviewer: number;
  Priority: string;
  Review_Status: string;
  Date_Received: string;
  Project_Start_Date: string;
  Project_Description: string;
  Proponent: string;
  Proponent_Number: string;
  Section_106: string;
  Lead_Agency: string;
  Agency_or_TCNS_Number: string;
  Other_Agency: string;
  Other_Agency_Number: string;
  Project_Actions: string;
  Expected_Ground_Disturbance: string;
  // Additional_Review_Needed: string;
  // Programs_for_Review: string;
  // Additional_Reviewers: string;
  Contact_Person: string;
  Contact_Info: string;
  Contract: string;
  Budget: string;
  Location: string;
  Land_Ownership: string;
  Comments: string;
  Category: string;
  GlobalID: number | string;
  OBJECTID: number | string;
  SHPO_Permit: number;
  notification: string;
}

export class Project {
  attributes: Attributes;
  geometry: any;
}

@Injectable()
export class ProjectService extends ArcBaseService {

  constructor(snackBar: MatSnackBar, loadingService: LoadingService) {
    super('0',
      snackBar, loadingService);
  }

  create_new_project() {
    // const vm = this;
    // const project = new Project();
    // const config = new ConfigService();
    return new Observable<Project>(obs => {
      this.layerIsLoaded.subscribe(() => {
        // loadModules(['esri/graphic', 'esri/geometry/Polygon', 'esri/SpatialReference'], environment.jsapi_config).then(([Graphic, Polygon, SpatialReference]) => {
        const project = new Graphic(this.layer.templates[0].toJSON());
        project.setSymbol(this.layer.renderer.getSymbol());
        project.setGeometry(new Polygon(new SpatialReference(3857)));
        project.attributes.GlobalID = 'new';
        obs.next(project);
        obs.complete();
      });
    });
    // });
  }
}
