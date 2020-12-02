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

class Attributes {
  OBJECTID: number | string;
  globalid: number | string;
  Reviewer_Name: string;
  Review_Name_Note: string;
  Date_Received: number;
  Reviewer_Department: string;
  ID_DAHP: number | string;
  ID_Initials: string;
  Notification_ID: number | string;
  ID_DAHP_full: string;
  Project_Name: string;
  Jurisdiction: string;
  Jurisdiction_other: string;
  Jurisdiction_Type: string;
  Project_Phase: string;
  Notification_Type: string;
  Note_Concern: string;
  Noti_Dept_Select: string;
  Noti_Dept_Select_other: string;
  Noti_Tribe: string;
  Noti_Tribe_Text: string;
  Location_Type: string;
  Abstract: string;
  Docu_YN: string;
  Docu_Repeat_count: number;
  Impact_YN: string;
  Enviro_Impact:string;
  Enviro_Impact_Type:string;
  Wetland_Likert:string;
  Aquatic_Likert:string;
  Storm_Likert:string;
  Veg_Likert: string;
  Watertype_Likert:string;
  Impact_Culture:string;
  Culture_Type:string;
  Culture_Note:string;
  CreationDate: number;
  Creator: string;
  EditDate: number;
  Editor: string;
}


export class Project {
  attributes: Attributes;
  geometry: any;
}

@Injectable()
export class ProjectService extends ArcBaseService {
  editing: boolean = true;

  constructor(snackBar: MatSnackBar, loadingService: LoadingService) {
   super(environment.layers.review, snackBar, loadingService);
  }


  create_new_project() {
    // const vm = this;
    // const project = new Project();
    // const config = new ConfigService();
    return new Observable<Project>(obs => {
      this.layerIsLoaded.subscribe(() => {
        // loadModules(['esri/graphic', 'esri/geometry/Polygon', 'esri/SpatialReference'], environment.jsapiConfig).then(([Graphic, Polygon, SpatialReference]) => {
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
