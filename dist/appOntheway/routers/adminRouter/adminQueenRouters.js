"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminQueenControllers_1 = __importDefault(require("../../controllers/adminController/adminQueenControllers"));
const abstractRouter_1 = __importDefault(require("../../../abstracts/abstractRouter"));
class AdminQueenRouters extends abstractRouter_1.default {
    constructor() {
        super();
        this.adminQueenController = new adminQueenControllers_1.default();
        this.callRouters();
    }
    callRouters() {
        /**
         * get all queen by phone
         */
        this.routers.get('/getqueen/phone/:phone', this.adminQueenController.getAQueen('admin_queens'));
        /**
         * get queen for admin
         */
        this.routers.get('/getqueen/for-admin/:id', this.adminQueenController.getAQueen('admin_queens'));
        /**
         * get all queen by phone for admin
         */
        this.routers.get('/getqueen/phone/for-admin/:phone', this.adminQueenController.getAQueen('admin_queens'));
        /*
        get queens by date range
        */
        this.routers.get('/getby/date/range', this.adminQueenController.getQueenBydateRange);
        // get queens by date range and status
        this.routers.get('/getby/date/range/:status', this.adminQueenController.getQueenBydateRangeAndStatus);
        /*
        get queens by date
        */
        this.routers.get('/getby/date', this.adminQueenController.getQueenBydate);
        /*
        get queens by date and status
        */
        this.routers.get('/getby/date/:status', this.adminQueenController.getQueenBydateAndStatus);
        // get all queens by category and status or all
        this.routers.get('/getby/category/status/:category/:status', this.adminQueenController.getQueenByCategoryAndStatus);
        /**
         * get all queens
         */
        this.routers.get('/get/all', this.adminQueenController.getAllQueens);
        /**
         * get all queens by status
         */
        this.routers.get('/get/all/:status', this.adminQueenController.getAllQueensByStatus);
        /**
         * update queens info
         */
        this.routers.put('/update/:id', this.singleUploader.upload('queens'), this.reqSetter.setRequest, this.adminQueenController.updateQueensInfo);
    }
}
exports.default = AdminQueenRouters;
//# sourceMappingURL=adminQueenRouters.js.map