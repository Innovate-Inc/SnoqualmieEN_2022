import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {environment} from '../../environments/environment';
import Portal from 'esri/portal/Portal';
import OAuthInfo from 'esri/identity/OAuthInfo';
import IdentityManager from 'esri/identity/IdentityManager';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';

@Injectable()
export class IdentityManagementService implements CanActivate {
  portal = new Portal({url: environment.portal_setting.url});
  full_name: string;
  user_name: string;
  authenticated = false;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticate();
  }

  constructor() {

    const info = new OAuthInfo({
      appId: environment.portal_setting.appId,
      popup: false,
      authNamespace: 'CO40',
      expiration: 1440,
      portalUrl: environment.portal_setting.url
    });
    // const storedCreds = localStorage.getItem('arcgis_creds');
    // if (storedCreds !== null) {
    //   IdentityManager.initialize(JSON.stringify(storedCreds));
    // } else {
    IdentityManager.registerOAuthInfos([info]);
    // }
    // });
  }

  authenticate(token?: string, username?: string, expires?: string): Observable<boolean> {
    console.log('start');
    return new Observable(obs => {
        if (token !== undefined && username !== undefined) {
          IdentityManager.registerToken({
            expires: parseInt(expires, 10),
            server: `${environment.portal_setting.url}/sharing`,
            ssl: true,
            token,
            userId: username
          });
        }
        // const vm = this;
        IdentityManager.checkSignInStatus(`${environment.portal_setting.url}/sharing`).then(() => {
          this.portal.load().then(portal => {
            this.full_name = portal.user.fullName;
            this.user_name = portal.user.username;
            this.authenticated = true;
            // localStorage.setItem('arcgis_creds', IdentityManager.toJSON());
            obs.next(true);
            obs.complete();
          }).catch(() => {
            obs.error(false);
          });
        }).catch(() => {
          IdentityManager.getCredential(`${environment.portal_setting.url}/sharing`);
        });
    });
  }

  logout() {
    this.user_name = null;
    this.full_name = null;
    this.authenticated = false;
    IdentityManager.destroyCredentials();
    // localStorage.clearAll();
    location.reload();
  }

}
