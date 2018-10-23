import { TestBed, inject } from '@angular/core/testing';

import { Options } from './model';
import { PasswordGeneratorService } from './password-generator.service';

describe('PasswordGeneratorService', () => {
    let service: PasswordGeneratorService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PasswordGeneratorService]
        });
    });

    beforeEach(inject([PasswordGeneratorService], (_service: PasswordGeneratorService) => {
        service = _service;
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should generate passwords with default options', () => {
        const options = new Options();
        expect(options.length).toEqual(30);
        expect(service.generate().length).toEqual(options.length);
    });

    it('should raise error with wrong options', () => {
        const options = new Options(10, false, false, false, false);
        expect(options.length).toEqual(10);
        const expectedError = new Error('Invalid options for the password generator');
        expect(() => service.generate(options)).toThrow(expectedError);
    });

    it('should raise error when length is 0', () => {
        const options = new Options(0);
        expect(options.length).toEqual(0);
        const expectedError = new Error('Invalid options for the password generator');
        expect(() => service.generate(options)).toThrow(expectedError);
    });

    it('should generate numeric passwords', () => {
        const options = new Options(10, true, false, false, false);
        const secret = service.generate(options);
        expect(secret.length).toEqual(options.length);
        expect((/^\d+$/).test(secret)).toBeTruthy();
    });

    it('should generate symbols passwords', () => {
        const options = new Options(20, false, true, false, false);
        const secret = service.generate(options);
        expect(secret.length).toEqual(options.length);
        expect((/^[\D\W]+$/).test(secret)).toBeTruthy();
    });

    it('should generate lowercase passwords', () => {
        const options = new Options(20, false, false, true, false);
        const secret = service.generate(options);
        expect(secret.length).toEqual(options.length);
        expect((/^[a-z]+$/).test(secret)).toBeTruthy();
    });

    it('should generate uppercase passwords', () => {
        const options = new Options(20, false, false, false, true);
        const secret = service.generate(options);
        expect(secret.length).toEqual(options.length);
        expect((/^[A-Z]+$/).test(secret)).toBeTruthy();
    });

    it('should generate with changed options', () => {
        const defaultOptions = service.getOptions();
        expect(defaultOptions.length).toEqual(30);
        expect(defaultOptions.useNumbers).toEqual(true);
        expect(defaultOptions.useSymbols).toEqual(true);
        expect(defaultOptions.useLowercase).toEqual(true);
        expect(defaultOptions.useUppercase).toEqual(true);

        const options = new Options(5, false, false, false, true);
        service.setOptions(options);

        const secret = service.generate();
        expect(secret.length).toEqual(options.length);
        expect((/^[A-Z]+$/).test(secret)).toBeTruthy();
    });

    it('should return options fields', () => {
        const optionsFields = service.getOptionsFields();
        expect(optionsFields.length).toEqual(4);
    });
});
