import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Project, ProjectService } from "../services/project.service";
// import {EditService} from '../services/edit.service';
import { finalize, map, switchMap, takeWhile, tap } from "rxjs/operators";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
// import {MainMapService} from '../services/main-map.service';
// import {BehaviorSubject} from 'rxjs/BehaviorSubject';
// import {Observable} from 'rxjs/Observable';
// import {Subject} from 'rxjs/Subject';
// import 'rxjs/add/observable/if';
// import 'rxjs/add/observable/forkJoin';
import { LoadingService } from "../services/loading.service";
import { BehaviorSubject, iif, Observable, of, Subject } from "rxjs";
// import {ProjectActionsLU, ProjectActionsLuService} from '../services/project-actions-lu.service';
// import {LandOwnershipLU, LandOwnershipLuService} from '../services/land-ownership-lu.service';

@Component({
  selector: "app-review-form",
  templateUrl: "./review-form.component.html",
  styleUrls: ["./review-form.component.css"],
})
export class ReviewFormComponent implements OnInit, OnDestroy {
  review: Subject<any>;
  editObs: any;
  // actions: Subject<ProjectActionsLU> = new Subject<ProjectActionsLU>();
  // owner: Subject<LandOwnershipLU> = new Subject<LandOwnershipLU>();
  mapMode = "edit";
  featureForm = new FormGroup({
    // ProjectNumber: new FormControl(),
    OBJECTID: new FormControl(),
    globalid: new FormControl(),
    Reviewer_Name: new FormControl(),
    Review_Name_Note: new FormControl(),
    Date_Received: new FormControl(),
    Reviewer_Department: new FormControl(),
    ID_DAHP: new FormControl(),
    ID_Initials: new FormControl(),
    Notification_ID: new FormControl(),
    ID_DAHP_full: new FormControl(),
    Project_Name: new FormControl(),
    Jurisdiction: new FormControl(),
    Jurisdiction_other: new FormControl(),
    Jurisdiction_Type: new FormControl(),
    Project_Phase: new FormControl(),
    Notification_Type: new FormControl(),
    Note_Concern: new FormControl(),
    Noti_Dept_Select: new FormControl(),
    Noti_Dept_Select_other: new FormControl(),
    Noti_Tribe: new FormControl(),
    Noti_Tribe_Text: new FormControl(),
    Location_Type: new FormControl(),
    Abstract: new FormControl(),
    Docu_YN: new FormControl(),
    Docu_Repeat_count: new FormControl(),
    Impact_YN: new FormControl(),
    Enviro_Impact: new FormControl(),
    Enviro_Impact_Type: new FormControl(),
    Wetland_Likert: new FormControl(),
    Aquatic_Likert: new FormControl(),
    Storm_Likert: new FormControl(),
    Veg_Likert: new FormControl(),
    Watertype_Likert: new FormControl(),
    Impact_Culture: new FormControl(),
    Culture_Type: new FormControl(),
    Culture_Note: new FormControl(),
    CreationDate: new FormControl(),
    Creator: new FormControl(),
    EditDate: new FormControl(),
    Editor: new FormControl(),
  });

  constructor(
    public projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    public loadingService: LoadingService
  ) {}

  //             public mapService: MainMapService, public editService: EditService, public projectActionsLuService: ProjectActionsLuService,
  //             public landOwnershipLuService: LandOwnershipLuService) {
  // }

  ngOnInit() {
    this.loadingService.show();
    this.review = new BehaviorSubject(null);
    this.loadingService.show();
    this.route.parent.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          return iif(
            () => params.get("id") === "new",
            this.projectService.create_new_project(),
            this.projectService.selectFeature(params.get("id"), null)
          );
        }),
        map((review) => {
          this.review.next(review);
          if (review.attributes.globalid !== "new") {
            review.attributes.Noti_Dept_Select =
              review.attributes.Noti_Dept_Select.split(",");
            this.featureForm.patchValue(review.attributes);
          }
        })
      )
      .subscribe(() => this.loadingService.hide());
  }

  ngOnDestroy() {
    //  this.editObs.unsubscribe();
    console.log("ngOnDestroy: Aothing to destry yet");
    // this.mapService.clearGraphics();
  }

  save(review: any) {
    Object.keys(this.featureForm.controls).forEach((key) => {
      this.featureForm.get(key).markAsPristine();
    });
    review.attributes = this.featureForm.value;
    if (this.featureForm.controls.Noti_Tribe.value != "yes") {
      review.attributes.Noti_Tribe_Text = "";
    }
    const reviewDept = review.attributes.Noti_Dept_Select;
    delete review.attributes.Noti_Dept_Select;
    // let land_ownership = review.attributes.Land_Ownership;
    // delete review.attributes.Land_Ownership;
    if (reviewDept instanceof Array) {
      review.attributes.Noti_Dept_Select = reviewDept.toString();
    }
    this.projectService.layerIsLoaded.subscribe(() => {
      if (review.attributes.ID_DAHP_full === null) {
        this.projectService.queryMax().subscribe((projectMaxResults) => {
          review.attributes.ID_DAHP_full =
            Number(projectMaxResults[0].attributes.ProjectNumMAX) + 1;
        });
      }
      // Observable.if(() => review.attributes.GlobalID === 'new',
      //   this.projectService.addFeature(review).pipe(
      //     tap(results => {
      //       this.editObs.unsubscribe();
      //       // this.mapService.clearGraphics();
      //       this.router.navigate(['/edit', results[0].globalId]);
      //       return results;
      //     })
      //   ),
      this.projectService
        .updateFeature(review)
        .subscribe
        //   results => {
        //   // delete all related multiselect values
        //   this.projectActionsLuService.layerIsLoaded.subscribe(() => {
        //     this.projectActionsLuService.filter.where = `projectsid_fk = '${results[0].globalId}'`;
        //     this.projectActionsLuService.query().subscribe(projectActions_results => {
        //       projectActions_results.forEach((element) => {
        //         this.projectActionsLuService.delete(element).subscribe();
        //       });
        //       if (project_actions instanceof Array) {
        //         project_actions.forEach((element) => {
        //           this.projectActionsLuService.create_new_action(results[0].globalId, element).subscribe();
        //         });
        //       }
        //     });
        //   });
        //   this.landOwnershipLuService.layerIsLoaded.subscribe(() => {
        //     this.landOwnershipLuService.filter.where = `project_fk = '${results[0].globalId}'`;
        //     this.landOwnershipLuService.query().subscribe(landOwner_results => {
        //       landOwner_results.forEach((element) => {
        //         this.landOwnershipLuService.delete(element).subscribe();
        //       });
        //       if (land_ownership instanceof Array) {
        //         land_ownership.forEach((element) => {
        //           this.landOwnershipLuService.create_new_action(results[0].globalId, element).subscribe();
        //         });
        //       }
        //     });
        //   });
        // }
        ();
    });
  }
}
