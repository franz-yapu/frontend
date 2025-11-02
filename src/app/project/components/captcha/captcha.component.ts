import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environmentDefault } from '../../../../environments/default';

@Component({
  selector: 'app-captcha',
  imports: [],
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.scss'
})
export class CaptchaComponent implements OnInit {
  siteKey = environmentDefault.siteKey; // ReCAPTCHA site key from environment

  @Output() resolved = new EventEmitter<string>();
  ngOnInit(): void {
    console.log('CaptchaComponent initialized with siteKey:', this.siteKey);
    
  }
  handleSuccess(response: any) {
    this.resolved.emit(response);
  }

  ngAfterViewInit() {
    // El script ya inserta el captcha automáticamente
    // Pero si necesitas forzarlo, podrías usar grecaptcha.render
  }
}