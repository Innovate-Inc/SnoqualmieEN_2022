import {Injectable} from '@angular/core';
//import {loadModules} from 'esri-loader';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable()
export class IdentityManagementService {
  identityManager;
  portal;
  identityManagerObs;
  full_name: string;
  user_name: string;
  authenticated = false;

  constructor() {
    this.identityManagerObs = new ReplaySubject();
    loadModules(['esri/IdentityManager', 'esri/arcgis/OAuthInfo', 'esri/arcgis/Portal'], environment.jsapi_config)
      .then(([IdentityManager, OAuthInfo, Portal]) => {
        const info = new OAuthInfo({
          appId: environment.portal_setting.appId,
          popup: false,
          authNamespace: 'CRIS',
          expiration: 1440,
          portalUrl: environment.portal_setting.url
        });
        const stored_creds = localStorage.getItem('arcgis_creds');
        if (stored_creds !== null) {
          IdentityManager.initialize(JSON.stringify(stored_creds));
        } else {
          IdentityManager.registerOAuthInfos([info]);
        }
        this.identityManager = IdentityManager;
        this.portal = new Portal.Portal(environment.portal_setting.url);
        this.identityManagerObs.complete();
      });
  }

  authenticate(token?: string, username?: string, expires?: string) {
    console.log('start');
    return new Observable(obs => {
      this.identityManagerObs.subscribe(() => {
        if (token !== undefined && username !== undefined) {
          this.identityManager.registerToken({
            expires: expires,
            server: `${environment.portal_setting.url}/sharing`,
            ssl: true,
            token: token,
            userId: username
          });
        }
        const vm = this;
        this.identityManager.checkSignInStatus(`${environment.portal_setting.url}/sharing`).then(function () {
          vm.portal.signIn().then(function (portalUser) {
            vm.full_name = portalUser.fullName;
            vm.user_name = portalUser.username;
            vm.authenticated = true;
            localStorage.setItem('arcgis_creds', vm.identityManager.toJson());
            obs.next();
          }).otherwise(function () {
            obs.error();
          });
        }).otherwise(function () {
          vm.identityManager.getCredential(`${environment.portal_setting.url}/sharing`);
        });
      });
    }).subscribe();
  }

  logout() {
    this.user_name = null;
    this.full_name = null;
    this.authenticated = false;
    this.identityManagerObs.subscribe(() => {
      this.identityManager.destroyCredentials();
    });
    localStorage.clearAll();
    location.reload();
  }

}
