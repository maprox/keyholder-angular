import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

import { PasswordGeneratorService } from '../../password-generator';
import { Options } from '../../password-generator/model';
import { StorageApiService, StorageService } from '../../storage';
import { Container, Folder } from '../../storage/model';

import { SettingsComponent } from './settings.component';

@Component({
    selector: 'app-import-export',
    template: '<div>Fake import-export component</div>'
})
class FakeImportExportComponent {}

describe('SettingsComponent', () => {
    let component: SettingsComponent,
        fixture: ComponentFixture<SettingsComponent>,
        passwordGeneratorService,
        options,
        optionFields,
        storageApiSubject,
        storageApiService,
        storageService;

    beforeEach(waitForAsync(() => {
        options = new Options();
        optionFields = [{
            text: 'Use numbers',
            hint: '0123456789',
            name: 'useNumbers'
        }, {
            text: 'Use symbols',
            hint: '!@#$%^&*()+_-=}{[]|:;"/?.><,`~',
            name: 'useSymbols'
        }, {
            text: 'Use lowercase',
            hint: 'abcdefghijklmnopqrstuvwxyz',
            name: 'useLowercase'
        }, {
            text: 'Use uppercase',
            hint: 'abcdefghijklmnopqrstuvwxyz'.toUpperCase(),
            name: 'useUppercase'
        }];
        passwordGeneratorService = {
            getOptions: jasmine.createSpy().and.returnValue(options),
            getOptionsFields: jasmine.createSpy().and.returnValue(optionFields)
        };
        storageApiSubject = new Subject<Object>();
        storageApiService = {
            load: jasmine.createSpy().and.returnValue(storageApiSubject)
        };
        storageService = {
            save: jasmine.createSpy()
        };
        TestBed.configureTestingModule({
            imports: [
                FormsModule
            ],
            declarations: [
                SettingsComponent,
                FakeImportExportComponent
            ],
            providers: [
                {
                    provide: PasswordGeneratorService,
                    useValue: passwordGeneratorService
                },
                {
                    provide: StorageApiService,
                    useValue: storageApiService
                },
                {
                    provide: StorageService,
                    useValue: storageService
                }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should load option', () => {
        const container = new Container(new Folder(), new Options(15, false));
        expect(component.options.useNumbers).toBeTruthy();

        storageApiSubject.next(container);

        expect(component.options.length).toEqual(15);
        expect(component.options.useNumbers).toBeFalsy();
    });

    it('should toggle option', () => {
        expect(options.useNumbers).toBeTruthy();

        component.toggle('useNumbers');

        expect(options.useNumbers).toBeFalsy();
        expect(storageService.save).toHaveBeenCalled();
    });

    it('should save', () => {
        component.save();

        expect(storageService.save).toHaveBeenCalled();
    });
});
