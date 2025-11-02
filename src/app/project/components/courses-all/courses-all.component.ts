import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../../modules/home/home.service';
import { AdminService } from '../../../modules/admin/admin.service';

@Component({
  selector: 'app-courses-all',
  imports: [CommonModule, FormsModule],
  templateUrl: './courses-all.component.html',
  styleUrl: './courses-all.component.scss',
})
export class CoursesAllComponent {
  @Input() courses: any = [];
  @Input() edit: boolean = true;
  @Input() add: boolean = true;
  @Output() courseSelected = new EventEmitter<any>();
  @Output() courseAdded = new EventEmitter<void>();
  @Output() courseEdited = new EventEmitter<any>();
  @Output() courseDelete = new EventEmitter<any>();
  filteredCourses: any[] = [];
  searchTerm: string = '';
 constructor(private adminService:AdminService,) {}
  ngOnChanges() {
    const data = this.courses?.data || [];
    this.filteredCourses = this.sortCourses(data);
  }

  openEditModal(items: any) {
    this.courseEdited.emit(items);
  }

  openEliminar(items: any) {
   this.adminService.eliminarCourse(items.id).then(res=>{
   this.courseDelete.emit(items);
   });
  }

  openAddModal() {
    this.courseAdded.emit();
  }

  studentSelected(items: any) {
    this.courseSelected.emit(items);
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    const data = this.courses?.data?.filter((item: any) =>
      item.name.toLowerCase().includes(term) ||
      (item.user?.firstName + ' ' + item.user?.lastName)
        .toLowerCase()
        .includes(term)
    ) || [];

    this.filteredCourses = this.sortCourses(data);
  }

  private sortCourses(courses: any[]): any[] {
    return courses.sort((a, b) => {
      const levelA = a.level?.toLowerCase() || '';
      const levelB = b.level?.toLowerCase() || '';
      if (levelA < levelB) return -1;
      if (levelA > levelB) return 1;

      const sectionA = a.section?.toLowerCase() || '';
      const sectionB = b.section?.toLowerCase() || '';
      if (sectionA < sectionB) return -1;
      if (sectionA > sectionB) return 1;

      return 0;
    });
  }
}
