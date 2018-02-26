import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { LogoutComponent } from './logout.component';

describe('LogoutComponent', () => {
    let fixture: ComponentFixture<LogoutComponent>,
        authServiceStub,
        routerStub;

    beforeEach(async(() => {
        // mock services
        authServiceStub = {
            logOut: jasmine.createSpy()
        };
        routerStub = {
            navigate: jasmine.createSpy()
        };

        TestBed.configureTestingModule({
            declarations: [
                LogoutComponent
            ],
            providers: [
                {
                    provide: AuthService,
                    useValue: authServiceStub
                }, {
                    provide: Router,
                    useValue: routerStub
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LogoutComponent);
        fixture.detectChanges();
    });

    it('should log out', () => {
        expect(authServiceStub.logOut).toHaveBeenCalledTimes(1);
        expect(routerStub.navigate).toHaveBeenCalledWith(['/login']);
    });
});
