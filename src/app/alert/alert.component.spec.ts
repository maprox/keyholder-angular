import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { RouterEvent } from '@angular/router';
import { Subject } from 'rxjs';

import { AlertComponent, AlertService } from '.';
import { Alert, AlertType } from './model';

describe('AlertComponent', () => {
  let fixture: ComponentFixture<AlertComponent>,
    de: DebugElement,
    el: HTMLElement;

  const defaultAlert = <Alert>{
    type: AlertType.Success,
    message: 'Nice Job!'
  };

  const alertSubject = new Subject<Alert>();
  const alertServiceStub = {
    getAlert() {
      return alertSubject.asObservable();
    },
    clear() {
      alertSubject.next();
    }
  };

  const routerEventsSubject = new Subject<RouterEvent>();
  const routerStub = {
    events: routerEventsSubject.asObservable()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AlertComponent
      ],
      providers: [
        {
          provide: AlertService,
          useValue: alertServiceStub
        }, {
          provide: Router,
          useValue: routerStub
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    fixture.detectChanges();

    //  get the element by CSS selector (e.g., by class name)
    de = fixture.debugElement.query(By.css('.alert-wrapper'));
    el = de.nativeElement;
  });

  it('should be empty', () => {
    expect(de.children.length).toEqual(0);
  });

  it('should show alerts', () => {
    alertSubject.next(defaultAlert);
    fixture.detectChanges();
    expect(de.children.length).toEqual(1);

    const alertEl: HTMLElement = de.children.pop().nativeElement;
    expect(alertEl.innerText).toEqual(defaultAlert.message);

    alertSubject.next(<Alert>{
      type: AlertType.Error,
      message: defaultAlert.message
    });
    alertSubject.next(<Alert>{
      type: AlertType.Info,
      message: defaultAlert.message
    });
    alertSubject.next(<Alert>{
      type: AlertType.Warning,
      message: defaultAlert.message
    });
    fixture.detectChanges();
    expect(de.children.length).toEqual(4);

    expect(de.children[0].nativeElement.classList.contains('alert-success')).toBeTruthy();
    expect(de.children[1].nativeElement.classList.contains('alert-danger')).toBeTruthy();
    expect(de.children[2].nativeElement.classList.contains('alert-info')).toBeTruthy();
    expect(de.children[3].nativeElement.classList.contains('alert-warning')).toBeTruthy();

    alertSubject.next();
    fixture.detectChanges();
    expect(de.children.length).toEqual(0);
  });

  it('should remove alert on click', () => {
    alertSubject.next(defaultAlert);
    fixture.detectChanges();
    expect(de.children.length).toEqual(1);

    de.children[0].nativeElement.click();
    fixture.detectChanges();
    expect(de.children.length).toEqual(0);
  });

  it('should remove alert with ttl', fakeAsync(() => {
    alertSubject.next(<Alert>{
      type: AlertType.Success,
      message: defaultAlert.message,
      ttl: 2000
    });
    fixture.detectChanges();
    expect(de.children.length).toEqual(1);

    tick(1999);
    fixture.detectChanges();
    expect(de.children.length).toEqual(1);

    tick(1);
    fixture.detectChanges();
    expect(de.children.length).toEqual(0);
  }));

  it('should clear alerts on route change', () => {
    alertSubject.next(defaultAlert);
    alertSubject.next(defaultAlert);
    fixture.detectChanges();
    expect(de.children.length).toEqual(2);

    routerEventsSubject.next(new NavigationStart(10, 'test'));
    fixture.detectChanges();
    expect(de.children.length).toEqual(0);
  });

  it('should not clear alerts on route end', () => {
    alertSubject.next(defaultAlert);
    alertSubject.next(defaultAlert);
    fixture.detectChanges();
    expect(de.children.length).toEqual(2);

    routerEventsSubject.next(new NavigationEnd(10, 'test', ''));
    fixture.detectChanges();
    expect(de.children.length).toEqual(2);
  });
});
