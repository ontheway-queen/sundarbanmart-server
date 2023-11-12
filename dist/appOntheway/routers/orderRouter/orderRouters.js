"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractRouter_1 = __importDefault(require("../../../abstracts/abstractRouter"));
const orderControllers_1 = __importDefault(require("../../controllers/orderController/orderControllers"));
class OrderRouters extends abstractRouter_1.default {
    constructor() {
        super();
        this.orderControllers = new orderControllers_1.default();
        this.callRouters();
    }
    callRouters() {
        /**
         *  create order
         */
        this.routers.post('/create', this.orderControllers.createOrder);
        /**
         *  get a queens all orders
         */
        this.routers.get('/get/all/queen/:queen_id', this.orderControllers.getAQueensAllOrders);
        // get a queen all orders by status
        this.routers.get('/get/all/by-status/queen/:queen_id/:status', this.orderControllers.getAQueensAllOrderByStatus);
        /**
         *  get al customers all orders
         */
        this.routers.get('/get/all/customer/:customer_id/:status', this.orderControllers.getACustomersAllOrders);
        /**
         *  get all orders
         */
        this.routers.get('/get/all', this.orderControllers.getAllOrders);
        /**
         *  get all orders by status
         */
        this.routers.get('/get/all/:status', this.orderControllers.getAllOrdersByStatus);
        // get all orders by status or date range
        this.routers.get('/get/all/date-range/:status', this.orderControllers.getAllOrdersByStatusOrDateRange);
        /**
         *  get a order
         */
        this.routers.get('/get/:id', this.orderControllers.getAOrder);
        // get an orders all product
        this.routers.get('/get/products/:id', this.orderControllers.getAnOrdersAllProducts);
        // Track order status
        this.routers.get('/get/:id/track/status', this.orderControllers.getOrderStatusTrack);
        /**
         *  update order status
         */
        this.routers.put('/update/:id', this.orderControllers.updateOrderStatus);
    }
}
exports.default = OrderRouters;
//# sourceMappingURL=orderRouters.js.map