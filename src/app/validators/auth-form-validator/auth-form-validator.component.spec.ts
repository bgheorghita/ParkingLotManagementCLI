import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFormValidatorComponent } from './auth-form-validator.component';

describe('AuthFormValidatorComponent', () => {
  let component: AuthFormValidatorComponent;
  let fixture: ComponentFixture<AuthFormValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthFormValidatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthFormValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
