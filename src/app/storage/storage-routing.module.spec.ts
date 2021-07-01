import { Router, Event, NavigationEnd, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from '../auth';
import { StorageRoutingModule } from './storage-routing.module';
import { StorageService } from './storage.service';

describe('StorageRoutingModule', () => {
  // let auth: AuthService;
  // let eventsSubject: Subject<Event>;
  // let isLoggedIn;
  // let module;
  // let router: Router;
  // let storage: StorageService;
  //
  // beforeEach(() => {
  //   eventsSubject = new Subject<Event>();
  //   router = <Router>{
  //     events: eventsSubject.asObservable(),
  //   };
  //   storage = <StorageService>{
  //     load: <Function>jasmine.createSpy(),
  //   };
  //   auth = <AuthService>{
  //     isLoggedIn: () => isLoggedIn,
  //   };
  //
  //   module = new StorageRoutingModule();
  // });
  //
  // it('should be created', () => {
  //   expect(module).toBeTruthy();
  // });
  //
  // it('should load storage when navigating', () => {
  //   const url = '/storage/test/folder';
  //   isLoggedIn = false;
  //   eventsSubject.next(new NavigationEnd(0, url, ''));
  //   expect(storage.load).toHaveBeenCalledTimes(0);
  //   isLoggedIn = true;
  //   eventsSubject.next(new NavigationEnd(0, url, ''));
  //   expect(storage.load).toHaveBeenCalledTimes(1);
  //   // expect(storage.load).toHaveBeenCalledWith('test/folder');
  // });
  //
  // it('should not load storage when url is not /storage', () => {
  //   const url = '/settings/test';
  //   isLoggedIn = true;
  //   eventsSubject.next(new NavigationEnd(0, url, ''));
  //   expect(storage.load).toHaveBeenCalledTimes(0);
  // });
  //
  // it('should not load storage when navigation is started', () => {
  //   const url = '/storage/test/folder';
  //   isLoggedIn = true;
  //   eventsSubject.next(new NavigationStart(0, url));
  //   expect(storage.load).toHaveBeenCalledTimes(0);
  // });
});
