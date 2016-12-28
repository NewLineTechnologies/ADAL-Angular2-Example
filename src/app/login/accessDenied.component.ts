import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';


@Component({
  selector: 'access-denied',
  template: require('./accessDenied.html')
})
export class AccessDenied {
  public error: string;

  constructor() {
  }
}
