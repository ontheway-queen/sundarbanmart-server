"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const otpRouters_1 = __importDefault(require("./otpRouter/otpRouters"));
const fundRouters_1 = __importDefault(require("./genRouter/fundRouters"));
const authRouters_1 = __importDefault(require("./authRouter/authRouters"));
const queenRouters_1 = __importDefault(require("./genRouter/queenRouters"));
const orderRouters_1 = __importDefault(require("./orderRouter/orderRouters"));
const productRouters_1 = __importDefault(require("./genRouter/productRouters"));
const customerRouters_1 = __importDefault(require("./genRouter/customerRouters"));
const adminFundRouters_1 = __importDefault(require("./adminRouter/adminFundRouters"));
const adminQueenRouters_1 = __importDefault(require("./adminRouter/adminQueenRouters"));
const adminPanelRouter_1 = __importDefault(require("./adminPanelRouter/adminPanelRouter"));
const adminProductRouters_1 = __importDefault(require("./adminRouter/adminProductRouters"));
const contentImageRouters_1 = __importDefault(require("./contentImageRouter/contentImageRouters"));
const adminSearchRouters_1 = __importDefault(require("./adminRouter/adminSearchRouters"));
const clientRouter_1 = __importDefault(require("./clientRouter/clientRouter"));
const ratingRouter_1 = __importDefault(require("./genRouter/ratingRouter"));
const productQARouters_1 = __importDefault(require("./genRouter/productQARouters"));
const queenOffersRouter_1 = __importDefault(require("./queenOffersRouter/queenOffersRouter"));
const blogRouter_1 = __importDefault(require("./blogRouter/blogRouter"));
const commonRouters_1 = __importDefault(require("./commonRouter/commonRouters"));
const externalRouter_1 = __importDefault(require("./externalRouter/externalRouter"));
class Routers {
    constructor() {
        this.otpRouter = new otpRouters_1.default().routers;
        this.fundRouter = new fundRouters_1.default().routers;
        this.authRouter = new authRouters_1.default().routers;
        this.queenRouter = new queenRouters_1.default().routers;
        this.queenOfferRouter = new queenOffersRouter_1.default().routers;
        this.orderRouter = new orderRouters_1.default().routers;
        this.productRouter = new productRouters_1.default().routers;
        this.customerRouter = new customerRouters_1.default().routers;
        this.adminFundRouters = new adminFundRouters_1.default().routers;
        this.adminQueenRouter = new adminQueenRouters_1.default().routers;
        this.adminPanelRouter = new adminPanelRouter_1.default().routers;
        this.contentImageRouter = new contentImageRouters_1.default().routers;
        this.adminProductRouter = new adminProductRouters_1.default().routers;
        this.adminSearchRouter = new adminSearchRouters_1.default().routers;
        this.clientRouter = new clientRouter_1.default().routers;
        this.ratingRouter = new ratingRouter_1.default().routers;
        this.porductQARouter = new productQARouters_1.default().routers;
        this.blogRouter = new blogRouter_1.default().routers;
        this.commonRouter = new commonRouters_1.default().routers;
        this.externalRouter = new externalRouter_1.default().routers;
    }
}
exports.default = Routers;
//# sourceMappingURL=otwRouters.js.map