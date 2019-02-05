import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LongPressDirective } from './long-press.directive';

@Component({
  template: `<button appLongPress (onRelease)="release()"></button>`
})
class TestLongPressComponent {
  public release = jasmine.createSpy();
}

@Component({
  template: `<button appLongPress="1000" (onRelease)="release()"></button>`
})
class TestLongPressSecondComponent {
  public release = jasmine.createSpy();
}

describe('LongPressDirective', () => {
  let component: TestLongPressComponent;
  let component2: TestLongPressSecondComponent;
  let fixture: ComponentFixture<TestLongPressComponent>;
  let fixture2: ComponentFixture<TestLongPressSecondComponent>;
  let inputEl: DebugElement;
  let inputEl2: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestLongPressComponent,
        TestLongPressSecondComponent,
        LongPressDirective
      ]
    });
    fixture = TestBed.createComponent(TestLongPressComponent);
    fixture2 = TestBed.createComponent(TestLongPressSecondComponent);
    component = fixture.componentInstance;
    component2 = fixture2.componentInstance;
    inputEl = fixture.debugElement.query(By.css('button'));
    inputEl2 = fixture2.debugElement.query(By.css('button'));
  });

  it('should create an instance', () => {
    const directive = new LongPressDirective();
    expect(directive).toBeTruthy();
  });

  it('should emit event on long press', fakeAsync(() => {
    fixture.detectChanges();
    fixture2.detectChanges();
    inputEl.triggerEventHandler('mousedown', null);
    inputEl2.triggerEventHandler('mousedown', null);
    expect(component.release).not.toHaveBeenCalled();
    expect(component2.release).not.toHaveBeenCalled();
    tick(499);
    expect(component.release).not.toHaveBeenCalled();
    expect(component2.release).not.toHaveBeenCalled();
    tick(1);
    expect(component.release).toHaveBeenCalled();
    expect(component2.release).not.toHaveBeenCalled();
    tick(499);
    expect(component2.release).not.toHaveBeenCalled();
    tick(1);
    expect(component2.release).toHaveBeenCalled();
    inputEl.triggerEventHandler('mouseup', null);
    inputEl2.triggerEventHandler('mouseup', null);
  }));

  it('should emit event on long press when mouse was slightly moved', fakeAsync(() => {
    fixture.detectChanges();
    inputEl.triggerEventHandler('mousemove', { movementY: 100 });
    inputEl.triggerEventHandler('mousedown', null);
    expect(component.release).not.toHaveBeenCalled();
    tick(499);
    expect(component.release).not.toHaveBeenCalled();
    inputEl.triggerEventHandler('mousemove', { movementY: 5 });
    inputEl.triggerEventHandler('mousemove', { movementY: 5 });
    tick(1);
    expect(component.release).toHaveBeenCalled();
    inputEl.triggerEventHandler('mouseup', null);
  }));

  it('should not emit event on long press when mouse moved', fakeAsync(() => {
    fixture.detectChanges();
    inputEl.triggerEventHandler('mousedown', null);
    expect(component.release).not.toHaveBeenCalled();
    tick(499);
    expect(component.release).not.toHaveBeenCalled();
    inputEl.triggerEventHandler('mousemove', { movementY: 5 });
    inputEl.triggerEventHandler('mousemove', { movementY: 6 });
    tick(1);
    expect(component.release).not.toHaveBeenCalled();
    inputEl.triggerEventHandler('mouseup', null);
  }));

  it('should emit event on long press when was slightly touched and moved', fakeAsync(() => {
    fixture.detectChanges();
    inputEl.triggerEventHandler('touchmove', { touches: [{ clientY: 50 }] });
    inputEl.triggerEventHandler('touchstart', null);
    expect(component.release).not.toHaveBeenCalled();
    tick(499);
    expect(component.release).not.toHaveBeenCalled();
    inputEl.triggerEventHandler('touchmove', { touches: [{ clientY: 100 }] });
    inputEl.triggerEventHandler('touchmove', { touches: [{ clientY: 105 }] });
    inputEl.triggerEventHandler('touchmove', { touches: [{ clientY: 110 }] });
    tick(1);
    expect(component.release).toHaveBeenCalled();
    inputEl.triggerEventHandler('touchend', null);
  }));

  it('should not emit event on long press when was touched and moved', fakeAsync(() => {
    fixture.detectChanges();
    inputEl.triggerEventHandler('touchmove', { touches: [{ clientY: 50 }] });
    inputEl.triggerEventHandler('touchstart', null);
    expect(component.release).not.toHaveBeenCalled();
    tick(499);
    expect(component.release).not.toHaveBeenCalled();
    inputEl.triggerEventHandler('touchmove', { touches: [{ clientY: 100 }] });
    inputEl.triggerEventHandler('touchmove', { touches: [{ clientY: 105 }] });
    inputEl.triggerEventHandler('touchmove', { touches: [{ clientY: 111 }] });
    tick(1);
    expect(component.release).not.toHaveBeenCalled();
    inputEl.triggerEventHandler('touchend', null);
  }));
});
