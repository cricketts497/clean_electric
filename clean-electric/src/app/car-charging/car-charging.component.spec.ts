import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarChargingComponent } from './car-charging.component';

describe('CarChargingComponent', () => {
  let component: CarChargingComponent;
  let fixture: ComponentFixture<CarChargingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarChargingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarChargingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
