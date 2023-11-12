"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractRouter_1 = __importDefault(require("../../../abstracts/abstractRouter"));
const ratingController_1 = __importDefault(require("../../controllers/genController/ratingController"));
class ratingRouter extends abstractRouter_1.default {
    constructor() {
        super();
        this.ratingController = new ratingController_1.default();
        this.callRouters();
    }
    callRouters() {
        // add product rating
        this.routers.post('/add/rating', this.multipleUploader.upload('rating'), this.reqSetter.setRequest, this.ratingController.addProductRating);
        // get a product all ratings/reviews
        this.routers.get('/get/ratings/:product', this.ratingController.getProductRatings);
        // get a product all ratings/reviews
        this.routers.get('/get/ratings/customer/:rater', this.ratingController.getCustomerRatings);
        // delete a rating/review
        this.routers.delete('/delete/rating/:rating', this.ratingController.deleteRating);
        // check rating of a product and customer
        this.routers.get('/check/rating/:product/:customer', this.ratingController.checkRating);
    }
}
exports.default = ratingRouter;
//# sourceMappingURL=ratingRouter.js.map