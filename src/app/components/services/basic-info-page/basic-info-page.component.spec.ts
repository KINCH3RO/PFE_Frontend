import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInfoPageComponent } from './basic-info-page.component';

describe('BasicInfoPageComponent', () => {
  let component: BasicInfoPageComponent;
  let fixture: ComponentFixture<BasicInfoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicInfoPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
