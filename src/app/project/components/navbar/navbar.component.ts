import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { GeneralService } from '../../../core/gerneral.service';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
public user:any
public navItems:any
isMenuOpen = false;
constructor(private generalService:GeneralService, private service:ApiService){

}

ngOnInit(): void {
 this.user =  this.generalService.getUser()
/*  if(this.user?.role?.name =="ADMIN"){
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
  */

  
}

logout() {
this.service.logout();
}
 
}