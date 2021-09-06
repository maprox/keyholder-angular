import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegexpErrorComponent } from './regexp-error.component';

describe('RegexpErrorComponent', () => {
    let component: RegexpErrorComponent;
    let fixture: ComponentFixture<RegexpErrorComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                RegexpErrorComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegexpErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should check pattern', () => {
        component.pattern = '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).*)';
        expect(component.isValid).toBeFalsy();

        [
            'Incorrect',
            'Values$',
            'Not39093039match',
            'QWERQWERQWERQWERQWERqwerkofd3484394389489',
            'Ффф33p#'
        ].forEach((value) => {
            component.value = value;
            expect(component.isValid).toBeFalsy(value);
        });

        [
            'Correct1!',
            'Values$1',
            'Yes#39093039match',
            '!QWERQWERQWERQWERQWERqwerkofd3484394389489',
            'Ффф33p#SA'
        ].forEach((value) => {
            component.value = value;
            expect(component.isValid).toBeTruthy(value);
        });
    });
});
