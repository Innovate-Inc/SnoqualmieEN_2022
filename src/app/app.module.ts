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
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';


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
import {ProjectService} from './services/project.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    MapViewComponent,
    ListViewComponent,
    WildCardComponent,
    WelcomeComponent
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
    MatProgressBarModule
  ],
  providers: [IdentityManagementService,
    LoadingService,
    DataService,
    ProjectService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
