import { Component, OnInit, ViewChild } from '@angular/core';
// import { ProjectService } from '../services/project.service';
import { finalize, map } from 'rxjs/operators';
// import {isNumeric} from 'rxjs/util/isNumeric';
import { isNumeric } from 'rxjs/internal-compatibility';
import { MatPaginator } from '@angular/material/paginator';
import { LoadingService } from '../services/loading.service';
import { DataService } from '../services/data.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {
  displayColumns = ['ProjectNumber', 'name', 'date'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  prefixname = environment.name;
  // constructor(public projectService: ProjectService, public loadingService: LoadingService,  private data: DataService) {
  constructor(public loadingService: LoadingService, private data: DataService) {
  }

  ngOnInit() {
    this.loadingService.show();
    this.data.changeMessage('');
    // this.projectService.layerIsLoaded.subscribe(() => {
    //   this.projectService.filter.where = `Project_Name like '%'`;
    //   this.projectService.filter.orderByFields = [`ProjectNumber DESC`];
    //   this.projectService.getItems().subscribe();
    // });
  }

  // search(search_text) {
  //   this.projectService.filter.where  = `Project_Name like '%${search_text}%'`;
  //   this.projectService.filter.orderByFields = [`ProjectNumber DESC`];
  //   if (isNumeric(search_text)) {
  //     this.projectService.filter.where = this.projectService.filter.where.concat(` OR ProjectNumber = ${search_text}`);
  //   }
  //   this.projectService.filter.start = 0;
  //   this.paginator.pageIndex = 0;
  //   this.projectService.getItems().subscribe();
  // }

}
