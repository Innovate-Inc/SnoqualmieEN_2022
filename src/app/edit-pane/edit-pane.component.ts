import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, ParamMap, Params } from '@angular/router';
import { LoadingService } from '../services/loading.service';
import { DataService } from '../services/data.service';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ProjectService } from '../services/project.service';
import { environment } from '../../environments/environment';
import { zip } from 'rxjs';
import { ArcGpService } from '../services/arc-gp.service';
import IdentityManager from 'esri/identity/IdentityManager';
import Portal from 'esri/portal/Portal';
import moment from 'moment';

@Component({
  selector: 'app-edit-pane',
  templateUrl: './edit-pane.component.html',
  styleUrls: ['./edit-pane.component.css']
})
export class EditPaneComponent implements OnInit {
  message: string;
  projectId: any;
  prefixName = environment.name;
  myFill = this.prefixName + '-0000';
  reportService: any;
  reportServiceLoading = false;
  objectId: number;
  portal = new Portal({url: environment.portalSetting.url});
  fullName: string;
  userName: string;
  authenticated = false;
  siteName: string;


  constructor(public router: Router, public projectService: ProjectService, public route: ActivatedRoute, public loadingService: LoadingService,
              public data: DataService, public snackBar: MatSnackBar) {
                this.reportService = new ArcGpService(environment.reportService.url, snackBar);

  }


  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);
    // this.projectId = this.route.snapshot.paramMap.get('id');
    this.loadingService.show();
    this.route.paramMap.pipe(
      // switchMap(() => this.projectId = this.route.snapshot.paramMap.get('id')),
      switchMap(() => {
        return this.projectService.layerIsLoaded.pipe(switchMap(() => {
          if (this.route.snapshot.paramMap.get('id') !== 'new') {
            this.projectService.filter.where = `globalid = '${this.route.snapshot.paramMap.get('id')}'`;
            return this.projectService.query().pipe(tap(results => {
              this.siteName = results[0].attributes.Notification_ID;
              this.data.changeMessage(this.siteName); // results[0].attributes.objectid.toString().padStart(this.myFill.length, this.myFill) +
              //  ' ' + results[0].attributes.Project_Name);
              this.objectId = results[0].attributes.OBJECTID;
            }));
          } else { this.data.changeMessage('Add New Project'); }
        }));
      }),
    ).subscribe(() => this.loadingService.hide());

    this.route.queryParamMap.pipe(
      // first(),
      switchMap((params: ParamMap) => {
        this.applyQueryParams(params);
        const relevantKeys = params.keys.filter(key => !['page', 'page_size', 'ordering', 'table_visible'].includes(key));
        return zip(
        );
      })
    ).subscribe();
    // this.projectService.dataChange.pipe(tap(() => {
    //   this.updateQueryParams(this.projectService.filter);
    // })).subscribe();
  }

  updateQueryParams(queryParam: Params) {
    // if (queryParam.hasOwnProperty('mode')) { this.projectService.mode = queryParam.mode; }
    this.router.navigate([], { queryParams: queryParam, queryParamsHandling: 'merge' });
  }

  applyQueryParams(params: ParamMap) {
    // if (params.has('mode')) { this.projectService.mode = params.get('mode'); }
  }

  goHome() {
    // this.updateQueryParams({ mode: 'none' });
    // this.router.navigate(['/app/projects']);
    // this.projectService.mode = 'none';
  }

  generateReport() {
    this.reportServiceLoading = true;

    const utcOffset = Math.abs(moment().utcOffset() / 60);
    const utcFormattedOffset = `-0${utcOffset.toString()}:00`;
    const token = IdentityManager.findCredential(environment.layers.review).token;
    const params = {
      survey: environment.reportService.surveyItem,
      survey_token: token,
      template: environment.reportService.surveyTemplate,
      where: `objectid=${this.objectId}`,
      client_id: environment.portalSetting.appId,
      portal_url: environment.portalSetting.url,
      // utc_offset: offset_formatted,
      utc_offset: utcFormattedOffset,
      title: this.siteName
    };
    this.snackBar.open('Please wait.  The report takes ~2 minutes to generate...', '');

    this.reportService.submit(params, 'docId').pipe(
      finalize(() => {
        this.reportServiceLoading = false;

        this.snackBar.dismiss();
        this.snackBar.open('The document will download automatically.  Please ensure that your browser has not blocked the download.', '', {
          duration: 3000,
        });
      })
    ).subscribe();
  }
}
