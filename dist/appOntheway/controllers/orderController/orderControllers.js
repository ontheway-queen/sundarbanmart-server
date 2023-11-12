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
const lib_1 = __importDefault(require("../../../common/utils/libraries/lib"));
const abstractController_1 = __importDefault(require("../../../abstracts/abstractController"));
const notificationServices_1 = __importDefault(require("../../services/adminPanelServices/notificationServices"));
const orderServices_1 = __importDefault(require("../../services/orderServices/orderServices"));
class OrderControllers extends abstractController_1.default {
    constructor() {
        super();
        this.orderServices = new orderServices_1.default();
        this.notificationServices = new notificationServices_1.default();
        /**
         * createOrder
         */
        this.createOrder = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const data = yield this.orderServices.createOrder(req);
            const customerNumber = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.guest_info) === null || _b === void 0 ? void 0 : _b.phone;
            if (data.success) {
                res.status(200).json({
                    success: true,
                    message: data.message,
                    order_id: data.data.id,
                });
                const notification = yield this.notificationServices.postNotification('new-order', { msg: 'New Order Placed' });
                const orderComplete = `Your order has been placed.\nYour order id is OTW-O${data.data.id}.\nWe will call you as soon as possible for order confirmation! Thank you.\nonthe-way.com`;
                if (customerNumber) {
                    lib_1.default.sendSms(customerNumber, orderComplete);
                }
                socket_1.io.emit('new_notification', notification);
                socket_1.io.emit('new_order', data);
            }
            else {
                this.error();
            }
        }));
        /**
         * getAQueensAllOrder
         */
        this.getAQueensAllOrders = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.orderServices.getAQueensAllOrders(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        /**
         * getAQueensAllOrder by status
         */
        this.getAQueensAllOrderByStatus = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.orderServices.getAQueensAllOrderByStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        /**
         * getACustomersAllOrders
         */
        this.getACustomersAllOrders = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.orderServices.getACustomersAllOrders(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        /**
         * getAllOrders
         */
        this.getAllOrders = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.orderServices.getAllOrders(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        /**
         * getAllOrders by status
         */
        this.getAllOrdersByStatus = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.orderServices.getAllOrdersByStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        /**
         * getAllOrders by status or date range
         */
        this.getAllOrdersByStatusOrDateRange = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.orderServices.getAllOrdersByStatusOrDate(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        /**
         * getAOrder
         */
        this.getAOrder = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.orderServices.getAOrder(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        /**
         * get an products all products
         */
        this.getAnOrdersAllProducts = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.orderServices.getAnOrdersAllProducts(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                res.status(404).json(data);
            }
        }));
        // get an order status for track
        this.getOrderStatusTrack = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.orderServices.getOrderStatusTrack(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Invalid order id or phone');
            }
        }));
        /**
         * updateOrderStatus
         */
        this.updateOrderStatus = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.orderServices.updateOrderStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = OrderControllers;
//# sourceMappingURL=orderControllers.js.map