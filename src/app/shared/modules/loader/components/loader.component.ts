/** Angular core */
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

/** App imports */
import { LoaderService } from '@shared/modules/loader/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html'
})
export class LoaderComponent {

  public loading$: Observable<boolean>

  constructor(
    private loaderService: LoaderService
  ) { 
    this.loading$ = this.loaderService.isLoading$
  }
}