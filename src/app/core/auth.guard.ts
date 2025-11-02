import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GeneralService } from './gerneral.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(GeneralService);

  const token = auth.getToken();
  const user = auth.getUser();
 console.log(user);
 
  if (!token || !user) {
    router.navigate(['/login']);
    return false;
  }

  // Redirección según rol al acceder a rutas base ('' o directamente a '/')
 /*  if (state.url === '/' || state.url === '/login') {
    
    const role = user.role?.name;
      console.log(user);
      
    if (role === 'ADMIN') {
      router.navigate(['/admin']);
      return false;
    }

    if (role === 'TEACHER' || role === 'TUTOR') {
      router.navigate(['/home']);
      return false;
    }

    // Redirige a ruta genérica si el rol no está mapeado
    router.navigate(['/home']);
    return false;
  }
 */
  return true;
};