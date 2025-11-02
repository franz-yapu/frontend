import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteDeatailComponent } from './cliente-deatail.component';

describe('ClienteDeatailComponent', () => {
  let component: ClienteDeatailComponent;
  let fixture: ComponentFixture<ClienteDeatailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteDeatailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteDeatailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
