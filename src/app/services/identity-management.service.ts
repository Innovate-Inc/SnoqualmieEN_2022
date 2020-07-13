import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {environment} from '../../environments/environment';
import Portal from 'esri/portal/Portal';
import OAuthInfo from 'esri/identity/OAuthInfo';
import IdentityManager from 'esri/identity/IdentityManager';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';

@Injectable()
export class IdentityManagementService implements CanActivate {
  portal = new Portal({url: environment.portalSetting.url});
  fullName: string;
  userName: string;
  authenticated = false;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticate();
  }

  constructor() {

    const info = new OAuthInfo({
      appId: environment.portalSetting.appId,
      popup: false,
      authNamespace: 'CO40',
      expiration: 1440,
      portalUrl: environment.portalSetting.url
    });
    IdentityManager.registerOAuthInfos([info]);
    IdentityManager.setOAuthRedirectionHandler(function(i) {
      if (window.location.pathname === ('/welcome')) {
        // alert(i.authorizeParams.redirect_uri);
        console.log(i);
        i.authorizeParams.redirect_uri = window.location.protocol + '//' + window.location.host + '/home';
      }
      window.location.href = i.authorizeUrl + '?' + Object.keys(i.authorizeParams).map(key => key + '=' + i.authorizeParams[key]).join('&');
    });
  }

  authenticate(token?: string, username?: string, expires?: string): Observable<boolean> {
    console.log('start');
    return new Observable(obs => {
      if (token !== undefined && username !== undefined) {
        IdentityManager.registerToken({
          expires: parseInt(expires, 10),
          server: `${environment.portalSetting.url}/sharing`,
          ssl: true,
          token,
          userId: username
        });
      }
      // const vm = this;
      IdentityManager.checkSignInStatus(`${environment.portalSetting.url}/sharing`).then(() => {
        this.portal.load().then(portal => {
          this.fullName = portal.user.fullName;
          this.userName = portal.user.username;
          this.authenticated = true;
          // localStorage.setItem('arcgis_creds', IdentityManager.toJSON());
          obs.next(true);
          obs.complete();
        }).catch(() => {
          obs.error(false);
        });
      }).catch(() => {
        IdentityManager.getCredential(`${environment.portalSetting.url}/sharing`);
      });
    });
  }

  logout() {
    this.userName = null;
    this.fullName = null;
    this.authenticated = false;
    IdentityManager.destroyCredentials();
    // localStorage.clearAll();
    // location.reload();
  }

}
