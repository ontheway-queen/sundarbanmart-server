"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const headerSetter_1 = __importDefault(require("./androMiddlewares/headerSetter"));
class AndroApp {
    constructor(routers) {
        this.headerSetter = new headerSetter_1.default();
        this.app = (0, express_1.default)();
        this.initMiddlewares();
        this.initRouters(routers);
    }
    initMiddlewares() {
        this.app.use(this.headerSetter.setHeader);
    }
    initRouters(routers) {
        this.app.use('/api/auth', routers.authRouter);
        this.app.use('/api/admin/auth', routers.adminPanelRouter);
        // GENERAL ROUTERS
        this.app.use('/api/otp', routers.otpRouter);
        this.app.use('/api/admin/queen', routers.queenRouter);
        this.app.use('/api/customer', routers.customerRouter);
        this.app.use('/api/admin/product', routers.productRouter);
        this.app.use('/api/admin/queen', routers.adminQueenRouter);
        this.app.use('/api/orders', routers.orderRouter);
        this.app.use('/api/fund', routers.fundRouter);
        this.app.use('/api/admin/product', 
        // this.checker.check('qotw', 'cotw', '__a_o'),
        routers.adminProductRouter);
        this.app.use('/api/admin/fund', routers.adminFundRouters);
    }
}
exports.default = AndroApp;
//# sourceMappingURL=adnroApp.js.map