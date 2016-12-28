import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

import './adlib/adal';

export interface AdalUser {
  userName:string;
  profile:any;
}

export declare class AuthenticationContext {
  _renewActive:boolean;

  constructor(config:AdalConfig);

  login();

  getCachedToken(resource:string):string;

  getCachedUser():AdalUser;

  acquireToken(resource:string, callback:(error?:string, token?:string) => void);

  clearCache();

  clearCacheForResource(resource:string);

  logOut();

  getUser(callback:(error?:string, user?:AdalUser) => void);

  isCallback(hash:string):boolean;

  getLoginError():string;

  getResourceForEndpoint(endpoint:string):string;

  verbose(message:string);

  getRequestInfo(hash:string);

  saveTokenFromHash(requestInfo);

  CONSTANTS:any;

  REQUEST_TYPE:any;

  _getItem(key);

  config:any;

  callback:any;

  popUp:any;

}


export interface AdalConfig {
  tenant?:string;
  clientId?:string;
  redirectUri?:string;
  instance?:string;
  endpoints?:any;
  //endpoints?:any[];
}


@Injectable()
export class AdalAuthenticationService {
  protected _adal:AuthenticationContext;
  public _oauthData = {isAuthenticated: false, userName: '', loginError: '', profile: null};


  constructor(public config:AdalConfig) {
    this._adal = new AuthenticationContext(config);
  }

  getLastError(){
    return this._adal._getItem(this._adal.CONSTANTS.STORAGE.ERROR_DESCRIPTION);
  }

  logout() {
    this._adal.config.postLogoutRedirectUri = null;
    this._adal.logOut();
  }

  logoutWithRedirect(url:string){
    this._adal.config.postLogoutRedirectUri = url;
    this._adal.logOut();
  }

  login() {
    this._adal.login();
  }

  isCallback(hash:string){
    return this._adal.isCallback(hash);
  }

  getCachedToken(resource:string):string {
    return this._adal.getCachedToken(resource);
  }

  acquireToken(url:string):Observable<string> {
    const resource = this._adal.getResourceForEndpoint(url);

    return Observable.create(observer => {
      this._adal._renewActive = true;
      this._adal.acquireToken(resource, (error, token) => {
        this._adal._renewActive = false;
        if (error) {
          observer.error(error);
          observer.complete();
        } else {
          observer.next(token);
          observer.complete();
        }
      });
    });
  }

  getUser():Observable<AdalUser> {
    return Observable.create(observer => {
      this._adal.getUser((error, user) => {
        if (error) {
          observer.error(error);
        } else {
          observer.next(user);
        }
      });
    })
  }

  processCallback() {
    var hash = window.location.hash;

    if (this._adal.isCallback(hash)) {
      // callback can come from login or iframe request
      this._adal.verbose('Processing the hash: ' + hash);
      var requestInfo = this._adal.getRequestInfo(hash);
      this._adal.saveTokenFromHash(requestInfo);

      // Return to callback if it is sent from iframe
      if (requestInfo.stateMatch) {
        if (requestInfo.requestType === this._adal.REQUEST_TYPE.RENEW_TOKEN) {
          var callback = (<any>window.parent).callBackMappedToRenewStates[requestInfo.stateResponse];
          // since this is a token renewal request in iFrame, we don't need to proceed with the location change.
          //event.preventDefault();

          // Call within the same context without full page redirect keeps the callback
          if (callback && typeof callback === 'function') {
            // id_token or access_token can be renewed
            if (requestInfo.parameters['access_token']) {
              callback(this._adal._getItem(this._adal.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters['access_token']);
              return;
            } else if (requestInfo.parameters['id_token']) {
              callback(this._adal._getItem(this._adal.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters['id_token']);
              return;
            } else if (requestInfo.parameters['error']) {
              callback(this._adal._getItem(this._adal.CONSTANTS.STORAGE.ERROR_DESCRIPTION), null);
              return;
            }
          }
        } else if (requestInfo.requestType === this._adal.REQUEST_TYPE.LOGIN) {
          // normal full login redirect happened on the page
          this.updateDataFromCache(this._adal.config.loginResource);
          if (this._oauthData.userName && !this._oauthData.loginError) {
            //$timeout(function () {
            // id_token is added as token for the app
            this.updateDataFromCache(this._adal.config.loginResource);
            // $rootScope.userInfo = _oauthData;
            //}, 1);

            //$rootScope.$broadcast('adal:loginSuccess', _adal._getItem(_adal.CONSTANTS.STORAGE.IDTOKEN));
          } else {
            return {
              requestInfo: requestInfo,
              errorDesc:   this._adal._getItem(this._adal.CONSTANTS.STORAGE.ERROR_DESCRIPTION)
            };
            //$rootScope.$broadcast('adal:loginFailure', _adal._getItem(_adal.CONSTANTS.STORAGE.ERROR_DESCRIPTION));
          }

          if (this._adal.callback && typeof this._adal.callback === 'function')
            this._adal.callback(this._adal._getItem(this._adal.CONSTANTS.STORAGE.ERROR_DESCRIPTION),
              this._adal._getItem(this._adal.CONSTANTS.STORAGE.IDTOKEN));

          //event.preventDefault();
          // redirect to login start page
          if (!this._adal.popUp) {
            var loginStartPage = this._adal._getItem(this._adal.CONSTANTS.STORAGE.LOGIN_REQUEST);
            if (loginStartPage) {
              // prevent the current location change and redirect the user back to the login start page
              this._adal.verbose('Redirecting to start page: ' + loginStartPage);
              // if (!$location.$$html5 && loginStartPage.indexOf('#') > -1) {
              //   $location.url(loginStartPage.substring(loginStartPage.indexOf('#') + 1));
              // }
              window.location.replace(loginStartPage);
            }
          }
        }
      }
      else {
        // state did not match, broadcast an error
        //$rootScope.$broadcast('adal:stateMismatch', _adal._getItem(_adal.CONSTANTS.STORAGE.ERROR_DESCRIPTION));
      }
    } else {
      // No callback. App resumes after closing or moving to new page.
      // Check token and username
      this.updateDataFromCache(this._adal.config.loginResource);
      if (!this._oauthData.isAuthenticated && this._oauthData.userName && !this._adal._renewActive) {
        // id_token is expired or not present
        this._adal._renewActive = true;
        this._adal.acquireToken(this._adal.config.loginResource, function (error, tokenOut) {
          this._adal._renewActive = false;
          if (error) {
            // $rootScope.$broadcast('adal:loginFailure', 'auto renew failure');
          } else {
            if (tokenOut) {
              this._oauthData.isAuthenticated = true;
            }
          }
        }.bind(this));
      }
    }
  }


  updateDataFromCache(resource) {
    // only cache lookup here to not interrupt with events
    let token = this._adal.getCachedToken(resource);
    this._oauthData.isAuthenticated = token !== null && token.length > 0;
    let user:any = this._adal.getCachedUser() || {userName: ''};
    this._oauthData.userName = user.userName;
    this._oauthData.profile = user.profile;
    this._oauthData.loginError = this._adal.getLoginError();
  };
}
