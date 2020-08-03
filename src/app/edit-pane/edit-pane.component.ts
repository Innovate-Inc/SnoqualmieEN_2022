import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {LoadingService} from '../services/loading.service';
import { DataService } from '../services/data.service';
import {switchMap, tap} from 'rxjs/operators';
import {ProjectService} from '../services/project.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-edit-pane',
  templateUrl: './edit-pane.component.html',
  styleUrls: ['./edit-pane.component.css']
})
export class EditPaneComponent implements OnInit {
  message: string;
  projectId: any;
  prefixName = environment.name
  myFill = this.prefixName + '-0000'
  constructor(public projectService: ProjectService, public route: ActivatedRoute, public loadingService: LoadingService,
              public data: DataService) {
  }
  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);
    // this.projectId = this.route.snapshot.paramMap.get('id');
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
          } else {this.data.changeMessage('Add New Project'); }
        }));
      }),
    ).subscribe(() => this.loadingService.hide());
  }
}
