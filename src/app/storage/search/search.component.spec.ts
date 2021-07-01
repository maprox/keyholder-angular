// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Router } from '@angular/router';
// import { StorageService } from '../storage.service';
//
// import { SearchComponent } from './search.component';
//
// describe('SearchComponent', () => {
//   let component: SearchComponent;
//   let fixture: ComponentFixture<SearchComponent>;
//   let routerMock;
//   let storageServiceMock;
//
//   beforeEach(async(() => {
//     storageServiceMock = {};
//     routerMock = {
//       navigate: jasmine.createSpy()
//     };
//     TestBed.configureTestingModule({
//       declarations: [
//         SearchComponent,
//       ],
//       providers: [
//         {
//           provide: StorageService,
//           useValue: storageServiceMock,
//         },
//         {
//           provide: Router,
//           useValue: routerMock,
//         },
//       ],
//     })
//     .compileComponents();
//   }));
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(SearchComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
