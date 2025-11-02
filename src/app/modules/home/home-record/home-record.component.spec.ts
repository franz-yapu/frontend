import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRecordComponent } from './home-record.component';

describe('HomeRecordComponent', () => {
  let component: HomeRecordComponent;
  let fixture: ComponentFixture<HomeRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
