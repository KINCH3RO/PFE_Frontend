import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansInfoPageComponent } from './plans-info-page.component';

describe('PlansInfoPageComponent', () => {
  let component: PlansInfoPageComponent;
  let fixture: ComponentFixture<PlansInfoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlansInfoPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlansInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
