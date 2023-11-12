"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractRouter_1 = __importDefault(require("../../../abstracts/abstractRouter"));
const externalController_1 = __importDefault(require("../../controllers/externalController/externalController"));
class ExternalRouter extends abstractRouter_1.default {
    constructor() {
        super();
        this.externalController = new externalController_1.default();
        this.callRouter();
    }
    // call router
    callRouter() {
        // atab payment success
        this.routers.post('/payment/success', this.externalController.atabPaymentSuccess);
        // atab payment failed
        this.routers.get('/payment/failed', this.externalController.atabPaymentFailed);
        // atab payment cancelled
        this.routers.get('/payment/cancelled', this.externalController.atabPaymentCancelled);
        // get video api for app test
        this.routers.get('/m360ict/get/video/app/test', this.externalController.getVideoAppTest);
        // create video api for app test
        this.routers.post('/m360ict/create/video/app/test', this.multipleUploader.rawUpload('others'), this.externalController.createVideoAppTest);
    }
}
exports.default = ExternalRouter;
//# sourceMappingURL=externalRouter.js.map