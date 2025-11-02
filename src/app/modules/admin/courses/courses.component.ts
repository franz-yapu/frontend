import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GeneralService } from '../../../core/gerneral.service';
import { CoursesModalComponent } from './courses-modal/courses-modal.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CoursesAllComponent } from '../../../project/components/courses-all/courses-all.component';

@Component({
  selector: 'app-courses',
  imports: [CommonModule,CoursesAllComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
   providers: [DialogService],
})
export class CoursesComponent implements OnInit{
  public courses:any;
   ref!: DynamicDialogRef;
 constructor( private adminService:AdminService,
              private dialogService: DialogService,
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
  openAddModal() {
      this.ref = this.dialogService.open(CoursesModalComponent, {
        header: 'Nuevo curso',
        width: '800px',
        closable: true,
          closeOnEscape: true,       // Permite cerrar con la tecla ESC
       dismissableMask: true 
      });
      this.ref.onClose.subscribe((data: any) => {
        
    
          this.loadCourses()
      
      });
    }
  
    openEditModal(product:any){
      this.ref = this.dialogService.open(CoursesModalComponent, {
        data: { data: product},
        header: 'Editar curso',
        width: '800px',
        closable: true,
       closeOnEscape: true,       // Permite cerrar con la tecla ESC
       dismissableMask: true      // Permite cerrar haciendo clic fuera del modal
      });
  
      this.ref.onClose.subscribe((data: any) => {
          this.loadCourses()
      });
    } 

    student(event:any){
    this.router.navigate(['/admin/student/',event.id])
    }

    courseDelete(event:any){
      this.ngOnInit()
    }
}
