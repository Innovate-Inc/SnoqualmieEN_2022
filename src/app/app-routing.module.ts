// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';

// import { IdentityManagementService } from './services/identity-management.service';

// import { MapViewComponent } from './map-view/map-view.component';
// import { ListViewComponent } from './list-view/list-view.component';
// import { InvoiceComponent } from './invoice/invoice.component';

// const routes: Routes = [
//   {
//     path: '', component: MapViewComponent, canActivate: [IdentityManagementService], children: [
//       { path: 'projects', component: ListViewComponent },
//       { path: '', redirectTo: 'projects', pathMatch: 'full' }
//     ]
//   },
//   { path: 'invoice', component: InvoiceComponent, pathMatch: 'full' }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }


import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MapViewComponent} from './map-view/map-view.component';
import {IdentityManagementService} from './services/identity-management.service';
import {ListViewComponent} from './list-view/list-view.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {InvoiceComponent} from './invoice/invoice.component';
import {PaymentComponent} from './payment/payment.component';
import {HomeComponent} from './home/home.component';


const routes: Routes = [
  {
    path: 'map', component: MapViewComponent, canActivate: [IdentityManagementService], children: [
      {path: 'projects', component: ListViewComponent}
    ]
  },
  {path: 'welcome', component: WelcomeComponent},
  {path: 'invoice', component: InvoiceComponent, canActivate: [IdentityManagementService], pathMatch: 'full'},
  {path: 'payment', component: PaymentComponent, canActivate: [IdentityManagementService], pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate : [IdentityManagementService], pathMatch: 'full'},
  {path: '', redirectTo: 'welcome', pathMatch: 'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
