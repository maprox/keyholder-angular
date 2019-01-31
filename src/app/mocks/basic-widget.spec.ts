import { ComponentFixture, TestBed } from '@angular/core/testing';

export class BasicTestWidget<T> {
  public fixture: ComponentFixture<T>;
  public mocks = {};

  constructor() {}

  private initMocks(config: any): any {
    if (config.providers) {
      config.providers.forEach((provider) => {
        this.mocks[provider.provide.name] = provider.useValue;
      });
    }
    return config;
  }

  compileComponents(config: any) {
    TestBed.configureTestingModule(this.initMocks(config)).compileComponents();
  }

  createComponent(type) {
    this.fixture = TestBed.createComponent(type);
    this.findElements();
  }

  detectChanges() {
    this.fixture.detectChanges();
  }

  getComponent(): T {
    return this.fixture.componentInstance;
  }

  findElements() {}
}
