import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStudentsBehaviorComponent } from './list-students-behavior.component';

describe('ListStudentsBehaviorComponent', () => {
  let component: ListStudentsBehaviorComponent;
  let fixture: ComponentFixture<ListStudentsBehaviorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListStudentsBehaviorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListStudentsBehaviorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
