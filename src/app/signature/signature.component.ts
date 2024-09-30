import { Component, ElementRef, HostListener, ViewChild } from '@angular/core'
import { IsiButton, TranslationPipe } from '@shared/index'

import SignaturePad from 'signature_pad'
import { SignatureService } from './services/signature.service'

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
  providers: [TranslationPipe],
})
export class SignatureComponent {
  @ViewChild('signPad', { static: true }) signPad: ElementRef
  @ViewChild('screen', { static: true }) screen: ElementRef

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.resizeCanvas()
  }
  @HostListener('window:fullscreenchange', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(document.fullscreenElement)
    event.preventDefault()
  }

  protected signature: SignaturePad
  protected windowWidth: number
  protected saveButtonProps: IsiButton
  protected clearButtonProps: IsiButton
  protected documents: any[]

  constructor(
    private signatureService: SignatureService,
    private translationPipe: TranslationPipe
  ) {
    this.saveButtonProps = {
      caption: this.translationPipe.transform('signature.save'),
      type: 'button',
      className: 'btn-primary',
      large: true,
    }
    this.clearButtonProps = {
      caption: this.translationPipe.transform('signature.clear'),
      type: 'button',
      className: 'btn-secondary',
      large: true,
    }
    this.documents = []
  }

  ngOnInit(): void {
    if (
      this.screen.nativeElement &&
      this.screen.nativeElement.requestFullscreen
    ) {
      this.screen.nativeElement.requestFullscreen()
    }
    // this.getDocuments()
    this.signature = new SignaturePad(this.signPad.nativeElement)
    this.dataListener()
  }

  dataListener(): void {
    const androidUserAgentString = window.navigator.userAgent.slice(
      window.navigator.userAgent.indexOf('Android')
    )
    const androidDeviceName = androidUserAgentString.slice(
      androidUserAgentString.indexOf('; ') + 1,
      androidUserAgentString.indexOf(')')
    )

    setInterval(() => {
      this.getDocuments(androidDeviceName.trim())
    }, 1000)
  }

  getDocuments(deviceName: string): void {
    this.signatureService.loadDocuments(deviceName).subscribe({
      next: documents => {
        this.documents = documents
      },
    })
  }

  resizeCanvas(): void {
    this.windowWidth = window.innerWidth
  }

  clear(): void {
    this.signature.clear()
  }

  save(): void {
    const signatureImg =
      this.signature
        .toDataURL()
        .replace(/^data:image\/(png|jpg);base64,/, '') || null
  }
}
