import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CoursesComponent } from './courses/courses.component';
import { TeachersComponent } from './teachers/teachers.component';
import { StudentsComponent } from './students/students.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { ListAttendanceComponent } from './attendance/list-attendance/list-attendance.component';
import { BehaviorComponent } from './behavior/behavior.component';
import { ListStudentsBehaviorComponent } from './behavior/list-students-behavior/list-students-behavior.component';
import { BehaviorStudentComponent } from './behavior/behavior-student/behavior-student.component';
import { RecordComponent } from './record-academic/record/record.component';
import { RecordAcademicComponent } from './record-academic/record-academic.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AboutSchoolComponent } from './about-school/about-school.component';
import { RecordListComponent } from './record-academic/record-list/record-list.component';
import { StudentRecordComponent } from './record-academic/student-record/student-record.component';
import { AttendanceHistoryComponent } from './attendance/attendance-history/attendance-history.component';
import { UserDetailComponent } from './teachers/user-detail/user-detail.component';





export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full' // importante
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin-dashboard/admin-dashboard.component')
            .then(m => m.AdminDashboardComponent),
        runGuardsAndResolvers: 'always'   
      },
      {
        path: 'dashboard-teacher',
        loadComponent: () =>
          import('./teacher-dashborad/teacher-dashborad.component')
            .then(m => m.TeacherDashboradComponent),
        runGuardsAndResolvers: 'always'   
      },
      {
        path: 'courses',
        component: CoursesComponent
      },
      {
        path: 'teacher',
        component: TeachersComponent
      },
      {
        path: 'student/:id',
        component: StudentsComponent
      },
      {
        path: 'attendance',
        component: AttendanceComponent
      },
      {
        path: 'list-attendance/:id',
        component: ListAttendanceComponent
      },
      {
        path: 'behavior',
        component: BehaviorComponent
      },
      {
        path: 'behavior/:id',
        component: ListStudentsBehaviorComponent
      },
      {
        path: 'behaviors/:id',
        component: BehaviorStudentComponent
      },
      {
        path: 'record',
        component: RecordAcademicComponent
      },
      {
      path: 'attendance-history/:id',
     component: AttendanceHistoryComponent
    },
      /* {
        path: 'record/:id',
        component: RecordComponent
      }, */
       {
      path: 'record/:id',
      component: RecordListComponent
    },
    {
     path: 'record/:courseId/student/:studentId',
     component: StudentRecordComponent
     },

      {
        path: 'teacher/users/:id',
        component: UserDetailComponent
      },
      {
        path: 'about',
        component: AboutSchoolComponent
      },
    ]
  },
];
