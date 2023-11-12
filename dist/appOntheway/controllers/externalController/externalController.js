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
const commonServices_1 = __importDefault(require("../../../common/services/commonServices"));
class ExternalController extends abstractController_1.default {
    constructor() {
        super();
        this.commonService = new commonServices_1.default();
        // atab payment success
        this.atabPaymentSuccess = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonService.atabPaymentSuccess(req);
            if (data.success) {
                res.redirect(`${data.data}/payment-success`);
            }
            else {
                res.redirect(`${data}/payment-failed`);
            }
        }));
        // atab payment failed
        this.atabPaymentFailed = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonService.atabPaymentFailed(req);
            res.redirect(`${data.data}/payment-failed`);
        }));
        // atab payment cancelled
        this.atabPaymentCancelled = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonService.atabPaymentCancelled(req);
            res.redirect(`${data.data}/payment-failed`);
        }));
        // create video app test
        this.createVideoAppTest = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonService.createVideoAppTest(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                res.status(400).json(data);
            }
        }));
        // get all video app test
        this.getVideoAppTest = this.assyncWrapper.wrap((_req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonService.getAllAppVideos();
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                res.status(400).json(data);
            }
        }));
    }
}
exports.default = ExternalController;
//# sourceMappingURL=externalController.js.map