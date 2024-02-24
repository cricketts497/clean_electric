import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageDurationTabComponent } from './usage-duration-tab.component';

describe('UsageDurationTabComponent', () => {
  let component: UsageDurationTabComponent;
  let fixture: ComponentFixture<UsageDurationTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsageDurationTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageDurationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
