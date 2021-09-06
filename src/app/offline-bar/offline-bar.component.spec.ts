import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { HttpService } from '../http';
import { OfflineBarComponent } from './offline-bar.component';

describe('OfflineBarComponent', () => {
  let component: OfflineBarComponent,
    fixture: ComponentFixture<OfflineBarComponent>,
    httpSubject,
    httpServiceMock: any;

  beforeEach(waitForAsync(() => {
    httpSubject = new Subject<Object>();
    httpServiceMock = {
      getConnectionEvent: () => httpSubject.asObservable(),
    };

    TestBed.configureTestingModule({
      declarations: [
        OfflineBarComponent,
      ],
      providers: [
        {
          provide: HttpService,
          useValue: httpServiceMock,
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go offline lost connection', () => {
    expect(component.isOffline).toBeFalsy();
    httpSubject.next({ some: 'thing' });
    expect(component.isOffline).toBeFalsy();
    httpSubject.next(false);
    expect(component.isOffline).toBeTruthy();
    httpSubject.next(true);
    expect(component.isOffline).toBeFalsy();
  });
});
