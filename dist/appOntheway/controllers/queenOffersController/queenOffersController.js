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
const queenOffersServices_1 = __importDefault(require("../../services/queenOffersServices/queenOffersServices"));
class queenOffersController extends abstractController_1.default {
    constructor() {
        super();
        this.queenOffersServices = new queenOffersServices_1.default();
        // cteate an offer
        this.createQueenOffer = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.queenOffersServices.createQueensOffer(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error(data.message);
            }
        }));
        // update a queens offer
        this.updateQueensOffer = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.queenOffersServices.updateQueensOffer(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error(data.message);
            }
        }));
        // get all queens offer
        this.getAllQueensOffer = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.queenOffersServices.getAllQueensOffer(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // get all queens offer by status
        this.getAllQueensOfferByStatus = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.queenOffersServices.getAllQueensOfferByStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // get a single queens offer
        this.getASingleQueensOffer = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.queenOffersServices.getASingleQueensOffer(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                res.status(500).json(data);
            }
        }));
        // queen get an queens offer
        this.queenGetAnOffer = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.queenOffersServices.queenGetAnOffer(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                res.status(500).json(data);
            }
        }));
        // update a get offer by queen
        this.updateQueensGettingOffer = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.queenOffersServices.updateQueensGettingOffer(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                res.status(500).json(data);
            }
        }));
        // get an offers getting all queens
        this.offersAllGettingQueen = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.queenOffersServices.offersAllGettingQueen(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                res.status(500).json(data);
            }
        }));
        // get a queens getting all offer
        this.queensGettingAllOffers = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.queenOffersServices.queensGettingAllOffers(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                res.status(500).json(data);
            }
        }));
    }
}
exports.default = queenOffersController;
//# sourceMappingURL=queenOffersController.js.map