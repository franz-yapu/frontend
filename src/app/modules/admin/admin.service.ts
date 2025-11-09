import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from '../../core/gerneral.service';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient,
    private generalService: GeneralService) { }
/* user service */
  getUser() {
    const include = {
      role: true
    };
    const perPage=1000;
    const params = new HttpParams()

      .set('include', JSON.stringify(include))
      .set('perPage', JSON.stringify(perPage))
    return firstValueFrom(this.http.get(`${environment.backend}/dynamic/user/all/paginate`, { params }));
  }

  createUser(data: any) {
    return firstValueFrom(this.http.post(`${environment.backend}/users`, data));
  }


  updateUser(id: string, data: any) {
    return firstValueFrom(this.http.patch(`${environment.backend}/dynamic/user/${id}`, data));
  }

  getRoles() {
  
    return firstValueFrom(this.http.get(`${environment.backend}/dynamic/role`));
  }

  getUserTeacher() {
    const where = {roleId:{contains:"30a3f3c0-c20e-4673-a4fc-80614cda35d2"}};
    const params = new HttpParams()
      .set('where', JSON.stringify(where))
       .set('perPage', JSON.stringify(1000))
    return firstValueFrom(this.http.get(`${environment.backend}/dynamic/user/all/paginate`, { params }));
  }

/* Couse Service */
 getUserCourse(page: number = 1, perPage: number = 1000, searchTerm: string = '') {
  const include = {"students": true, "user": true};
  let params = new HttpParams()
    .set('include', JSON.stringify(include))
    .set('page', page.toString())
    .set('perPage', perPage.toString());

  // Si hay término de búsqueda, lo agregamos
  if (searchTerm) {
    params = params.set('search', searchTerm);
  }

  return firstValueFrom(this.http.get(`${environment.backend}/dynamic/Grade/all/paginate`, { params }));
}
   createCourse(data: any) {
    return firstValueFrom(this.http.post(`${environment.backend}/dynamic/Grade`, data));
  }

   eliminarCourse(id: any) {
    return firstValueFrom(this.http.delete(`${environment.backend}/dynamic/Grade/${id}`));
  }

  updateCourse(id: string, data: any) {
    return firstValueFrom(this.http.patch(`${environment.backend}/dynamic/Grade/${id}`, data));
  }

  /* Student service */
  getStudentsCouses(id_couse:string) {
    const where = {"id":id_couse};
    const include =  {"students":true}
    const params = new HttpParams()
      .set('where', JSON.stringify(where))
      .set('include', JSON.stringify(include))
       .set('perPage', JSON.stringify(1000));
    return firstValueFrom(this.http.get(`${environment.backend}/dynamic/Grade/all/paginate`, { params }));
  }


   createStudent(data:any) {
    return firstValueFrom(this.http.post(`${environment.backend}/dynamic/Student`, data));
   }
    eliminarStudent(id: any) {
    return firstValueFrom(this.http.delete(`${environment.backend}/dynamic/Student/${id}`));
  }

    updateStudent(id: string, data: any) {
    return firstValueFrom(this.http.patch(`${environment.backend}/dynamic/Student/${id}`, data));
  }

   createAttendance(data:any) {
    return firstValueFrom(this.http.post(`${environment.backend}/dynamic/Attendance`, data));
   }
   updateAttendance(id: string, data: any) {
    return firstValueFrom(this.http.patch(`${environment.backend}/dynamic/Attendance/${id}`, data));
   }

   getAttendance(id_couse:string) {
    const where = {"notes":id_couse};
    const params = new HttpParams()
      .set('where', JSON.stringify(where))
       .set('perPage', JSON.stringify(10000))
    return firstValueFrom(this.http.get(`${environment.backend}/dynamic/Attendance/all/paginate`, { params }));
  }


  //comportamiento
  getStudentsBehavior(id_couse:string) {
    const where =  {gradeId:{equals:id_couse}};
    const include =  {"behaviors":true}
    const params = new HttpParams()
      .set('where', JSON.stringify(where))
      .set('include', JSON.stringify(include))
       .set('perPage', JSON.stringify(1000))
    return firstValueFrom(this.http.get(`${environment.backend}/dynamic/Student/all/paginate`, { params }));
  }

  createBehavior(data:any) {
    return firstValueFrom(this.http.post(`${environment.backend}/dynamic/Behavior`, data));
   }

  getBehaviors(id_student:string) {
    const where =  {"id":id_student};
    const include =  {"behaviors":true}
    const params = new HttpParams()
      .set('where', JSON.stringify(where))
      .set('include', JSON.stringify(include))
       .set('perPage', JSON.stringify(1000))
    return firstValueFrom(this.http.get(`${environment.backend}/dynamic/Student/all/paginate`, { params }));
  }
 // record academic
  getrecords(id_couse:string) {
    const where =  {gradeId:{equals:id_couse}};
    const include =  {"record":true}
    const params = new HttpParams()
      .set('where', JSON.stringify(where))
      .set('include', JSON.stringify(include))
       .set('perPage', JSON.stringify(1000))
    return firstValueFrom(this.http.get(`${environment.backend}/dynamic/Student/all/paginate`, { params }));
  }

  createRecords(data:any) {
    return firstValueFrom(this.http.post(`${environment.backend}/dynamic/AcademicRecord`, data));
   }


  editRecord(id: string, data: any) {
    return firstValueFrom(this.http.patch(`${environment.backend}/dynamic/AcademicRecord/${id}`, data));
   }

   getCourseTeacher(mainTeacherId:string) {
    const where = {mainTeacherId:{equals:mainTeacherId}}
    const params = new HttpParams()
      .set('where', JSON.stringify(where))
       .set('perPage', JSON.stringify(1000))
    return firstValueFrom(this.http.get(`${environment.backend}/dynamic/Grade/all/paginate`, { params }));
  }

  getSubjects() {
  const params = new HttpParams()
    .set('perPage', JSON.stringify(1000))
  return firstValueFrom(this.http.get(`${environment.backend}/dynamic/Subject/all/paginate`, { params }));
}

getStudentById(studentId: string) {
  const include = {
    record: true,
    grade: true
  };
   const where = {id:{equals:studentId}}
  const params = new HttpParams()
  
    .set('include', JSON.stringify(include))
   .set('where', JSON.stringify(where))
    .set('perPage', JSON.stringify(1000))
  return firstValueFrom(this.http.get(`${environment.backend}/dynamic/Student/all/paginate`, { params }));
}

  createMessage(data:any) {
    return firstValueFrom(this.http.post(`${environment.backend}/whatsapp/send`, data));
   }


   getDashboard() {
    return firstValueFrom(this.http.get(`${environment.backend}/dashboard`));
  }
  getDashboardcourse(id:string) {
    return firstValueFrom(this.http.get(`${environment.backend}/dashboard/curso/${id}`));
  }

    userDelete(id: string) {
    return firstValueFrom(this.http.delete(`${environment.backend}/users/${id}`));
  }


    getStudentAttendances(studentId: string) {
    const where = {"studentId":studentId};
    const params = new HttpParams()
      .set('where', JSON.stringify(where))
      .set('perPage', JSON.stringify(1000))
    return firstValueFrom(this.http.get(`${environment.backend}/dynamic/Attendance/all/paginate`, { params }));
  }

  
}
