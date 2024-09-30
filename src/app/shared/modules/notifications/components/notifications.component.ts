/** Angular core */
import { Component, Input, OnInit, TemplateRef } from '@angular/core'

/** Services */
import { NotificationsService } from '@shared/index'

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' }
})
export class NotificationsComponent implements OnInit{
  
  @Input() headerMessage: string = ''

  public header: string
    
  constructor(
    public notificationService: NotificationsService
  ){
    this.header = ''
  }

  ngOnInit(): void {
    this.header = this.headerMessage
  }

  isTemplate(notification: any) {
		return notification.message instanceof TemplateRef
	}

}
