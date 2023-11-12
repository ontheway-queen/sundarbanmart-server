"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractRouter_1 = __importDefault(require("../../../abstracts/abstractRouter"));
const productControllers_1 = __importDefault(require("../../controllers/genController/productControllers"));
class ProductRouters extends abstractRouter_1.default {
    constructor() {
        super();
        this.productControllers = new productControllers_1.default();
        this.callRouters();
    }
    callRouters() {
        /**
         *  queen upload product
         */
        this.routers.post('/upload', this.multipleUploader.upload('products'), this.reqSetter.setRequest, this.productControllers.queenUploadProduct);
        /**
         *  get a queens all products
         */
        this.routers.get('/get/all/by-queen/:queen_id', this.productControllers.getAQueensAllProducts);
        /**
         *  get all products by category
         */
        this.routers.get('/get/all/by-category/:category', this.productControllers.getAllProductsByCategory);
        /**
         *  get a product
         */
        this.routers.get('/get/by-id/:id', this.productControllers.getAProduct);
        /**
         *  queen update product
         */
        this.routers.put('/update/queen/:id', this.multipleUploader.upload('products'), this.reqSetter.setRequest, this.productControllers.queenUpdateProduct);
        /**
         *  delete product
         */
        this.routers.delete('/delete/:id', this.productControllers.deleteProduct);
        /**
         *  get all approved products
         */
        this.routers.get('/get/approved/all', this.productControllers.getAllApprovedProducts);
        /**
         *  search products
         */
        this.routers.get('/search', this.productControllers.searchProducts);
    }
}
exports.default = ProductRouters;
//# sourceMappingURL=productRouters.js.map