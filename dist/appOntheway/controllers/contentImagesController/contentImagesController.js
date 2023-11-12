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
const contentImageServices_1 = __importDefault(require("../../services/contentImageServices/contentImageServices"));
class ContentImagesController extends abstractController_1.default {
    constructor() {
        super();
        this.contentImageServices = new contentImageServices_1.default();
        // add or update slider images controller
        this.postOrUpdateSliderImages = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.contentImageServices.sliderimageUploadOrUpdate(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        //  get content images controller
        this.getContentImages = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.contentImageServices.getContentImgs(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error(data.message);
            }
        }));
        // Update daily deals img
        this.updateDailyDealsImg = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.contentImageServices.updateDailyDealsImgs(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = ContentImagesController;
//# sourceMappingURL=contentImagesController.js.map