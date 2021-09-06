import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';

import { AuthService } from '../auth.service';
import { LoginComponent } from './login.component';
import { RegexpErrorComponent } from './regexp-error/regexp-error.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let isLoggedIn = true;
  let page: Page;
  let authSubject: Subject<Object>;
  let authServiceStub: any;

  class Page {
    navSpy: jasmine.Spy;

    submit: DebugElement;
    togglePasswordVisibility: DebugElement;
    username: DebugElement;
    password: DebugElement;

    constructor() {
      const router = TestBed.get(Router);
      this.navSpy = spyOn(router, 'navigate');
    }

    buildPageElements() {
      this.submit = fixture.debugElement.query(By.css('button.btn-primary'));
      const inputs = fixture.debugElement.queryAll(By.css('input'));
      this.username = inputs[0];
      this.password = inputs[1];
      this.togglePasswordVisibility = fixture.debugElement.query(By.css('button.btn-link'));
    }

    getSubmitLabel() {
      return this.submit.nativeElement.textContent.trim();
    }
  }

  @Component({ template: '' }) class DummyComponent {}

  @Component({
    selector: 'app-fork-me',
    template: '<div>Fake fork me component</div>'
  })
  class FakeForkMeComponent {}

  beforeEach(waitForAsync(() => {
    authSubject = new Subject<Object>();
    authServiceStub = {
      isLoggedIn() {
        return isLoggedIn;
      },
      getAuthEvent() {
        return authSubject.asObservable();
      },
      signIn: jasmine.createSpy(),
      signUp: jasmine.createSpy()
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([
          { path: 'storage', component: DummyComponent },
          { path: 'register', component: DummyComponent, data: { signUp: true } },
          { path: 'login', component: DummyComponent }
        ])
      ],
      declarations: [
        FakeForkMeComponent,
        LoginComponent,
        DummyComponent,
        RegexpErrorComponent
      ],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceStub
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    page = new Page();

    //  get the element by CSS selector (e.g., by class name)
    de = fixture.debugElement.query(By.css('.container'));
    el = de.nativeElement;
  });

  it('should be created', () => {
    expect(de).toBeTruthy();
  });

  it('should navigate to storage when logged in', () => {
    isLoggedIn = true;

    fixture.detectChanges();

    expect(page.navSpy).toHaveBeenCalledTimes(1);
    expect(page.navSpy).toHaveBeenCalledWith(['/storage']);
  });

  it('should switch mode', inject([ActivatedRoute], (route: ActivatedRoute) => {
    isLoggedIn = false;

    const routeSubject = new Subject<Object>();
    route.data = routeSubject.asObservable();

    fixture.detectChanges();

    page.buildPageElements();

    expect(de.children.length).toEqual(2);

    const switchDe = de.children[1].query(By.css('a.btn'));

    expect(page.getSubmitLabel()).toEqual('Log in');
    expect(switchDe.nativeElement.textContent.trim()).toEqual('Sign up');

    // emulate navigating to /register
    routeSubject.next({signUp: true});
    fixture.detectChanges();

    expect(page.getSubmitLabel()).toEqual('Sign up');
    expect(switchDe.nativeElement.textContent.trim()).toEqual('Log in');
  }));

  it('should catch auth change', () => {
    isLoggedIn = false;

    fixture.detectChanges();

    authSubject.next(true);
    fixture.detectChanges();

    expect(page.navSpy).toHaveBeenCalledTimes(1);
    expect(page.navSpy).toHaveBeenCalledWith(['/']);
  });

  it('should sign in', () => {
    isLoggedIn = false;

    fixture.detectChanges();
    page.buildPageElements();
    expect(page.getSubmitLabel()).toEqual('Log in');

    // simulate user entering new name into the input box
    page.username.nativeElement.value = 'test-username';
    page.password.nativeElement.value = 'test-password';

    // dispatch a DOM event so that Angular learns of input value change.
    page.username.nativeElement.dispatchEvent(new Event('input'));
    page.password.nativeElement.dispatchEvent(new Event('input'));

    page.submit.nativeElement.click();
    fixture.detectChanges();

    expect(authServiceStub.signUp).toHaveBeenCalledTimes(0);
    expect(authServiceStub.signIn).toHaveBeenCalledTimes(1);
  });

  it('should sign up', inject([ActivatedRoute], (route: ActivatedRoute) => {
    isLoggedIn = false;

    const routeSubject = new Subject<Object>();
    route.data = routeSubject.asObservable();
    route.snapshot.queryParams = {returnUrl: '/return-url/%28%29'};
    fixture.detectChanges();

    // emulate navigating to /register
    routeSubject.next({signUp: true});
    fixture.detectChanges();

    page.buildPageElements();
    expect(page.getSubmitLabel()).toEqual('Sign up');

    // simulate user entering new name into the input box
    page.username.nativeElement.value = 'test-username';
    page.password.nativeElement.value = 'test-password';

    // dispatch a DOM event so that Angular learns of input value change.
    page.username.nativeElement.dispatchEvent(new Event('input'));
    page.password.nativeElement.dispatchEvent(new Event('input'));

    page.submit.nativeElement.click();
    fixture.detectChanges();

    expect(authServiceStub.signUp).toHaveBeenCalledTimes(1);
    expect(authServiceStub.signIn).toHaveBeenCalledTimes(0);

    authSubject.next(false);
    fixture.detectChanges();
    expect(page.navSpy).toHaveBeenCalledTimes(0);

    authSubject.next(true);
    fixture.detectChanges();

    expect(page.navSpy).toHaveBeenCalledTimes(1);
    expect(page.navSpy).toHaveBeenCalledWith(['/return-url/()']);
  }));

  it('should toggle password visibility', inject([ActivatedRoute], (route: ActivatedRoute) => {
    isLoggedIn = false;

    const routeSubject = new Subject<Object>();
    route.data = routeSubject.asObservable();

    fixture.detectChanges();

    // emulate navigating to /register
    routeSubject.next({signUp: true});
    fixture.detectChanges();

    page.buildPageElements();

    expect(page.password.nativeElement.type).toEqual('password');

    page.togglePasswordVisibility.nativeElement.click();
    fixture.detectChanges();

    expect(page.password.nativeElement.type).toEqual('text');

    page.togglePasswordVisibility.nativeElement.click();
    fixture.detectChanges();

    expect(page.password.nativeElement.type).toEqual('password');
  }));
});
