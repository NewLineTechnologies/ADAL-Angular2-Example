import {Injectable} from '@angular/core';
import {AdalAuthenticationService} from "./adalHttp";
import {Observable} from 'rxjs/Rx';
import {EventEmitter} from "@angular/core"

import {SysConfig} from "./sysConfig";
import 'rxjs/add/operator/toPromise';


@Injectable()
export class AdalWrapperService {

  constructor(private adal: AdalAuthenticationService,
              private sysConfig: SysConfig) {
  }

  acquireToken(url?: string): Observable<string> {
    return this.adal.acquireToken(url ||  this.sysConfig.defaultResource);
  }

  toLoginPage() {
    this.adal.login();
  }

  logout() {
    this.adal.logout();
  }

  logoutWithRedirect() {
    this.adal.logoutWithRedirect(this.sysConfig.postLogoutRedirectUri);
  }

  updateHash() {
    let processResult = this.adal.processCallback();

    return processResult;
  }

  hasAuthHash() {
    var hash = window.location.hash;

    return this.adal.isCallback(hash);
  }

  isAuthenticated() {
    return !this.adal._oauthData ? false : this.adal._oauthData.isAuthenticated;
  }

  get() {
    return this.adal._oauthData;
  }

  getDisplayName(): string {
    if (this.adal._oauthData && this.adal._oauthData.profile) {
      return this.adal._oauthData.profile.upn;
    }

    return '';
  }
}
