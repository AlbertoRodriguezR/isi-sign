import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {

  private _isLoading: BehaviorSubject<boolean>
  public isLoading$: Observable<boolean>

  constructor() {
    this._isLoading = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this._isLoading.asObservable()
  }

  show() {
     this._isLoading.next(true);
  }

  hide() {
    this._isLoading.next(false);
  }
}
