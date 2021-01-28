import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapViewComponent } from './map-view/map-view.component';
import { IdentityManagementService } from './services/identity-management.service';
import { ListViewComponent } from './list-view/list-view.component';
import { WelcomeComponent } from './welcome/welcome.component';
import {EditPaneComponent} from './edit-pane/edit-pane.component';
import {ReviewFormComponent} from './review-form/review-form.component';
import {AbstractFormComponent} from './abstract-form/abstract-form.component';
import {ActivityFormComponent} from './activity-form/activity-form.component';
import {ImpactsFormComponent} from './impacts-form/impacts-form.component';
import {SupportDocsFormComponent} from './support-docs-form/support-docs-form.component';
import { CallFormComponent } from './activity-sub-modules/call-form/call-form.component';
import { ChanceEncounterFormComponent } from './activity-sub-modules/chance-encounter-form/chance-encounter-form.component';
import { CommentFormComponent } from './activity-sub-modules/comment-form/comment-form.component';
import { FieldWorkFormComponent } from './activity-sub-modules/field-work-form/field-work-form.component';
import { HearingFormComponent } from './activity-sub-modules/hearing-form/hearing-form.component';
import { MeetingFormComponent } from './activity-sub-modules/meeting-form/meeting-form.component';
import { SiteVisitFormComponent } from './activity-sub-modules/site-visit-form/site-visit-form.component';
import { ViolationTabComponent } from './activity-sub-modules/violation-tab/violation-tab.component';
import { ViolationFormComponent } from './activity-sub-modules/violation-form/violation-form.component';
import { CallTabComponent } from './activity-sub-modules/call-tab/call-tab.component';
import { ChanceEncounterTabComponent } from './activity-sub-modules/chance-encounter-tab/chance-encounter-tab.component';
import { CommentTabComponent } from './activity-sub-modules/comment-tab/comment-tab.component';
import { HearingTabComponent } from './activity-sub-modules/hearing-tab/hearing-tab.component';
import { MeetingTabComponent } from './activity-sub-modules/meeting-tab/meeting-tab.component';
import { SiteVisitTabComponent } from './activity-sub-modules/site-visit-tab/site-visit-tab.component';
import { AllActivitiesComponent } from './activity-sub-modules/all-activities/all-activities.component';




const routes: Routes = [
  {
    path: 'app', component: MapViewComponent, canActivate: [IdentityManagementService], runGuardsAndResolvers: 'paramsChange', children: [
      {
        path: 'edit/:id', component: EditPaneComponent, children: [
          {path: 'review', component: ReviewFormComponent},
          {path: 'supportdocs', component: SupportDocsFormComponent},
          {path: 'abstract', component: AbstractFormComponent},
          {path: 'impacts', component: ImpactsFormComponent},
          {path: 'activity', component: ActivityFormComponent, children: [
            {path: 'allactivities', component: AllActivitiesComponent},
            {path: 'call', component: CallTabComponent, children: [
              {path: 'call-form', component: CallFormComponent}
            ]},
            {path: 'chanceencounter', component: ChanceEncounterTabComponent, children: [
              {path: 'chanceencounter-form', component: ChanceEncounterFormComponent}
            ]},
            {path: 'comment', component: CommentTabComponent, children: [
              {path: 'comment-form', component: CommentFormComponent}
            ]},
            {path: 'hearing', component: HearingTabComponent, children: [
              {path: 'hearing-form', component: HearingFormComponent}
            ]},
            {path: 'meeting', component: MeetingTabComponent, children: [
              {path: 'meeting-form', component: MeetingFormComponent}
            ]},
            {path: 'sitevisit', component: SiteVisitTabComponent, children: [
              {path: 'sitevisit-form', component: SiteVisitFormComponent}
            ]},
            {path: 'violation', component: ViolationTabComponent, children: [
              {path: 'violation-form', component: ViolationFormComponent}
            ]},
            {path: 'fieldwork', component: FieldWorkFormComponent},
          ]
        },
          {path: '', redirectTo: 'review', pathMatch: 'full'},
        ]
      },
      { path: 'projects', component: ListViewComponent },
      { path: '', redirectTo: 'projects', pathMatch: 'full' }
    ]
  },
  { path: 'welcome', component: WelcomeComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
 exports: [RouterModule],
})
export class AppRoutingModule {
}
