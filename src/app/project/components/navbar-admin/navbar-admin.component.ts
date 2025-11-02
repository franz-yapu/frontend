import { Component, Input, OnInit } from '@angular/core';
import { GeneralService } from '../../../core/gerneral.service';
import { ApiService } from '../../services/api.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-admin',
  imports: [CommonModule,RouterLink],
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.scss'
})
export class NavbarAdminComponent implements OnInit {
public user:any
public navItems:any
@Input() isMenuOpen = false;
constructor(private generalService:GeneralService, private service:ApiService){

}

ngOnInit(): void {
 this.user =  this.generalService.getUser()
 if(this.user?.role?.name =="ADMIN"){
 this.navItems= [
    {
      path: 'products',
      title: 'Productos',
      activeClass: 'border-indigo-500 text-gray-900',
      inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    },
    {
      path: 'cliente',
      title: 'cliente',
      activeClass: 'border-indigo-500 text-gray-900',
      inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    },
    {
      path: 'style',
      title: 'Style',
      activeClass: 'border-indigo-500 text-gray-900',
      inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    },
   
  ];
 }else{
this.navItems= [
  
    {
      path: 'category',
      title: 'Categorias',
      activeClass: 'border-indigo-500 text-gray-900',
      inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    },
    {
      path: 'category',
      title: 'Categorias 2',
      activeClass: 'border-indigo-500 text-gray-900',
      inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    }
  ];

 }
 

  
}
toggleMenu() {
  this.isMenuOpen = !this.isMenuOpen;
}
logout() {
this.service.logout();
}
}