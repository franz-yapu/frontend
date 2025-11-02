import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { GeneralService } from '../../../core/gerneral.service';
import { Router } from '@angular/router';
import { CoursesAllComponent } from "../../../project/components/courses-all/courses-all.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-record-academic',
  imports: [CoursesAllComponent,CommonModule],
  templateUrl: './record-academic.component.html',
  styleUrl: './record-academic.component.scss'
})
export class RecordAcademicComponent implements OnInit {
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
    this.router.navigate(['/admin/record/',event.id])
    }
  }