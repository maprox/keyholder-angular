import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

export class TestComponentWrapper {
  componentInstance: any;
  fixture: ComponentFixture<any>;
  navSpy: jasmine.Spy;
  router: Router;

  constructor(fixture: ComponentFixture<any>, { router = false } = {}) {
    this.componentInstance = fixture.componentInstance;
    this.fixture = fixture;
    if (router) {
      this.router = TestBed.inject(Router);
    }
  }

  get fields(): ({ [key: string]: DebugElement }) {
    return this.getFields();
  }

  getFields(): ({ [key: string]: DebugElement }) {
    return {
      // to be implemented by ancestors
    };
  }

  getElementByCss(css: string): DebugElement {
    return this.fixture.debugElement.query(By.css(css));
  }

  getElementsByCss(css: string): DebugElement[] {
    return this.fixture.debugElement.queryAll(By.css(css));
  }

  detectChanges() {
    this.fixture.detectChanges();
  }

  whenStable(fn) {
    return this.fixture.ngZone.run(() =>
      this.fixture.whenStable().then(() => fn()));
  }
}

export default TestComponentWrapper;
