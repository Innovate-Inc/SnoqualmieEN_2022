import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, SimpleChanges, ViewChild, OnChanges, Inject } from '@angular/core';
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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteSiteComponent } from '../esri-map/esri-map.component';
import moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit, OnChanges {
  // displayColumns = ['id', 'name', 'date', 'jurisdiction', 'user'];
  displayColumns = ['select', 'id', 'name', 'date', 'jurisdiction', 'user', 'delete'];
  searchText = '';
  applyNextExtent = false;
  applyHighlighting = false;
  props: Params;
  palateColor = 'primary';
  spatialSelect = 'false';
  disableRoute = false;
  dateEnd: string;
  dateStart: string;
  dateRangePicker = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  selection = new SelectionModel<Element>(true, []);
  numSelected = Number(0);
  selectedRows = 5; // : Array<number> = [0];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  // prefixname = environment.name;
  constructor(public loadingService: LoadingService, private data: DataService, public dialog: MatDialog, snackBar: MatSnackBar, public projectService: ProjectService, public route: ActivatedRoute, public router: Router) {
    const initialSelection: any = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<Element>(allowMultiSelect, initialSelection);
  }

  ngOnInit() {
    // this.loadingService.show();
    this.data.showToggle = true;
    this.data.changeMessage('');
    this.loadAll();

    this.route.queryParamMap.pipe(
      // first(),
      switchMap((params: ParamMap) => {
        // this.loadAll();

        this.applyQueryParams(params);
        const relevantKeys = params.keys.filter(key => !['page', 'page_size', 'ordering', 'table_visible'].includes(key));
        // if (relevant_keys.length > 0) {
        //   this.apply_next_extent = true;
        //   this.apply_highlighting = true;
        // }
        return zip(
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
      this.updateQueryParams({ searchText: this.searchText, dateStart: this.dateStart, dateEnd: this.dateEnd, start: this.projectService.filter.start, num: this.projectService.filter.num });

      // this.updateQueryParams(this.projectService.filter);
    })).subscribe();
    // this.projectService.mapMode.pipe(tap(() => {
    //   this.updateQueryParams(this.projectService.filter);
    // })).subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  updateQueryParams(queryParam: Params) {
    if (queryParam.hasOwnProperty('mine_globalid_in')) {
      queryParam = { ...queryParam };
      delete queryParam.mine_globalid_in;
    }
    this.router.navigate([], { queryParams: queryParam, queryParamsHandling: 'merge' });
  }

  applyQueryParams(params: ParamMap) {
    if (params.get('spatialSelect')) { this.spatialSelect = params.get('spatialSelect'); }
    if (params.get('searchText')) {
      this.searchText = params.get('searchText');
      this.search();
    }

    for (const key of params.keys) {
      if (!['table_visible', 'mine_globalid_in', 'chapter'].includes(key)) {
        this.projectService.filter[key] = params.get(key);
        if (params.get(key) === 'true') { this.projectService.filter[key] = true; }
        if (params.get(key) === 'false') { this.projectService.filter[key] = false; }
      }
      // if (['spatialSelect'].includes(key)) {
      //   if (params.get(key) === 'true') {
      //     this.paletteColor = 'primary';
      //   } else {
      //     this.paletteColor = 'warn';
      //   }
      // }
    }
  }


  search() {
    this.updateQueryParams({ searchText: this.searchText, start: 0, num: 0 });
    this.projectService.filter.where = `(Project_Name like '%${this.searchText}%' or ID_DAHP_full like '%${this.searchText}' or Jurisdiction like '%${this.searchText}' or created_user like '%${this.searchText}')`;
    if (this.dateStart && moment(this.dateStart).isValid()) {
      this.projectService.filter.where += ` AND Date_Received >= '${this.dateStart}'`;
    }
    if (this.dateEnd && moment(this.dateEnd).isValid()) {
      this.projectService.filter.where += ` AND Date_Received <= '${this.dateEnd}'`;
    }


    this.projectService.filter.orderByFields = [`ID_DAHP_full DESC`];
    //   if (isNumeric(searchText)) {
    //     this.projectService.filter.where = this.projectService.filter.where.concat(` OR ProjectNumber = ${searchText}`);
    //   }
    this.projectService.filter.start = 0;
    this.paginator.pageIndex = 0;
    this.projectService.getItems().subscribe();
  }

  dateChange(type: any, event: any) {
    if (event.target.ngControl.name === 'start') {
      this.dateStart = moment(event.value).format('YYYY-MM-DD');
      this.updateQueryParams({ dateStart: this.dateStart });
      this.projectService.dateStart = this.dateStart;
    } else {
      this.dateEnd = moment(event.value).format('YYYY-MM-DD');
      this.updateQueryParams({ dateEnd: this.dateEnd });
    }
    this.search();
  }

  // dateEndChange(type: any, event: any) {
  //   // if (event.target.ngControl.name === 'start') {
  //     // this.dateStart = moment(event.value).format('DD-MM-YYYY');
  //     // this.updateQueryParams({ dateStart: this.dateStart });
  //   // } else {
  //     this.dateEnd = moment(event.value).format('DD-MM-YYYY');
  //     this.updateQueryParams({ dateEnd: this.dateEnd });
  //   // }
  // }

  spatialSelectClick(params: Params) {
    console.log('spatial select');
    this.projectService.geometry = null;
    this.updateQueryParams(params);
    this.projectService.getItems().subscribe();
  }

  loadAll() {
    this.projectService.layerIsLoaded.subscribe(() => {
      // if (this.route.snapshot.queryParams.
      //   this.route.snapshot.queryParams
      this.updateQueryParams({ searchText: '' });
      this.projectService.filter.where = '1=1';
      this.projectService.filter.orderByFields = [`ID_DAHP_full DESC`];
      this.projectService.getItems().subscribe();
    });
  }

  delete(feature: any, i: number) {
    const dialogRef = this.dialog.open(DeleteSiteComponent, {
      width: '400px',
      height: '330px' // ,
      // data: {date: element.attributes?.INV_InvoiceDate, invoiceID: element.attributes?.OBJECTID,
      //       encroachmentID: element.attributes?.INV_EncID, permitID: element.attributes?.INV_PermitID}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.disableRoute = false;
      if (result === 'true') {
        this.projectService.delete(feature).subscribe(() => {
          this.updateQueryParams({ mode: 'none' });
          this.router.navigate(['/app/projects']);
        });
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    let numRows;
    if (this.projectService.count.value < this.projectService.filter.num) {
      numRows = this.projectService.count.value;
    } else {
      numRows = parseInt(this.projectService.filter.num);
    }
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.deselectAll() : this.selectAll();
  }

  selectAll() {
    this.projectService.data.forEach((row: any) => this.selection.select(row));
    this.numSelected = this.projectService.count.value;

  }

  deselectAll() {
    this.selection.clear();
    this.numSelected = 0;

  }

  toggleCheckbox(element: any, selection: any) {
    if (selection.isSelected(element)) {
      this.numSelected = this.numSelected + 1;
    } else {
      this.numSelected = this.numSelected - 1;
    }
    if (this.numSelected < 0) {
      this.numSelected = 0;
    }

    // console.log(this.selection.selected);
  }

  generateSpreadsheet() {

  }
}
