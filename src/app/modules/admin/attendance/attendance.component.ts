import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { DialogService } from 'primeng/dynamicdialog';
import { GeneralService } from '../../../core/gerneral.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoursesAllComponent } from "../../../project/components/courses-all/courses-all.component";

@Component({
  selector: 'app-attendance',
  imports: [CommonModule, CoursesAllComponent],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent implements OnInit{
  public courses:any;
 constructor( private adminService:AdminService,
              
              private generalService: GeneralService,
              private router: Router
            ) { }
 ngOnInit(): void {
    this.generalService.show(); // option
    this.loadCourses();
  }

  async loadCourses() {
    this.courses = await this.adminService.getUserCourse()
    this.generalService.hide(); // option
  } 

 student(event:any){
    this.router.navigate(['/admin/list-attendance/',event.id])
    }
   
}
