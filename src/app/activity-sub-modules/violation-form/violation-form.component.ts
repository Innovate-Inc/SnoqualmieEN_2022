import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BehaviorSubject, iif, Subject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { ArcBaseService } from 'src/app/services/arc-base.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-violation-form',
  templateUrl: './violation-form.component.html',
  styleUrls: ['./violation-form.component.css']
})
export class ViolationFormComponent implements OnInit {
  violationsBool = "No";
  activities: Subject<any>;

  activityForm = new FormGroup({
    objectid: new FormControl(),
    globalid: new FormControl(),
    Activity_Type: new FormControl(),
    parentglobalid: new FormControl(),
    CreationDate: new FormControl(),
    Creator: new FormControl(),
    EditDate: new FormControl(),
    Editor: new FormControl(),
    Violation_YN: new FormControl(),
    Violation_Doc_Note: new FormControl(),


    Violation_loc: new FormControl(),
    Code_Violation: new FormControl(),
    Violation_Action: new FormControl(),
    Violation_Solution: new FormControl(),
  });

  activityService: ArcBaseService;
  meta: any;

  constructor(private route: ActivatedRoute, public snackBar: MatSnackBar, public loadingService: LoadingService) {
    this.activityService = new ArcBaseService(environment.layers.activities, this.snackBar, this.loadingService);

  }

  ngOnInit(): void {
  }

  violation(number: any) {
    if (number === 1 || number === 3) {
      this.violationsBool = "Yes";
    }
    else {
      this.violationsBool = "No";
    }
  }
  save() {

  }
}
