import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import {IdentityManagementService} from './services/identity-management.service';
@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ IdentityManagementService],
  bootstrap: [AppComponent]
})
export class AppModule { }
