import {  Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';

import {  from, Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';


/* import { MenuStore } from '@project/services/menu.store'; */
import { GeneralService } from './gerneral.service';


const recursiveFn :any = (menus: Array<any>,url: Array<string>) => {
  return menus.reduce((res: any, menu: any) => {
    if(menu.children) {
      return recursiveFn(menu.children, url) || res;
    } else {
      if(menu.routerLink) {
        return url.includes(menu.routerLink) || res;
      } else {
        return res;
      }
    } 
  }, false);
}
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(
    private router: Router,
    private injector:Injector,
    private gs:GeneralService,
 /*    private menuService :MenuStore */
  ) {

  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> { 
    const {url} = state;

    /* this.menuService.getMenuByGuard(this.gs.user);
    return this.menuService.menus$.pipe(
      filter((data: Array<any>) =>{
        return data.length > 0;
      }),
      switchMap((data: Array<any>) =>{ */
        /* const validate = recursiveFn(data, url.split('/'));
        if(validate) { */
          return of(true)
       /*  } else {
          this.router.navigate(['/login']);
          return of(false);
        } */
    /*   })
    )
     */
  }
}