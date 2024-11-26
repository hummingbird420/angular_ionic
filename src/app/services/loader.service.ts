import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() {}
  loadState: BehaviorSubject<boolean> = new BehaviorSubject(false);
   showLoader() {
    this.loadState.next(true);
  }

   hideLoader() {
    this.loadState.next(false);
  }
}
