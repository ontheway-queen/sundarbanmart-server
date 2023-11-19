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
const socket_1 = require("../../../common/socket/socket");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../common/config/config"));
const abstractController_1 = __importDefault(require("../../../abstracts/abstractController"));
const authServices_1 = __importDefault(require("../../services/authServices/authServices"));
const notificationServices_1 = __importDefault(require("../../services/adminPanelServices/notificationServices"));
class AuthControllers extends abstractController_1.default {
    constructor() {
        super();
        this.authServices = new authServices_1.default();
        this.maxAge = 1000 * 60 * 60 * 24 * 30;
        this.notificationServices = new notificationServices_1.default();
        /**
         * register user
         */
        this.register = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.body.password.length > 5 && req.body.phone.length >= 10) {
                const { filename } = (req.file || {});
                const _a = req.body, { token } = _a, rest = __rest(_a, ["token"]);
                const body = filename ? Object.assign(Object.assign({}, rest), { photo: filename }) : rest;
                const data = yield this.authServices.register(body);
                if (data.success) {
                    res.status(200).json({ success: true, data: data.user });
                    const notification = yield this.notificationServices.postNotification('new-queen', {
                        msg: 'New ME Registered',
                    });
                    socket_1.io.emit('new_notification', notification);
                    socket_1.io.emit('new_queen', data.user);
                }
                else {
                    res.status(400).json(data);
                }
            }
            else {
                res
                    .status(422)
                    .json({ success: false, msg: 'Enter valid phone or password' });
            }
        }));
        /**
         * login a user
         */
        this.login = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { user } = req.params;
            const table = user === 'queen' ? 'admin_queens' : 'customers';
            const data = yield this.authServices.login(table, req.body);
            const cookieName = table === 'admin_queens' ? 'qa_otw' : 'ca_otw';
            if (data.success) {
                // req.andro
                //   ? res.set(cookieName, data.token)
                //   : res.cookie(cookieName, data.token, {
                //       httpOnly: true,
                //       signed: true,
                //     });
                res
                    .status(200)
                    .json({ success: true, data: data.user, token: data.token });
            }
            else {
                res.status(400).json(data);
            }
        }));
        /**
         * forget password
         */
        this.forgetPassword = this.assyncWrapper.wrap((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { user } = req.params;
            const { token, password, phone } = req.body;
            const verified = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
            if (verified) {
                const data = yield this.authServices.forgetPassword(user, password, phone);
                if (data.success) {
                    res.status(200).json({ success: true, message: data.message });
                }
                else {
                    this.error();
                }
            }
        }));
    }
}
exports.default = AuthControllers;
//# sourceMappingURL=authControllers.js.map