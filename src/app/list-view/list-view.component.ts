import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Project, ProjectService } from '../services/project.service';
import { filter, finalize, first, map, switchMap, tap } from 'rxjs/operators';
// import {isNumeric} from 'rxjs/util/isNumeric';
import { isNumeric } from 'rxjs/internal-compatibility';
import { MatPaginator } from '@angular/material/paginator';
import { LoadingService } from '../services/loading.service';
import { DataService } from '../services/data.service';
import { environment } from '../../environments/environment';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { zip } from 'rxjs';


@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {
  // displayColumns = ['id', 'name', 'date', 'jurisdiction', 'user'];
  displayColumns = ['id', 'name', 'date', 'jurisdiction', 'user', 'DELETE'];
  searchText = '';
  applyNextExtent = false;
  applyHighlighting = false;
  props: Params;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // prefixname = environment.name;
  constructor(public loadingService: LoadingService, private data: DataService, snackBar: MatSnackBar, public projectService: ProjectService, public route: ActivatedRoute, public router: Router) {
  }

  ngOnInit() {
    // this.loadingService.show();
    this.data.showToggle = true;
    this.data.changeMessage('');
    this.loadAll();

    this.route.queryParamMap.pipe(
      first(),
      switchMap((params: ParamMap) => {
        this.applyQueryParams(params);
        const relevantKeys = params.keys.filter(key => !['page', 'page_size', 'ordering', 'table_visible'].includes(key));
        // if (relevant_keys.length > 0) {
        //   this.apply_next_extent = true;
        //   this.apply_highlighting = true;
        // }
        return zip (
        //   this.projectService.fullResponse.pipe(
        //     filter(() => {
        //       const proceed = this.applyNextExtent;
        //       this.applyNextExtent = true;
        //       return proceed;
        //     }),
        //     tap(results => {
        //       //this.extent = results['extent'];
        //       //this.tableVisibility(true);
        //     }),
        //     filter(() => {
        //       const proceed = this.applyHighlighting;
        //       this.applyHighlighting = true;
        //       return proceed;
        //     }),
        //     tap(results => this.setHighlighting(results['pks']))
        //   ),
        //   this.runSearch()
        );
      })
    ).subscribe();
    this.projectService.dataChange.pipe(tap(() => {
      this.updateQueryParams(this.projectService.filter);
    })).subscribe();
  }

  updateQueryParams(queryParam: Params) {
    if (queryParam.hasOwnProperty('mine_globalid_in')) {
      queryParam = { ...queryParam };
      delete queryParam.mine_globalid_in;
    }
    // queryParam.select = this.selectMode;
    this.router.navigate([], { queryParams: queryParam, queryParamsHandling: 'merge' });
  }

  applyQueryParams(params: ParamMap) {
    for (const key of params.keys) {
      if (!['table_visible', 'mine_globalid_in', 'chapter'].includes(key)) {
        this.projectService.filter[key] = params.get(key);
        if (params.get(key) === 'true') { this.projectService.filter[key] = true; }
        if (params.get(key) === 'false') { this.projectService.filter[key] = false; }
      }
    }
  }

  search() {
    this.projectService.filter.where = `Project_Name like '%${this.searchText}%' or ID_DAHP_full like '%${this.searchText}' or Jurisdiction like '%${this.searchText}' or created_user like '%${this.searchText}'`;
    this.projectService.filter.orderByFields = [`ID_DAHP_full DESC`];
    //   if (isNumeric(searchText)) {
    //     this.projectService.filter.where = this.projectService.filter.where.concat(` OR ProjectNumber = ${searchText}`);
    //   }
    this.projectService.filter.start = 0;
    this.paginator.pageIndex = 0;
    this.projectService.getItems().subscribe();
  }

  spatialSelect(params: Params) {
    console.log('spatial select');
    // this.props.selectMode = true;
    this.updateQueryParams(params);
  }
  loadAll() {
    this.projectService.layerIsLoaded.subscribe(() => {
      this.projectService.filter.where = `Project_Name like '%'`;
      this.projectService.filter.orderByFields = [`ID_DAHP_full DESC`];
      this.projectService.getItems().subscribe();
    });
  }
}
