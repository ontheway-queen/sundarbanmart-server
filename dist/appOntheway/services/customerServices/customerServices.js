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
const abstractServices_1 = __importDefault(require("../../../abstracts/abstractServices"));
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
const lib_1 = __importDefault(require("../../../common/utils/libraries/lib"));
class CustomerServices extends abstractServices_1.default {
    constructor() {
        super();
    }
    /**
     * registerCustomer
     */
    register(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, phone, password: bodyPass, address } = body;
            return yield this.transaction.beginTransaction((query) => __awaiter(this, void 0, void 0, function* () {
                const user = yield query.select({
                    table: 'customers',
                    fields: { columns: ['phone', 'photo', 'id'] },
                    where: { table: 'customers', field: 'phone', value: phone },
                });
                const hashedPass = yield lib_1.default.hashPass(bodyPass);
                let data;
                if (user.length) {
                    yield query.update({
                        table: 'customers',
                        data: Object.assign(Object.assign({}, body), { guest: 0, password: hashedPass }),
                        where: { id: user[0].id },
                    });
                }
                else {
                    data = yield query.insert('customers', Object.assign(Object.assign({}, body), { guest: 0, password: hashedPass }));
                }
                const { password } = body, rest = __rest(body, ["password"]);
                const tokenCreds = { name, phone, address };
                const token = lib_1.default.createToken(tokenCreds, lib_1.default.maxAge);
                return {
                    success: true,
                    user: Object.assign(Object.assign({}, rest), { id: (data === null || data === void 0 ? void 0 : data.insertId) || user[0].id }),
                    token,
                };
            }));
        });
    }
    /**
     * getAllCustomers
     */
    getAllCustomers(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const data = yield this.query.select({
                table: 'customers',
                fields: { columns: ['id', 'name', 'photo', 'phone', 'address'] },
                limit: { limit: limit, skip: skip },
            });
            const forCount = 'SELECT count(ngf_ecommerce.customers.id) as total FROM ngf_ecommerce.customers';
            const total = (yield this.query.rawQuery(forCount));
            console.log({ total });
            return { success: true, data: data, total: total[0].total };
        });
    }
    /**
     * getACustomer
     */
    getACustomer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { phone } = req.params;
            const finder = id ? ['id', id] : ['phone', phone];
            const columns = [
                'id',
                'name',
                'phone',
                'address',
                'email',
                'post_code',
                'photo',
                'city',
                'guest',
            ];
            const data = yield this.query.select({
                table: 'customers',
                fields: { columns },
                where: { table: 'customers', field: finder[0], value: finder[1] },
            });
            if (data.length) {
                return { success: true, data: data[0] };
            }
            else {
                return {
                    success: false,
                    message: 'No data found with this Phone',
                };
            }
        });
    }
    /**
     * updateCustomerInfo
     */
    updateCustomerInfo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { filename } = req.file || {};
            return yield this.transaction.beginTransaction((query) => __awaiter(this, void 0, void 0, function* () {
                const data = yield query.select({
                    table: 'customers',
                    fields: { columns: ['phone', 'photo'] },
                    where: { table: 'customers', field: 'id', value: id },
                });
                if (data.length < 1) {
                    filename && this.deleteFile.delete('customers', filename);
                    throw new customError_1.default('Use does not exist!!', 400, 'Bad request');
                }
                else {
                    const updateData = filename
                        ? Object.assign(Object.assign({}, req.body), { photo: filename }) : req.body;
                    yield query.update({
                        table: 'customers',
                        data: updateData,
                        where: { id },
                    });
                    const oldPhoto = data[0].photo;
                    let buyerBody = {};
                    if (req.body.name) {
                        buyerBody = Object.assign(Object.assign({}, buyerBody), { name: req.body.name });
                    }
                    if (filename) {
                        buyerBody = Object.assign(Object.assign({}, buyerBody), { photo: filename });
                    }
                    if (req.body.city) {
                        buyerBody = Object.assign(Object.assign({}, buyerBody), { city: req.body.city });
                    }
                    if (req.body.email) {
                        buyerBody = Object.assign(Object.assign({}, buyerBody), { email: req.body.email });
                    }
                    oldPhoto && this.deleteFile.delete('customers', oldPhoto);
                }
                return {
                    success: true,
                    data: {
                        photo: filename,
                        message: 'User successfully updated',
                    },
                };
            }));
        });
    }
}
exports.default = CustomerServices;
//# sourceMappingURL=customerServices.js.map