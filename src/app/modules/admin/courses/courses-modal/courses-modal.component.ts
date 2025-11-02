import { Component, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminService } from '../../admin.service';
import { ToasterService } from '../../../../project/services/toaster.service';
import { ApiService } from '../../../../project/services/api.service';
import { DynamicFormComponent } from '../../../../project/components/dynamic-form/dynamic-form.component';
import { CommonModule } from '@angular/common';
import { courseFormFields } from './courseSchema';

@Component({
  selector: 'app-courses-modal',
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './courses-modal.component.html',
  styleUrl: './courses-modal.component.scss'
})
export class CoursesModalComponent implements OnInit {
  dynamicDialogConfig = inject(DynamicDialogConfig);
  formReference!: FormGroup;
  public formData: any;
  onFormCreated = (form: FormGroup) => {
    this.formReference = form;
  };
  initiaData = this.dynamicDialogConfig.data?.data;
  catalogs: any = {};
  public view = false
  constructor(
    public ref: DynamicDialogRef,
    private adminServices: AdminService,
    private toaster: ToasterService,
    private apiService: ApiService
  ) { }

  async ngOnInit() {
    const teacher: any = await this.adminServices.getUserTeacher()
    this.catalogs.teachers= teacher.data.map((res: any) => ({
      label: res.firstName+" "+res.lastName,
      value: res.id,
    }));
    this.view = true
  }

  PatientsFormFields(catalogs: any): any[] {
    return  courseFormFields(catalogs) ; 
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
        this.adminServices.updateCourse(this.initiaData.id,this.formData.data).then(res => {
          this.ref.close(res);
        });
      } else {
        this.adminServices.createCourse(this.formData.data).then(res => {
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