# Active Directory Authentication Library example for Angular 2

This example shows how to use AD Auth with Angular 2.

## Used libraries
Еhe project is based on the following libraries:

* [Angular2 Webpack Starter](https://github.com/AngularClass/angular2-webpack-starter)
* [Active Directory Authentication Library (ADAL) for JavaScript (damienpontifex's fork)](https://github.com/damienpontifex/azure-activedirectory-library-for-js)

### Quick start
**Make sure you have Node version >= 5.0 and NPM >= 3**

[Detailed instruction](https://github.com/AngularClass/angular2-webpack-starter)

```bash
# clone  repo
git clone --depth 1 https://github.com/Kuzq/ADAL-Angular2-Example

# change directory to our repo
cd ADAL-Angular2-Example

# install the repo with npm
npm install

# start the server
npm start
```
go to [http://localhost:3000](http://localhost:3000) in your browser

## Points of interest in the file structure
Project file structure is based on Angular 2 Webpack Starter. The redundant parts were removed.
Added/changed files are listed below:
```
angular2-webpack-starter/
 │
 └──src/                       
    └──app/                   
         ├──app.routes.ts       
         │
         └──services/  
               ├──adlib
               │    └─ adal.js
               ├──adlib
               ├──adalHttp.ts              
               ├──adalWrapperService.ts  
               ├──authGuardArea.ts         
               └──sysConfig.ts

```
## Files Description
1. /src/app/services/sysConfig.ts Initialize adal with the AAD app coordinates at app config time
```js
this.aDOptions = <AdalConfig>{
      tenant: '*TenantId*',
      clientId: '*ClientId (Audience) *',
      redirectUri: 'https://localhost:3000',
      instance: 'https://login.microsoftonline.com/'
    };
```
3. ./src/app/services/adalWrapperService.ts A simple AdalHttp wrapper. Useful when your app requires to request additional auth info from API (e.g. user permissions list)

4. /src/app/services/authGuardArea.ts The CanActivate guard that tries to acquire token from AD. If it successed, that means that user is authenticated. Due to AD premission restrinctions user may not have access to specified route. To to account this case the additional check of accessDenied variable is used.

## Aсtive Directory Useful Links
* [Authentication Scenarios for Azure AD](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-authentication-scenarios)
* [Secure a Web API with Individual Accounts and Local Login in ASP.NET Web API 2.2](https://www.asp.net/web-api/overview/security/individual-accounts-in-web-api)

___

# License
 [MIT](/LICENSE)