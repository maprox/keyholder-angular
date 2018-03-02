import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs/Subject';

import { HttpService } from '../http';
import { OfflineBarComponent } from './offline-bar.component';

describe('OfflineBarComponent', () => {
    let component: OfflineBarComponent,
        fixture: ComponentFixture<OfflineBarComponent>,
        httpSubject,
        httpServiceMock: any;

    beforeEach(async(() => {
        httpSubject = new Subject<Object>();
        httpServiceMock = {
            getConnectionEvent: () => httpSubject.asObservable()
        };

        TestBed.configureTestingModule({
            declarations: [
                OfflineBarComponent
            ],
            providers: [
                {
                    provide: HttpService,
                    useValue: httpServiceMock
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OfflineBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
