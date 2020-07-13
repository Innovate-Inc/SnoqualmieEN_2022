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
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';


import { MapViewComponent } from './map-view/map-view.component';
import { ListViewComponent } from './list-view/list-view.component';
import { InvoiceComponent } from './invoice/invoice.component';

import { IdentityManagementService } from './services/identity-management.service';
import { LoadingService } from './services/loading.service';
import { DataService } from './services/data.service';
// import { ProjectService } from './services/project.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WildCardComponent } from './wild-card/wild-card.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NonExemptComponent } from './non-exempt/non-exempt.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PaymentComponent } from './payment/payment.component';
import { HomeComponent } from './home/home.component';
import { PreviewRecordsComponent } from './preview-records/preview-records.component';

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    MapViewComponent,
    ListViewComponent,
    InvoiceComponent,
    WildCardComponent,
    WelcomeComponent,
    NonExemptComponent,
    LandingPageComponent,
    PaymentComponent,
    HomeComponent,
    PreviewRecordsComponent
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
    MatTableModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    MatSnackBarModule,

    BrowserAnimationsModule
  ],
  providers: [IdentityManagementService,
    LoadingService,
    DataService,
    // ProjectService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
