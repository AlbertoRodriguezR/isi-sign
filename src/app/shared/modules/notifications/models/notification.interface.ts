import { NotificationTypes } from '@shared/index'

export interface Notification{
    type: NotificationTypes,
    title: string,
    message: string,
}
