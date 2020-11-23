import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Project, ProjectService } from '../services/project.service';
import { finalize, map } from 'rxjs/operators';
// import {isNumeric} from 'rxjs/util/isNumeric';
import { isNumeric } from 'rxjs/internal-compatibility';
import { MatPaginator } from '@angular/material/paginator';
import { LoadingService } from '../services/loading.service';
import { DataService } from '../services/data.service';
import { environment } from '../../environments/environment';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {
  displayColumns = ['id', 'name'];
  searchText = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // prefixname = environment.name;
  constructor(public loadingService: LoadingService, private data: DataService, snackBar: MatSnackBar, public projectService: ProjectService) {
  }

  ngOnInit() {
    // this.loadingService.show();
    this.data.showToggle = true;
    this.data.changeMessage('');
    this.loadAll();
  }

  search() {
    this.projectService.filter.where  = `Project_Name like '%${this.searchText}%' or ID_DAHP_full like '%${this.searchText}'`;
    this.projectService.filter.orderByFields = [`ID_DAHP_full DESC`];
  //   if (isNumeric(searchText)) {
  //     this.projectService.filter.where = this.projectService.filter.where.concat(` OR ProjectNumber = ${searchText}`);
  //   }
    this.projectService.filter.start = 0;
    this.paginator.pageIndex = 0;
    this.projectService.getItems().subscribe();
  }
  loadAll(){
    this.projectService.layerIsLoaded.subscribe(() => {
      this.projectService.filter.where = `Project_Name like '%'`;
      this.projectService.filter.orderByFields = [`ID_DAHP_full DESC`];
      this.projectService.getItems().subscribe();
    });
  }
}
