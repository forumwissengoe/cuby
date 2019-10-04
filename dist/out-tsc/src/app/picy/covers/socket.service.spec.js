import { TestBed } from '@angular/core/testing';
import { SocketService } from './socket.service';
describe('SocketService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(SocketService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=socket.service.spec.js.map