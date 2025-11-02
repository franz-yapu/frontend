import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorStudentComponent } from './behavior-student.component';

describe('BehaviorStudentComponent', () => {
  let component: BehaviorStudentComponent;
  let fixture: ComponentFixture<BehaviorStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BehaviorStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BehaviorStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
