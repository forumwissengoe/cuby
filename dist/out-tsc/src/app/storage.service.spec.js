import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
describe('StorageService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(StorageService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=storage.service.spec.js.map