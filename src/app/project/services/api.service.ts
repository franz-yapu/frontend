import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { GeneralService } from '../../core/gerneral.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private generalService: GeneralService
  ) {}

  private get url(): string {
    return environment.backend;
  }

  // Ejemplo: Método de login
  login(credentials: { email: string, password: string }) {
    return this.http.post(`${environment.backend}/auth/login`, credentials, {
    }).pipe(
      tap((response: any) => {
        if (response.access_token) {
          this.generalService.setSaveToken(response.access_token);
        }
      })
    );
  }

  getProducts() {
    return firstValueFrom(this.http.get(`${environment.backend}/products`));
  }




}