import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-regexp-error',
    templateUrl: './regexp-error.component.html',
    styleUrls: ['./regexp-error.component.scss']
})
export class RegexpErrorComponent {
    private _pattern: string;
    private _value: string;
    isValid: boolean;

    @Input()
    set pattern(pattern: string) {
        this._pattern = pattern;
        this.checkIsValid();
    }

    @Input()
    set value(value: string) {
        this._value = value;
        this.checkIsValid();
    }

    checkIsValid() {
        this.isValid = (new RegExp(this._pattern)).test(this._value);
    }
}
