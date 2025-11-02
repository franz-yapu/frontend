import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from '../../core/gerneral.service';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient,
    private generalService: GeneralService) { }



     getUser(id_user:string) {
      const where = {"id":id_user};
      const include =  {"student":true,}
      const params = new HttpParams()
      .set('where', JSON.stringify(where))
      .set('include', JSON.stringify(include));
      return firstValueFrom(this.http.get(`${environment.backend}/dynamic/user/all/paginate`, { params }));
    }

  /* Student service */
  getStudents(id_student:string) {
    const where = {"id":id_student};
    const include =  {"attendances":true,"behaviors":true,"record":true}
    const params = new HttpParams()
      .set('where', JSON.stringify(where))
      .set('include', JSON.stringify(include));
    return firstValueFrom(this.http.get(`${environment.backend}/dynamic/Student/all/paginate`, { params }));
  }

  getStudAttendance(id_student:string) {
    const where = {"id":id_student};
    const include =  {"attendances":true}
    const params = new HttpParams()
      .set('where', JSON.stringify(where))
      .set('include', JSON.stringify(include));
    return firstValueFrom(this.http.get(`${environment.backend}/dynamic/Student/all/paginate`, { params }));
  }

  getStudBehavior(id_student:string) {
    const where = {"id":id_student};
    const include =  {"behaviors":true}
    const params = new HttpParams()
      .set('where', JSON.stringify(where))
      .set('include', JSON.stringify(include));
    return firstValueFrom(this.http.get(`${environment.backend}/dynamic/Student/all/paginate`, { params }));
  }




   createStudent(data:any) {
    return firstValueFrom(this.http.post(`${environment.backend}/dynamic/Student`, data));
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
    return firstValueFrom(this.http.get(`${environment.backend}/dynamic/Attendance/all/paginate`, { params }));
  }


  //comportamiento
  getStudentsBehavior(id_couse:string) {
    const where =  {gradeId:{equals:id_couse}};
    const include =  {"behaviors":true}
    const params = new HttpParams()
      .set('where', JSON.stringify(where))
      .set('include', JSON.stringify(include));
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
      .set('include', JSON.stringify(include));
    return firstValueFrom(this.http.get(`${environment.backend}/dynamic/Student/all/paginate`, { params }));
  }
 // record academic
  getrecords(id_couse:string) {
    const where =  {gradeId:{equals:id_couse}};
    const include =  {"record":true}
    const params = new HttpParams()
      .set('where', JSON.stringify(where))
      .set('include', JSON.stringify(include));
    return firstValueFrom(this.http.get(`${environment.backend}/dynamic/Student/all/paginate`, { params }));
  }

  createRecords(data:any) {
    return firstValueFrom(this.http.post(`${environment.backend}/dynamic/AcademicRecord`, data));
   }


  editRecord(id: string, data: any) {
    return firstValueFrom(this.http.patch(`${environment.backend}/dynamic/AcademicRecord/${id}`, data));
   }
  
  updateBehavior(id: string, data: any) {
  return firstValueFrom(this.http.patch(`${environment.backend}/dynamic/Behavior/${id}`, data));
  }

  
}
