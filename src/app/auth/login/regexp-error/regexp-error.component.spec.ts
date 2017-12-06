import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegexpErrorComponent } from './regexp-error.component';

describe('RegexpErrorComponent', () => {
  let component: RegexpErrorComponent;
  let fixture: ComponentFixture<RegexpErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegexpErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegexpErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
