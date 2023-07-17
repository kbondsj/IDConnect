import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCaptureComponent } from './payment-capture.component';

describe('PaymentCaptureComponent', () => {
  let component: PaymentCaptureComponent;
  let fixture: ComponentFixture<PaymentCaptureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentCaptureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
