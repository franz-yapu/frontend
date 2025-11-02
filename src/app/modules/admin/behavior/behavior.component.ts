import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { GeneralService } from '../../../core/gerneral.service';
import { Router } from '@angular/router';
import { CoursesAllComponent } from "../../../project/components/courses-all/courses-all.component";

@Component({
  selector: 'app-behavior',
  imports: [CommonModule, CoursesAllComponent],
  templateUrl: './behavior.component.html',
  styleUrl: './behavior.component.scss'
})
export class BehaviorComponent implements OnInit{
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
    this.router.navigate(['/admin/behavior/',event.id])
    }
   
}
