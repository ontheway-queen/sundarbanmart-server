"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractRouter_1 = __importDefault(require("../../../abstracts/abstractRouter"));
const queenOffersController_1 = __importDefault(require("../../controllers/queenOffersController/queenOffersController"));
class queenOffersRouter extends abstractRouter_1.default {
    constructor() {
        super();
        this.queenOffersController = new queenOffersController_1.default();
        this.callRouters();
    }
    callRouters() {
        // create offer for queen
        this.routers.post('/create/offer', this.singleUploader.upload('queens_offer'), this.reqSetter.setRequest, this.queenOffersController.createQueenOffer);
        // update offer
        this.routers.put('/update/offer/:id', this.singleUploader.upload('queens_offer'), this.reqSetter.setRequest, this.queenOffersController.updateQueensOffer);
        // get all offers
        this.routers.get('/get/all', this.queenOffersController.getAllQueensOffer);
        // get all offer by status
        this.routers.get('/get/all/by-status/:status', this.queenOffersController.getAllQueensOfferByStatus);
        // get a single queens offer
        this.routers.get('/get/single/:offer_id', this.queenOffersController.getASingleQueensOffer);
        // queen get an queens offfer
        this.routers.post('/queen/get/offer', this.queenOffersController.queenGetAnOffer);
        // update a get offer by queen
        this.routers.put('/update/queen/getting/offer', this.queenOffersController.updateQueensGettingOffer);
        // get an offers getting all queens
        this.routers.get('/get/all/getting-queens/by/offer/:offer_id', this.queenOffersController.offersAllGettingQueen);
        // get a queens getting all offer
        this.routers.get('/get/all/queens-offer/by/queen/:queen_id', this.queenOffersController.queensGettingAllOffers);
    }
}
exports.default = queenOffersRouter;
//# sourceMappingURL=queenOffersRouter.js.map