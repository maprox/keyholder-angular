import { Injectable } from '@angular/core';

import { Options } from './model';

@Injectable()
export class PasswordGeneratorService {
    private lowercase = 'abcdefghijklmnopqrstuvwxyz';
    private uppercase = this.lowercase.toUpperCase();
    private numbers = '0123456789';
    private symbols = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~';

    /**
     * @param {Options} options
     * @returns {string}
     */
    protected getAvailableCharacters(options: Options): string {
        let pool = '';
        pool += options.useLowercase ? this.lowercase : '';
        pool += options.useUppercase ? this.uppercase : '';
        pool += options.useNumbers ? this.numbers : '';
        pool += options.useSymbols ? this.symbols : '';
        return pool;
    }

    /**
     * Generates new password based on the passed options instance
     *
     * @param {Options} [options]
     * @returns {string}
     */
    generate(options?: Options): string {
        if (!options) {
            options = new Options();
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
