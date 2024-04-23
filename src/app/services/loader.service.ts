import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  visibility: BehaviorSubject<boolean>;

  constructor() {
    this.visibility = new BehaviorSubject(false);
  }

  show() {
    this.visibility.next(true);
    // console.log('this.visibility in show >> ', this.visibility);
  }

  hide() {
    this.visibility.next(false);
    // console.log('this.visibility in hide >> ', this.visibility);
  }
}
