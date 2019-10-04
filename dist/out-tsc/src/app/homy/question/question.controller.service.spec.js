import { TestBed } from '@angular/core/testing';
import { QuestionController } from './question.controller.service';
describe('Question.ControllerService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(QuestionController);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=question.controller.service.spec.js.map