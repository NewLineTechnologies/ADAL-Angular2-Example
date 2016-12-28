"use strict";

import {CanActivate}    from '@angular/router';
import {Injectable} from '@angular/core';
import {AdalWrapperService} from "../services/adalWrapperService";
import {Observable} from 'rxjs/Rx';
import {Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';

@Injectable()
export class AuthGuardArea implements CanActivate {
  constructor(private adalWrapperService:AdalWrapperService, private router:Router) {
  }

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<boolean> | Promise<boolean> | boolean {
    //debugger;
    return Observable.create(observer => {
      var hashResult = this.adalWrapperService.updateHash();
      console.log(hashResult);
      let accessDenied = hashResult && hashResult.requestInfo && hashResult.requestInfo.parameters.error;

      return this.adalWrapperService.acquireToken().subscribe((token)=> {
        if (token) {
          observer.next(true);
          observer.complete();
          return;
        }

        if (accessDenied) {
          this.router.navigate(['/access-denied']);
        } else {
          this.adalWrapperService.toLoginPage();
        }

        observer.next(false);

      }, (err) => {

        if(err && err.status){
          this.router.navigate(['/']);
          observer.next(false);
          return;
        }

        if (accessDenied) {
          this.router.navigate(['/access-denied']);
        } else {
          this.adalWrapperService.toLoginPage();
        }
        observer.next(false);

      });
    });
  }
}
