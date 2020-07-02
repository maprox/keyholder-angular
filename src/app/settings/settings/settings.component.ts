import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { PasswordGeneratorService } from '../../password-generator';
import { Options } from '../../password-generator/model';
import { StorageApiService, StorageService } from '../../storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public options: Options;
  public fields: object[];

  constructor(
    private passwordGenerator: PasswordGeneratorService,
    private storageApi: StorageApiService,
    private storageService: StorageService
  ) {
    this.options = this.passwordGenerator.getOptions();
    this.fields = this.passwordGenerator.getOptionsFields();
  }

  ngOnInit() {
    this.storageApi.load().pipe(first()).subscribe(
      container => {
        this.options = container.getOptions();
      }
    );
  }

  /**
   * Toggle option value
   *
   * @param {string} option
   */
  toggle(option: string) {
    this.options[option] = !this.options[option];
    this.save();
  }

  save() {
    this.storageService.save();
  }
}
