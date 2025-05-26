import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit {
  @Input() fields: any[] = [];
  @Input() initialData: any = {};
  @Input() askfor!: (form: FormGroup) => void; // función de validación externa
  @Output() onFormChange = new EventEmitter<any>(); // para emitir cambios en tiempo real

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({});
    this.buildForm(this.fields);

    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }

    // Emitir cada vez que el formulario cambie
    this.form.valueChanges.subscribe(value => {
      this.onFormChange.emit(value);
      if (this.askfor) {
        this.askfor(this.form); // ejecutar validación externa si existe
      }
    });
  }

  buildForm(fields: any[]) {
    fields.forEach(field => {
      if (field.type === 'column') {
        field.columns.forEach((col: any) => {
          col.fields.forEach((f: any) => this.addControl(f));
        });
      } else if (field.key) {
        this.addControl(field);
      }
    });
  }

  private addControl(field: any) {
    if (field.type === 'title') return;

    const validators = this.mapValidators(field.validators);
    this.form.addControl(field.key, new FormControl({ value: '', disabled: field.readonly }, validators));
  }

  private mapValidators(validators: any): any[] {
    const v: any[] = [];
    if (!validators) return v;
    if (validators.required) v.push(Validators.required);
    if (validators.email) v.push(Validators.email);
    if (validators.maxLength !== undefined) v.push(Validators.maxLength(validators.maxLength));
    if (validators.minLength !== undefined) v.push(Validators.minLength(validators.minLength));
    if (validators.pattern) v.push(Validators.pattern(validators.pattern));
    return v;
  }

  getControl(key: string) {
    return this.form.get(key);
  }

  isFieldVisible(field: any): boolean {
    if (!field.showOn) return true;
    const { rules } = field.showOn;
    return rules.every((rule: any) => {
      const val = this.form.get(rule.property)?.value;
      return rule.op === 'eq' ? val === rule.value : true;
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}