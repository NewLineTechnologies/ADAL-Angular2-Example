import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'restricted',
  styles: [`
  `],
  template: `
    <h1>Page requires AD auth</h1>
 
  `
})
export class RestrictedComponent {

  constructor(public route: ActivatedRoute) {

  }

}
