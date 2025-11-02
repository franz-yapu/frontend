import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-lobby',
  imports: [],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss'
})
export class LobbyComponent {


  constructor(private router: Router){

  }

  login(){
   this.router.navigate(['/login']);

  }
}
