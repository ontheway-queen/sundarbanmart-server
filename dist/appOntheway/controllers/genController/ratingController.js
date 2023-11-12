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
const productRatingServices_1 = __importDefault(require("../../services/productServices/productRatingServices"));
class ratingController extends abstractController_1.default {
    constructor() {
        super();
        this.ratingServices = new productRatingServices_1.default();
        /**
         * add product rating controller
         */
        this.addProductRating = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.ratingServices.addProductRating(req);
            if (data.success) {
                res
                    .status(200)
                    .json({ success: true, msg: 'Rating added successfully!' });
            }
            else {
                this.error(data.msg);
            }
        }));
        // get a product all ratings/reviews
        this.getProductRatings = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.ratingServices.getProductRatings(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('rating not found', 404, 'Not found');
            }
        }));
        // get a customer all ratings/reviews
        this.getCustomerRatings = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.ratingServices.getCustomerRatings(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('rating not found', 404, 'Not found');
            }
        }));
        // delete a rating/review
        this.deleteRating = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.ratingServices.deleteRating(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error(data.msg, 404, 'Not found');
            }
        }));
        // check rating of a customer and product
        this.checkRating = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.ratingServices.checkRatingOfCustomer(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Something is wrong', 404, 'Not found');
            }
        }));
    }
}
exports.default = ratingController;
//# sourceMappingURL=ratingController.js.map