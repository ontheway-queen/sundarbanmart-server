"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adnroApp_1 = __importDefault(require("./subAndroApp/adnroApp"));
const otwLib_1 = __importDefault(require("./utils/otwLib"));
class OtwApp {
    constructor(routers) {
        this.app = (0, express_1.default)();
        this.androApp = new adnroApp_1.default(routers);
        this.initRouters(routers);
        this.tasks();
    }
    initRouters(routers) {
        /**
         * ANDRO ROUTERS
         */
        this.app.use('/andro', this.androApp.app);
        /**
         * AUTH ROUTERS
         */
        this.app.use('/api/auth', routers.authRouter);
        //admin panel routers
        this.app.use('/api/admin', routers.adminPanelRouter);
        // GENERAL ROUTERS
        this.app.use('/api/otp', routers.otpRouter);
        this.app.use('/api/admin/queen', routers.queenRouter);
        this.app.use('/api/queen-offer', routers.queenOfferRouter);
        this.app.use('/api/customer', routers.customerRouter);
        this.app.use('/api/fund', routers.fundRouter);
        this.app.use('/api/admin/product', routers.productRouter);
        this.app.use('/api/orders', routers.orderRouter);
        // Content Routers
        this.app.use('/api/content', routers.contentImageRouter);
        /**
         * ADMIN ROUTERS
         */
        this.app.use('/api/admin/queen', routers.adminQueenRouter);
        this.app.use('/api/admin/product', routers.adminProductRouter);
        this.app.use('/api/admin/fund', routers.adminFundRouters);
        // admin search router
        this.app.use('/api/admin', routers.adminSearchRouter);
        // client router
        this.app.use('/api/client', routers.clientRouter);
        //rating router
        this.app.use('/api/product', routers.ratingRouter);
        // product qa router
        this.app.use('/api/product-qa', routers.porductQARouter);
        // blog router
        this.app.use('/api/blog', routers.blogRouter);
        // common router
        this.app.use('/api/common', routers.commonRouter);
        // atab external services router
        this.app.use('/api/external/atab', routers.externalRouter);
    }
    tasks() {
        otwLib_1.default.cronTask();
    }
}
exports.default = OtwApp;
//# sourceMappingURL=otwApp.js.map