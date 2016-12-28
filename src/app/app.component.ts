/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';

import { AppState } from './app.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `
    <nav>
      <span>
        <a [routerLink]=" ['./'] ">
          Index
        </a>
      </span>     
      |
      <span>
        <a [routerLink]=" ['./restricted'] ">
          Restricted By AD
        </a>
      </span>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>   
  `
})
export class AppComponent {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Active Directory Authentication Library example for Angular 2';
  url = 'https://github.com/Kuzq/ADAL-Angular2-Example';

  constructor(
    public appState: AppState) {

  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}
