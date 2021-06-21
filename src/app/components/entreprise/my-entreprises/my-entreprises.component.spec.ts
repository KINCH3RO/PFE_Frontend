import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEntreprisesComponent } from './my-entreprises.component';

describe('MyEntreprisesComponent', () => {
  let component: MyEntreprisesComponent;
  let fixture: ComponentFixture<MyEntreprisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyEntreprisesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEntreprisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
