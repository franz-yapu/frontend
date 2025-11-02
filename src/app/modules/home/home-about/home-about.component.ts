import { Component } from '@angular/core';
import { AboutComponent } from "../../../project/components/about/about.component";
import { BreadCrumbComponent } from '../../../project/components/bread-crumb/bread-crumb.component';

@Component({
  selector: 'app-home-about',
  imports: [AboutComponent,AboutComponent,BreadCrumbComponent],
  templateUrl: './home-about.component.html',
  styleUrl: './home-about.component.scss'
})
export class HomeAboutComponent {
public breadcrumbItems = [
    { label: 'Inicio ', icon: 'school', routerLink: '/home/dashboard' },
    { label: 'Acerca del coloegio ', icon: 'groups', routerLink: '/students' }
  ];
}
