import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { StorageApiService, StorageService } from '../../storage';

import { ExportComponent } from './export.component';

describe('ExportComponent', () => {
    let component: ExportComponent;
    let fixture: ComponentFixture<ExportComponent>;
    let storageApiSubject;
    let mocks;

    beforeEach(async(() => {
        storageApiSubject = new Subject<Object>();
        mocks = {
            storageApiService: {
                load: jasmine.createSpy().and.returnValue(storageApiSubject),
            },
            storageService: {},
        };
        TestBed.configureTestingModule({
            declarations: [ ExportComponent ],
            providers: [
                {
                    provide: StorageApiService,
                    useValue: mocks.storageApiService
                },
                {
                    provide: StorageService,
                    useValue: mocks.storageService
                },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
