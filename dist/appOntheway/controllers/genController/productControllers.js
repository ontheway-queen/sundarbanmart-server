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
const socket_1 = require("../../../common/socket/socket");
const abstractController_1 = __importDefault(require("../../../abstracts/abstractController"));
const notificationServices_1 = __importDefault(require("../../services/adminPanelServices/notificationServices"));
const commonProductServices_1 = __importDefault(require("../../services/productServices/commonProductServices"));
const productServices_1 = __importDefault(require("../../services/productServices/productServices"));
class ProductControllers extends abstractController_1.default {
    constructor() {
        super();
        this.productServices = new productServices_1.default();
        this.commonProductServices = new commonProductServices_1.default();
        this.notificationServices = new notificationServices_1.default();
        /**
         * queenUploadProduct
         */
        this.queenUploadProduct = this.assyncWrapper.wrap((req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.productServices.queenUploadProduct(req);
            if (data.success) {
                res.status(200).json({ success: true, data: data.data });
                const notification = yield this.notificationServices.postNotification('new-product', { msg: 'New Product Added' });
                socket_1.io.emit('new_notification', notification);
                socket_1.io.emit('new_product', data.data);
            }
            else {
                this.error(data.message, 400, 'Bad request');
            }
        }));
        /**
         * getAQueensAllProducts
         */
        this.getAQueensAllProducts = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const products = yield this.commonProductServices.getAQueensAllProducts('products', req);
            if (products.success) {
                res.status(200).json({ success: true, data: products.data });
            }
            else {
                this.error();
            }
        }));
        /**
         * getAllProductsByCategory
         */
        this.getAllProductsByCategory = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonProductServices.getAllProductsByCategory('products', req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        /**
         * getAProduct
         */
        this.getAProduct = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonProductServices.getAProduct('products', req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                res.status(404).json(data);
            }
        }));
        /**
         * queenUpdateProduct
         */
        this.queenUpdateProduct = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.productServices.queenRequestUpdateProduct(req);
            if (data.success) {
                res.status(200).json({ success: true, message: data.message });
                const notification = yield this.notificationServices.postNotification('product-updated', { msg: 'Product Updated', update_id: Number(id) });
                socket_1.io.emit('new_notification', notification);
                socket_1.io.emit('new_update_product_request', data);
            }
            else {
                this.error(data.message, 400, 'Bad request');
            }
        }));
        /**
         * deleteProduct
         */
        this.deleteProduct = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonProductServices.deleteProduct(req);
            if (data.success) {
                res.status(200).json({ success: true, message: data.message });
            }
            else {
                this.error(data.message, 400, 'Bad request');
            }
        }));
        /**
         * getAllApprovedProducts
         */
        this.getAllApprovedProducts = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.productServices.getAllApprovedProducts(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        /**
         * searchProducts
         */
        this.searchProducts = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.productServices.searchProducts(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = ProductControllers;
//# sourceMappingURL=productControllers.js.map