import { DebugElement } from '@angular/core';
import TestComponentWrapper from '../../../utils/test-component-wrapper';
import { EditFormComponentDirective } from './edit-form-component.directive';

export default class EditFormPage extends TestComponentWrapper {
  componentInstance: EditFormComponentDirective;

  get form(): DebugElement {
    return this.getElementByCss('form');
  }

  get header(): DebugElement {
    return this.getElementByCss('[data-cy=header]');
  }

  get headerName(): string {
    return this.header?.nativeElement?.innerText;
  }

  getFields(): ({ [key: string]: DebugElement }) {
    return {
      ...super.getFields(),
      name: this.getElementByCss('input[name=fieldName]'),
      submit: this.getElementByCss('[data-cy=submit]'),
      cancel: this.getElementByCss('[data-cy=cancel]'),
      remove: this.getElementByCss('[data-cy=remove]'),
      focused: this.getElementByCss(':focus'),
    };
  }

  setFieldNameTo(text: string) {
    this.fields.name.nativeElement.value = text;
    this.fields.name.nativeElement.dispatchEvent(new Event('input'));
    this.detectChanges();
  }

  submit() {
    this.fields.submit.nativeElement.click();
    this.detectChanges();
  }

  remove() {
    this.fields.remove.nativeElement.click();
    this.detectChanges();
  }

  cancel() {
    this.fields.cancel.nativeElement.click();
    this.detectChanges();
  }
}
