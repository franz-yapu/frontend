import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeAttendanceComponent } from './home-attendance/home-attendance.component';
import { HomeBehaviorComponent } from './home-behavior/home-behavior.component';
import { HomeRecordComponent } from './home-record/home-record.component';
import { HomeAboutComponent } from './home-about/home-about.component';



export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
       {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full' // importante
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'attendance/:id',
        component: HomeAttendanceComponent
      },
      {
        path: 'record/:id',
        component: HomeRecordComponent
      },
      {
        path: 'behavior/:id',
        component: HomeBehaviorComponent
      },{
        path: 'notes',
        component: HomeRecordComponent
      },
      {
        path: 'about',
        component: HomeAboutComponent
      },
    ]
  },
  

 
 
];
