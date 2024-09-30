/** Angular core */
import { Injectable, TemplateRef } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  public notifications: any[]

  constructor() { 
    this.notifications = []    
  }  

  showError(message: string | TemplateRef<any>, options: any = {}) {
    this.show(message,  { classname: 'bg-danger text-light', delay: 3000 })
  }

  showSuccess(message: string | TemplateRef<any>, options: any = {}) {
    this.show(message,  { classname: 'bg-success text-light', delay: 3000 })
  }

  remove(notification: any) {
		this.notifications = this.notifications.filter((t) => t !== notification)
	}

	clear() {
		this.notifications.splice(0, this.notifications.length)
	}

  show(message: string | TemplateRef<any>, options: any = {}) {
    this.notifications.push({ message, ...options })
  }
}
