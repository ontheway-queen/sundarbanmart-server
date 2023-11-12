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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstractController_1 = __importDefault(require("../../../abstracts/abstractController"));
const customerServices_1 = __importDefault(require("../../services/customerServices/customerServices"));
const socket_1 = require("../../../common/socket/socket");
class CustomerControllers extends abstractController_1.default {
    constructor() {
        super();
        this.customerServices = new customerServices_1.default();
        this.maxAge = 1000 * 60 * 60 * 24 * 30;
        /**
         * registerCustomer
         */
        this.register = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            // const verified = jwt.verify(req.body.token, config.JWT_SECRET);
            // console.log({ verified });
            // if (verified) {
            const _a = req.body, { token } = _a, rest = __rest(_a, ["token"]);
            const data = yield this.customerServices.register(rest);
            if (data.success) {
                req.andro
                    ? res.set('qotw', data.token)
                    : res.cookie('qotw', data.token, {
                        httpOnly: true,
                        signed: true,
                        maxAge: this.maxAge,
                    });
                res.status(200).json({ success: true, data: data.user });
                socket_1.io.emit('new_customer', data.user);
            }
            else {
                res.status(400).json(data);
            }
            // }
        }));
        /**
         * getAllCustomers
         */
        this.getAllCustomers = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.customerServices.getAllCustomers(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        /**
         * getACustomer
         */
        this.getACustomer = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.customerServices.getACustomer(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error(data.message, 404);
            }
        }));
        /**
         * updateCustomerInfo
         */
        this.updateCustomerInfo = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.customerServices.updateCustomerInfo(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error(data.message, 400, 'Bad request');
            }
        }));
    }
}
exports.default = CustomerControllers;
//# sourceMappingURL=customerControllers.js.map