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
const adminProductsServices_1 = __importDefault(require("../../services/productServices/adminProductsServices"));
const commonProductServices_1 = __importDefault(require("../../services/productServices/commonProductServices"));
class AdminProductControllers extends abstractController_1.default {
    constructor() {
        super();
        this.adminProductServices = new adminProductsServices_1.default();
        this.commonProductServices = new commonProductServices_1.default();
        /**
         * getAQueensAllProducts
         */
        this.getAQueensAllProducts = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const products = yield this.commonProductServices.getAQueensAllProducts('admin_products', req);
            if (products.success) {
                res.status(200).json(products);
            }
            else {
                this.error();
            }
        }));
        // get all product by date range and or status and or category
        this.getAllProductByDateRangeStatusCategory = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const products = yield this.adminProductServices.getAllProductByDateRangeStatusCategory(req);
            if (products.success) {
                res.status(200).json(products);
            }
            else {
                this.error();
            }
        }));
        /**
         * getAProduct
         */
        this.getAProduct = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonProductServices.getAProduct('admin_products', req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                res.status(404).json(data);
            }
        }));
        /**
         * updateProduct
         */
        this.updateProduct = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminProductServices.updateProduct(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error(data.message, 400, 'Bad request');
            }
        }));
        //approve update product
        this.approveUpdateProduct = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminProductServices.approveUpdateProduct(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error(data.message, 400, 'Bad request');
            }
        }));
        //approve update product
        this.rejectUpdateProduct = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminProductServices.rejectUpdateProduct(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error(data.message, 400, 'Bad request');
            }
        }));
        // get single update product request
        this.getSingleUpdateProduct = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminProductServices.getASingleProductUpdate(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // get a queens all update product request
        this.getQueensUpdateProduct = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminProductServices.getAllPendingUpdateProductOfQueen(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // get all update pending products
        this.getAllUpdatePendingProducts = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.adminProductServices.getAllPendingUpdateProduct(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        /**
         * getAllProducts
         */
        this.getAllProducts = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonProductServices.getAllProducts(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        /**
         * getAllProductsByStatus
         */
        this.getAllProductsByStatus = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonProductServices.getAllProductsByStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        /**
         * getAllProductsByCategory
         */
        this.getAllProductsByCategory = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonProductServices.getAllProductsByCategory('admin_products', req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        /**
         * getAllProductsByCategory and status
         */
        this.getAllProductsByCategoryAndStatus = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.commonProductServices.getAllProductsByCategoryAndStatus('admin_products', req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = AdminProductControllers;
//# sourceMappingURL=adminProductControllers.js.map