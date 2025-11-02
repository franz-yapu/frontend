import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordAcademicComponent } from './record-academic.component';

describe('RecordAcademicComponent', () => {
  let component: RecordAcademicComponent;
  let fixture: ComponentFixture<RecordAcademicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordAcademicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordAcademicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
