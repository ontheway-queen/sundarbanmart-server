"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractRouter_1 = __importDefault(require("../../../abstracts/abstractRouter"));
const customerControllers_1 = __importDefault(require("../../controllers/genController/customerControllers"));
class CustomerRouters extends abstractRouter_1.default {
    constructor() {
        super();
        this.customerController = new customerControllers_1.default();
        this.callRouters();
    }
    callRouters() {
        /**
         * reguster customer
         */
        this.routers.post('/auth/register', this.customerController.register);
        /**
         * get all customers
         */
        this.routers.get('/get/all', this.customerController.getAllCustomers);
        /**
         *  get a customer by id
         */
        this.routers.get('/get/:id', this.customerController.getACustomer);
        /**
         *  get a customer by phone
         */
        this.routers.get('/get/by-phone/:phone', this.customerController.getACustomer);
        /**
         *  update customer info
         */
        this.routers.put('/update/:id', this.singleUploader.upload('customers'), this.reqSetter.setRequest, this.customerController.updateCustomerInfo);
    }
}
exports.default = CustomerRouters;
//# sourceMappingURL=customerRouters.js.map