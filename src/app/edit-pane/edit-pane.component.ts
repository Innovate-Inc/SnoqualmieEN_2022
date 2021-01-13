import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, ParamMap, Params } from '@angular/router';
import { LoadingService } from '../services/loading.service';
import { DataService } from '../services/data.service';
import { switchMap, tap } from 'rxjs/operators';
import { ProjectService } from '../services/project.service';
import { environment } from '../../environments/environment';
import { zip } from 'rxjs';

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
  constructor(public router: Router, public projectService: ProjectService, public route: ActivatedRoute, public loadingService: LoadingService,
              public data: DataService) {
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
              this.data.changeMessage(results[0].attributes.Project_Name); // results[0].attributes.objectid.toString().padStart(this.myFill.length, this.myFill) +
              //  ' ' + results[0].attributes.Project_Name);
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
    this.projectService.dataChange.pipe(tap(() => {
      this.updateQueryParams(this.projectService.filter);
    })).subscribe();
  }

  updateQueryParams(queryParam: Params) {
    // if (queryParam.hasOwnProperty('mode')) { this.mode = queryParam.mode; }
    this.router.navigate([], { queryParams: queryParam, queryParamsHandling: 'merge' });
  }

  applyQueryParams(params: ParamMap) {
    // if (params.has('mode')) { this.mode = params.get('mode'); }
  }

  goHome() {
    this.updateQueryParams({ mode: 'none' });
    this.router.navigate(['/app/projects']);
  }
}
