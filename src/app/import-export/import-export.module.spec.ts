import { ImportExportModule } from './import-export.module';

describe('ImportExportModule', () => {
    let importExportModule: ImportExportModule;

    beforeEach(() => {
        importExportModule = new ImportExportModule();
    });

    it('should create an instance', () => {
        expect(importExportModule).toBeTruthy();
    });
});
