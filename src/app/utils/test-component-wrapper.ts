import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

export class TestComponentWrapper {
  component: any;
  fixture: ComponentFixture<any>;
  navSpy: jasmine.Spy;
  router: Router;

  constructor(fixture: ComponentFixture<any>) {
    this.component = fixture.componentInstance;
    this.fixture = fixture;
    this.router = TestBed.inject(Router);
  }

  getElementByCss(css: string): DebugElement {
    return this.fixture.debugElement.query(By.css(css));
  }

  initElements() {
    // to be implemented by ancestors
  }

  whenStable(fn) {
    return this.fixture.ngZone.run(() =>
      this.fixture.whenStable().then(() => fn()));
  }
}

export default TestComponentWrapper;
