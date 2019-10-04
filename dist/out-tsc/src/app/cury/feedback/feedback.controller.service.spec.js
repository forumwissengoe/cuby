import { TestBed } from '@angular/core/testing';
import { FeedbackController } from './feedback.controller.service';
describe('Feedback.ControllerService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(FeedbackController);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=feedback.controller.service.spec.js.map