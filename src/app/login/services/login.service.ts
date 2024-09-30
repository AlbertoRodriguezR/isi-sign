import { Injectable } from '@angular/core';
// import { CustomerHelpTableService } from '@shared/index';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    // private workOrdersTableService: WorkOrdersTableService,
    // private workOrderDetailTableService: WorkOrderDetailTableService,
    // private workOrderLaborTableService: WorkOrderLaborTableService,
    // private customerHelpTableService: CustomerHelpTableService
  ) { }

  resetTablesState(): void{
    // this.workOrdersTableService.resetState()
    // this.workOrderDetailTableService.resetState()
    // this.workOrderLaborTableService.resetState()
    // this.customerHelpTableService.resetState()
  }
}
