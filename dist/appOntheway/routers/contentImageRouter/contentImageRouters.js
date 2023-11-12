"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractRouter_1 = __importDefault(require("../../../abstracts/abstractRouter"));
const contentImagesController_1 = __importDefault(require("../../controllers/contentImagesController/contentImagesController"));
class ContentImageRouters extends abstractRouter_1.default {
    constructor() {
        super();
        this.ContentImageController = new contentImagesController_1.default();
        this.callRouters();
    }
    callRouters() {
        // get section images
        this.routers.get('/get/images/:section', this.ContentImageController.getContentImages);
        // post or put slider images
        this.routers.put('/add/update/images/:section', this.multipleUploader.rawUpload('content_images'), this.reqSetter.setRequest, this.ContentImageController.postOrUpdateSliderImages);
        // Update daily deals imgs
        this.routers.put('/update/image/deals/:section', this.singleUploader.rawUpload('daily-deals'), this.reqSetter.setRequest, this.ContentImageController.updateDailyDealsImg);
    }
}
exports.default = ContentImageRouters;
//# sourceMappingURL=contentImageRouters.js.map