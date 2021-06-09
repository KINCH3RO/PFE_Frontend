import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaInfoPageComponent } from './media-info-page.component';

describe('MediaInfoPageComponent', () => {
  let component: MediaInfoPageComponent;
  let fixture: ComponentFixture<MediaInfoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaInfoPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
