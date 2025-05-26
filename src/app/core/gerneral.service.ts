import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(environment.appCode + '.token');
    }
    return null; 
  }

  setSaveToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(environment.appCode + '.token', token);
    }
  }


}