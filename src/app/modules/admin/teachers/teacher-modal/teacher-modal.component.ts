import { Component, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminService } from '../../admin.service';
import { ToasterService } from '../../../../project/services/toaster.service';
import { ApiService } from '../../../../project/services/api.service';
import { DynamicFormComponent } from '../../../../project/components/dynamic-form/dynamic-form.component';
import { CommonModule } from '@angular/common';
import { userFormFields, userUpdateFormFields } from './userSchema';

@Component({
  selector: 'app-teacher-modal',
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './teacher-modal.component.html',
  styleUrl: './teacher-modal.component.scss'
})
export class TeacherModalComponent implements OnInit {
  dynamicDialogConfig = inject(DynamicDialogConfig);
  formReference!: FormGroup;
  public formData: any;
  onFormCreated = (form: FormGroup) => {
    this.formReference = form;
  };
  initiaData = this.dynamicDialogConfig.data?.data;
  catalogs: any = {subRole:[{label:'General', value:'1'},{label:'Religion', value:'2'},{label:'Música', value:'3'},{label:'Educación Física ', value:'4'}]};
  public view = false
  constructor(
    public ref: DynamicDialogRef,
    private adminServices: AdminService,
    private toaster: ToasterService,
    private apiService: ApiService
  ) { }

  async ngOnInit() {
    const roles: any = await this.adminServices.getRoles()
   const roleTranslations: { [key: string]: string } = {
  'ADMIN': 'Administrativo',
  'TEACHER': 'Profesor',
  'TUTOR': 'Tutor',
  'GUEST': 'Observador'
};

    this.catalogs.roles = roles.map((res: any) => ({
      label: roleTranslations[res.name] , 
      value: res.id,
    }));
    this.view = true
  }

  PatientsFormFields(catalogs: any): any[] {
    return  this.initiaData?.id ? userUpdateFormFields(catalogs)   :  userFormFields(catalogs) ; 
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
      
        this.adminServices.updateUser(this.initiaData.id,this.formData.data).then(res => {
          this.ref.close(res);
        });
      } else {
        delete this.formData.data.repeatPassword;
        this.adminServices.createUser(this.formData.data).then(res => {
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