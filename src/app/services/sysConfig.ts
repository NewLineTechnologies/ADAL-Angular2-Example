import {AdalConfig} from "./adalHttp";
import {Injectable} from '@angular/core';

@Injectable()
export class SysConfig {
  public url;
  public port;
  public protocol;
  public fullUrl: string;

  public aDOptions: AdalConfig;
  public defaultResource: string;
  public postLogoutRedirectUri: string;

  public constructor() {

    this.postLogoutRedirectUri = 'https://localhost:3000/';
    this.url = 'localhost';
    this.port = '3000';
    this.protocol = 'https';
    this.fullUrl = this.protocol + "://" + this.url + ":" + this.port + "/api";

    this.aDOptions = <AdalConfig>{
      tenant: '*TenantId*',
      clientId: '*ClientId (Audience) *',
      redirectUri: 'https://localhost:3000',
      instance: 'https://login.microsoftonline.com/'
    };


    this.defaultResource = this.fullUrl + '/users/getAll';
  }
}
