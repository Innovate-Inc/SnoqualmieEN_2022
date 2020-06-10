import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {IdentityManagementService} from './services/identity-management.service';
import { MapViewComponent } from './map-view/map-view.component';
import { ListViewComponent } from './list-view/list-view.component';

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    MapViewComponent,
    ListViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  providers: [IdentityManagementService],
  bootstrap: [AppComponent]
})
export class AppModule { }
