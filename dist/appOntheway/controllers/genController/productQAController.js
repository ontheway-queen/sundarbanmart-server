"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractController_1 = __importDefault(require("../../../abstracts/abstractController"));
const productQAServices_1 = __importDefault(require("../../services/productServices/productQAServices"));
class productQAController extends abstractController_1.default {
    constructor() {
        super();
        this.productQAService = new productQAServices_1.default();
        // post a question controller
        this.askQuestionControlle = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.productQAService.askQuestionService(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Cannot ask question now!');
            }
        }));
        // get all questions of a product
        this.getAllQuestionsByProduct = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.productQAService.getAllQuestionServiceClient(req, 'product');
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Cannot get all questions now!');
            }
        }));
        // get all questions of a customer
        this.getAllQuestionsByCustomer = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.productQAService.getAllQuestionServiceClient(req, 'customer');
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Cannot get all questions now!');
            }
        }));
        // get all not answered questions for admin
        this.getAllNotQuestionsForAdmin = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.productQAService.getAllQuestionServiceAdmin(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Cannot get all questions now!');
            }
        }));
        // get all not answered questions for admin
        this.getAllQuestionsByProductForAdmin = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.productQAService.getAllQuestionOfProductForAdmin(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Cannot get all questions now!');
            }
        }));
        // answer a question by admin
        this.answerQuestion = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.productQAService.updateQuestion(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Something is wrong, Try again!');
            }
        }));
        // delete a question
        this.deleteQuestion = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.productQAService.updateQuestion(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Question cannot delete now!');
            }
        }));
    }
}
exports.default = productQAController;
//# sourceMappingURL=productQAController.js.map