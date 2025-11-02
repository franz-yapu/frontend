import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDashboradComponent } from './teacher-dashborad.component';

describe('TeacherDashboradComponent', () => {
  let component: TeacherDashboradComponent;
  let fixture: ComponentFixture<TeacherDashboradComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherDashboradComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherDashboradComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
