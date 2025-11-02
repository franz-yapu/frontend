import { Component, inject, OnInit } from '@angular/core';
import { DynamicFormComponent } from '../../../../project/components/dynamic-form/dynamic-form.component';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormGroup } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { ToasterService } from '../../../../project/services/toaster.service';
import { studentFormFields } from './student-schema';
import dayjs from 'dayjs';
@Component({
  selector: 'app-student-modal',
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './student-modal.component.html',
  styleUrl: './student-modal.component.scss'
})
export class StudentModalComponent implements OnInit {
  dynamicDialogConfig = inject(DynamicDialogConfig);
  formReference!: FormGroup;
  public formData: any;
  onFormCreated = (form: FormGroup) => {
    this.formReference = form;
  };
  initiaData = this.dynamicDialogConfig.data?.data;
  couseId = this.dynamicDialogConfig.data?.couseId;
  catalogs: any = {};

  constructor(
    public ref: DynamicDialogRef,
    private adminServices: AdminService,
    private toaster: ToasterService
  ) { }

  async ngOnInit() {
  this.initiaData.birthDate =  dayjs(this.initiaData.birthDate).format('YYYY-MM-DD') 
  }

  PatientsFormFields(catalogs: any): any[] {
    return   studentFormFields(catalogs)  ; 
  }


  handleFormChange(event: {
    data: any;
    valid: boolean;
    touched: boolean;
    dirty: boolean;
    complete: boolean;
  }) {

    this.formData = event;
  }

  async save() {
    if (this.formData?.valid) {
      if (this.initiaData?.id) {
        this.formData.data.birthDate =  new Date(`${this.initiaData.birthDate}T00:00:00.000Z`);  
        this.adminServices.updateStudent(this.initiaData.id,this.formData.data).then(res => {
          this.ref.close(res);
        });
      } else {
        const dataUser:any ={
          firstName: this.formData.data.firstNameTutor,
          lastName: this.formData.data.lastNameTutor,
          username:dayjs(this.formData.data.birthDate).format('YYYY-MM-DD') ,
          password: this.formData.data.identityCard  ,
          email: 'tutor_'+this.formData.data.identityCard+'@gmail.com',
          roleId: '0c1a1563-e562-400a-b900-03f04e012ad7',
         
        }
        const user:any = await this.adminServices.createUser(dataUser);
        this.formData.data.gradeId = this.couseId ;
        this.formData.data.userId = user.id;
        this.formData.data.birthDate = new Date(`${this.formData.data.birthDate}T00:00:00.000Z`);  
        
        
        this.adminServices.createStudent(this.formData.data).then(res => {
          this.toaster.showToast({
            severity: 'success',
            summary: 'Guardado',
            detail: this.initiaData ? 'Los datos se actualizaron correctamente' : 'Los datos se guardaron correctamente',
          });
          this.ref.close(res);
        });

      }

    }else {
        console.log("no valid");
    }
  }

  close() {
    this.ref.close();
  }
}