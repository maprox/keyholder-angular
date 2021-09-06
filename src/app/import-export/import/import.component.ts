import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../alert';
import { StorageApiService, StorageService } from '../../storage';
import { FileIoService } from '../file-io.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit {
  constructor(
    private storageApiService: StorageApiService,
    private storageService: StorageService,
    private alertService: AlertService,
    private fileIoService: FileIoService
  ) {
  }

  ngOnInit() {}

  fileChanged(event: any) {
    const fileList: FileList = event.target.files;
    if (!fileList.length) {
      return;
    }

    this.fileIoService.readFile(fileList[0]).subscribe(
      (contents) => {
        this.onFileLoad(contents);
      },
      (error) => {
        this.alertService.error(`Import failed! Error reading the file! ${error || ''}`);
      }
    );
  }

  onFileLoad(data: string) {
    // todo ask if user ready to rewrite existing storage
    const container = this.storageApiService.loadContainer(data);
    if (!container) {
      this.alertService.error('Import failed! Error decrypting file contents!');
      return;
    }
    this.storageApiService.save(
      container.getStorage(),
      container.getOptions()
    ).subscribe(
      () => {
        this.storageService.setRoot(container.getStorage());
        this.alertService.success('Successfully imported!');
      },
      () => {
        this.alertService.error('Import failed! Error saving the storage!');
      }
    );
  }
}
