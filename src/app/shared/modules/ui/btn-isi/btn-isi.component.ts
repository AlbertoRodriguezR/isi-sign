import { Component, Input } from '@angular/core';
import { IsiButton } from '../models/btn-isi.interface';

@Component({
  selector: 'btn-isi',
  templateUrl: './btn-isi.component.html',
  styleUrls: ['./btn-isi.component.scss']
})
export class IsiButtonComponent {

  /**
   * Atributos del objeto props:
   * caption
   * type
   * className
   * 
   */
  @Input() props: IsiButton | null
  @Input() disabled: boolean

  constructor(){
    this.props = null
    this.disabled = false
  }

}
