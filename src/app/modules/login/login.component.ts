import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { ApiService } from '../../project/services/api.service';
import { CommonModule } from '@angular/common';
import { GeneralService } from '../../core/gerneral.service';
import { ScCheckboxReCaptcha } from '@semantic-components/re-captcha';
import { environment } from '../../../environments/environment';
import { ToasterService } from '../../project/services/toaster.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ScCheckboxReCaptcha],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})

export class LoginComponent {
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', Validators.required],
    captcha: ['', Validators.required],
  });
  siteKey = environment.siteKey; //You can also provide it globally with provideScReCaptchaSettings

  private auth = inject(GeneralService);
  constructor(
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private toaster: ToasterService,
  ) { }

  onSubmit() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.apiService.login({ username: username!, password: password! }).subscribe({
        next: (res: any) => {
          if (res.access_token) {
            const user = this.auth.getUser();
            const role = user?.role?.name;
            if (role === 'ADMIN' || role === 'TEACHER' ) {
              this.router.navigate(['/admin']);
            } else if ( role === 'TUTOR') {
              this.router.navigate(['/home']);
            } else {
              this.router.navigate(['/home']); // ruta genérica por si acaso
            }
             this.toaster.showToast({
              severity: 'success',
              summary: 'Exito de inicio de sesión',
              detail: 'Bienvenido al sistema', 
            });
          } else {
            this.toaster.showToast({
              severity: 'error',
              summary: 'Fallo de inicio de sesión',
              detail: 'Usuario o contraseña incorrectos',
            });
          }

        }
      });
    }
  }
}