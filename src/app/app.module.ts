import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';


import { MapViewComponent } from './map-view/map-view.component';
import { ListViewComponent } from './list-view/list-view.component';

import { IdentityManagementService } from './services/identity-management.service';
import { LoadingService } from './services/loading.service';
import { DataService } from './services/data.service';
// import { ProjectService } from './services/project.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WildCardComponent } from './wild-card/wild-card.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProjectService } from './services/project.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EditPaneComponent } from './edit-pane/edit-pane.component';
import { MatDividerModule } from '@angular/material/divider';
import { ReviewFormComponent } from './review-form/review-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AbstractFormComponent } from './abstract-form/abstract-form.component';
import { SupportDocsFormComponent } from './support-docs-form/support-docs-form.component';
import { ImpactsFormComponent } from './impacts-form/impacts-form.component';
import { ActivityFormComponent } from './activity-form/activity-form.component';
import { DocuService } from './services/docu.service';
import { DocPopupComponent } from './doc-popup/doc-popup.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { CommentFormComponent } from './activity-sub-modules/comment-form/comment-form.component';
import { HearingFormComponent } from './activity-sub-modules/hearing-form/hearing-form.component';
import { MeetingFormComponent } from './activity-sub-modules/meeting-form/meeting-form.component';
import { ChanceEncounterFormComponent } from './activity-sub-modules/chance-encounter-form/chance-encounter-form.component';
import { SiteVisitFormComponent } from './activity-sub-modules/site-visit-form/site-visit-form.component';
import { CallFormComponent } from './activity-sub-modules/call-form/call-form.component';
import { ViolationFormComponent } from './activity-sub-modules/violation-form/violation-form.component';
import { FieldWorkFormComponent } from './activity-sub-modules/field-work-form/field-work-form.component';
import { CallTabComponent } from './activity-sub-modules/call-tab/call-tab.component';
import { CommentTabComponent } from './activity-sub-modules/comment-tab/comment-tab.component';
import { MeetingTabComponent } from './activity-sub-modules/meeting-tab/meeting-tab.component';
import { HearingTabComponent } from './activity-sub-modules/hearing-tab/hearing-tab.component';
import { ChanceEncounterTabComponent } from './activity-sub-modules/chance-encounter-tab/chance-encounter-tab.component';
import { SiteVisitTabComponent } from './activity-sub-modules/site-visit-tab/site-visit-tab.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    MapViewComponent,
    ListViewComponent,
    WildCardComponent,
    WelcomeComponent,
    EditPaneComponent,
    ReviewFormComponent,
    AbstractFormComponent,
    SupportDocsFormComponent,
    ImpactsFormComponent,
    ActivityFormComponent,
    DocPopupComponent,
    CommentFormComponent,
    HearingFormComponent,
    MeetingFormComponent,
    ChanceEncounterFormComponent,
    SiteVisitFormComponent,
    CallFormComponent,
    ViolationFormComponent,
    FieldWorkFormComponent,
    CallTabComponent,
    CommentTabComponent,
    MeetingTabComponent,
    HearingTabComponent,
    ChanceEncounterTabComponent,
    SiteVisitTabComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatTableModule,
    MatProgressBarModule,
    MatDividerModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSliderModule,
    MatSlideToggleModule,
  ],
  providers: [IdentityManagementService,
    LoadingService,
    DataService,
    ProjectService,
    DocuService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
