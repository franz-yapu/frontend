import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        loadChildren: () => import('./modules/login/login.routes').then(m => m.routes),
        title: 'Login'
    },
    {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.routes').then(m => m.routes),
        canActivate: [authGuard] ,
        title: 'home'
    },
    {
        path: 'home',
        loadChildren: () => import('./modules/home/home.routes').then(m => m.routes),
        canActivate: [authGuard] ,
        title: 'home'
    },

     {
        path: 'home-clientes',
        loadChildren: () => import('./modules/lobby/lobby.routes').then(m => m.routes),
        canActivate: [authGuard] ,
        title: 'home'
    },
];