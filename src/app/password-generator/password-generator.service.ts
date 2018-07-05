import { Injectable } from '@angular/core';

import { Options } from './model';

@Injectable()
export class PasswordGeneratorService {
    private lowercase = 'abcdefghijklmnopqrstuvwxyz';
    private uppercase = this.lowercase.toUpperCase();
    private numbers = '0123456789';
    private symbols = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~';
    private options = new Options();

    /**
     * @param {Options} options
     * @returns {string}
     */
    protected getAvailableCharacters(options: Options): string {
        return this.getOptionsFields().reduce((result, value) => {
            return result + (options[value.name] ? value.hint : '');
        }, '');
    }

    getOptionsFields(): any[] {
        return [{
            text: 'Use numbers',
            hint: this.numbers,
            name: 'useNumbers'
        }, {
            text: 'Use symbols',
            hint: this.symbols,
            name: 'useSymbols'
        }, {
            text: 'Use lowercase',
            hint: this.lowercase,
            name: 'useLowercase'
        }, {
            text: 'Use uppercase',
            hint: this.uppercase,
            name: 'useUppercase'
        }];
    }

    /**
     * Sets default options instance
     *
     * @param {Options} options
     */
    setOptions(options: Options) {
        this.options = options;
    }

    /**
     * Returns default options instance
     *
     * @return {Options}
     */
    getOptions(): Options {
        return this.options;
    }

    /**
     * Generates new password based on the passed options instance
     *
     * @param {Options} [options]
     * @returns {string}
     */
    generate(options?: Options): string {
        if (!options) {
            options = this.options;
        }

        // Generate character pool
        const availableCharacters = this.getAvailableCharacters(options);
        if (!availableCharacters || (options.length <= 0)) {
            throw new Error('Invalid options for the password generator');
        }

        let password = '';
        while (password.length < options.length) {
            const index = Math.floor(Math.random() * availableCharacters.length);
            password += availableCharacters.substring(index, index + 1);
        }

        return password;
    }
}
