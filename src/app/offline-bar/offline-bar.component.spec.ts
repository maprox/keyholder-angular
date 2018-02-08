import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineBarComponent } from './offline-bar.component';

describe('OfflineBarComponent', () => {
  let component: OfflineBarComponent;
  let fixture: ComponentFixture<OfflineBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
