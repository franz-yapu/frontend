import { Routes } from '@angular/router';
import { ClientesComponent } from './clientes.component';
import { ClienteDeatailComponent } from './cliente-deatail/cliente-deatail.component';



export const routes: Routes = [
  {
    path: '',
    component:ClientesComponent ,
  },
  {
    path:':id',
    component:ClienteDeatailComponent
  }
 
];
