import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, AsyncValidatorFn, FormControlOptions } from '@angular/forms';

export interface FieldValidator {
  required?: boolean;
  email?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string | RegExp;
  fileType?: string[];
  fileSize?: number;
}

export interface ShowOnRule {
  property: string;
  op: 'eq' | 'neq' | 'gt' | 'lt';
  value: any;
}

export interface ShowOnConfig {
  satisfy: 'ALL' | 'ANY';
  rules: ShowOnRule[];
}

export interface FieldOption {
  value: any;
  label: string;
}

export type FieldType = 'text' | 'email'| 'number' | 'select' | 'radio' | 'datetime' | 'file' | 'title' | 'column' | 'password';

export interface FormField {
  key: string;
  label?: string;
  type: FieldType;
  validators?: FieldValidator;
  options?: FieldOption[];
  showOn?: ShowOnConfig;
  readonly?: boolean;
  style?: string;
  text?: string;
  columns?: ColumnField[];
  filter?: boolean;
  format?: string;
  utc?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export interface ColumnField {
  id?: string;
  fields: FormField[];
}

@Component({
  selector: 'dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit {
  fileErrors: Record<string, string> = {};
  previewFiles: Record<string, string | null> = {};
  
  @Input() fields: FormField[] = [];
  @Input() initialData: Record<string, any> = {};
  @Input() askfor?: (form: FormGroup) => void;
  @Output() onFormChange = new EventEmitter<any>();
isPasswordVisible: Record<string, boolean> = {};
  form!: FormGroup;
 private passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({});
    this.buildForm(this.fields);
    
    if (this.initialData) {
      this.form.patchValue(this.initialData);
      this.handleInitialFileValues();
    }

    if (this.askfor) {
      this.askfor(this.form);
    }

    this.subscribeToFormChanges();
  }

  private handleInitialFileValues(): void {
    this.fields.forEach(field => {
      if (field.columns) {
        field.columns.forEach(column => {
          column.fields.forEach(f => {
            if (f.type === 'file' && this.initialData[f.key]) {
              this.previewFiles[f.key] = this.initialData[f.key];
              this.form.get(f.key)?.setValue(this.initialData[f.key]);
            }
          });
        });
      }
      
      if (field.type === 'file' && this.initialData[field.key]) {
        this.previewFiles[field.key] = this.initialData[field.key];
        this.form.get(field.key)?.setValue(null);
      }
    });
  }

  private subscribeToFormChanges(): void {
    this.form.valueChanges.subscribe(() => {
      const isComplete = this.checkAllRequiredFieldsFilled();

      this.onFormChange.emit({
        data: this.form.getRawValue(),
        valid: this.form.valid,
        touched: this.form.touched,
        dirty: this.form.dirty,
        complete: isComplete
      });
    });
  }

  private checkAllRequiredFieldsFilled(): boolean {
    for (const key in this.form.controls) {
      const control = this.form.get(key);
      const isRequired = control?.hasValidator(Validators.required);

      if (isRequired && (control?.invalid || control?.value === '' || control?.value === null)) {
        return false;
      }
    }
    return true;
  }

   togglePasswordVisibility(fieldKey: string): void {
    this.isPasswordVisible[fieldKey] = !this.isPasswordVisible[fieldKey];
  }

  buildForm(fields: FormField[]): void {
    fields.forEach(field => {
      if (field.type === 'column' && field.columns) {
        field.columns.forEach(column => {
          column.fields.forEach(f => this.addControl(f));
        });
      } else if (field.key) {
        this.addControl(field);
      }
    });
  }

  private addControl(field: FormField): void {
    if (field.type === 'title') return;

    const baseValidators = this.mapValidators(field.validators);
    if (field.type === 'password') {
      baseValidators.push(this.passwordStrengthValidator.bind(this));
    }
    if (field.type === 'file') {
      const fileValidator = this.fileValidator(field.validators);
      if (fileValidator) {
        baseValidators.push(fileValidator);
      }
    }

    const controlOptions: FormControlOptions = {
      validators: baseValidators,
      nonNullable: false
    };

    const control = new FormControl(
      { value: '', disabled: field.readonly || false },
      controlOptions
    );

    this.form.addControl(field.key, control);

    if (field.key === 'password') {
      const passwordControl = new FormControl(
        '',
        { validators: [...baseValidators, this.passwordMatchValidator.bind(this)], nonNullable: false }
      );
      this.form.addControl('repeatPassword', passwordControl);
    }
  }

    private passwordStrengthValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    
    if (!value) {
      return null; // Deja que el validador 'required' maneje los campos vacíos
    }

    const errors: any = {};

    // Verificar minúsculas
    if (!/(?=.*[a-z])/.test(value)) {
      errors.lowercase = true;
    }

    // Verificar mayúsculas
    if (!/(?=.*[A-Z])/.test(value)) {
      errors.uppercase = true;
    }

    // Verificar números
    if (!/(?=.*\d)/.test(value)) {
      errors.number = true;
    }

    // Verificar caracteres especiales
    if (!/(?=.*[@$!%*?&])/.test(value)) {
      errors.specialChar = true;
    }

    // Si hay algún error, retornar el objeto de errores
    return Object.keys(errors).length > 0 ? { passwordStrength: errors } : null;
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = this.form?.get('password')?.value;
    const repeatPassword = control.value;
    
    if (password !== repeatPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  private mapValidators(validators?: FieldValidator): ValidatorFn[] {
    const v: ValidatorFn[] = [];
    if (!validators) return v;
    if (validators.required) v.push(Validators.required);
    if (validators.email) v.push(Validators.email);
    if (validators.maxLength !== undefined) v.push(Validators.maxLength(validators.maxLength));
    if (validators.minLength !== undefined) v.push(Validators.minLength(validators.minLength));
    if (validators.pattern) {
      const pattern = typeof validators.pattern === 'string' ? new RegExp(validators.pattern) : validators.pattern;
      v.push(Validators.pattern(pattern));
    }
    return v;
  }

  getControl(key: string): AbstractControl | null {
    return this.form.get(key);
  }

  isFieldVisible(field: FormField): boolean {
    if (!field.showOn) return true;
    return field.showOn.rules.every(rule => {
      const val = this.form.get(rule.property)?.value;
      return rule.op === 'eq' ? val === rule.value : true;
    });
  }

  triggerFileInput(key: string): void {
    const input = document.getElementById('fileInput_' + key) as HTMLInputElement;
    input?.click();
  }

  onFileChange(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.fileErrors[key] = '';

    const control = this.form.get(key);
    if (!control) return;

    const field = this.findFieldByKey(key);
    const validators = field?.validators || {};

    if (!file) {
      control.setValue(null);
      control.setErrors(null);
      control.markAsTouched();
      control.updateValueAndValidity();
      return;
    }

    if (validators.fileType && !validators.fileType.includes(file.type)) {
      this.fileErrors[key] = 'Tipo de archivo no permitido.';
      control.setErrors({ fileType: true });
      control.markAsTouched();
      control.updateValueAndValidity();
      return;
    }

    if (validators.fileSize && file.size > validators.fileSize) {
      this.fileErrors[key] = `El archivo supera el tamaño máximo de ${(validators.fileSize / 1024 / 1024).toFixed(1)} MB.`;
      control.setErrors({ fileSize: true });
      control.markAsTouched();
      control.updateValueAndValidity();
      return;
    }

    control.setValue(file);
    control.setErrors(null);
    control.markAsTouched();
    control.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.previewFiles[key] = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  private findFieldByKey(key: string): FormField | undefined {
    for (const field of this.fields) {
      if (field.key === key) return field;
      if (field.columns) {
        for (const column of field.columns) {
          const found = column.fields.find(f => f.key === key);
          if (found) return found;
        }
      }
    }
    return undefined;
  }

  isImage(fileData: string | null): boolean {
    return typeof fileData === 'string' && fileData.startsWith('data:image/');
  }

  private fileValidator(validators?: FieldValidator): ValidatorFn | null {
    return (control: AbstractControl) => {
      const value = control.value;

      if (!value) {
        if (validators?.required) {
          return { required: true };
        }
        return null;
      }

      if (typeof value === 'string') {
        if (validators?.required && value.trim() === '') {
          return { required: true };
        }
        return null;
      }

      if (value instanceof File) {
        if (validators?.fileType && !validators.fileType.includes(value.type)) {
          return { fileType: true };
        }
        if (validators?.fileSize && value.size > validators.fileSize) {
          return { fileSize: true };
        }
      }

      return null;
    };
  }

  onSubmit(): void {
    if (this.form.valid) {
    } else {
      this.form.markAllAsTouched();
    }
  }
}