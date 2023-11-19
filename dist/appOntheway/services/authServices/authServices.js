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
const lib_1 = __importDefault(require("../../../common/utils/libraries/lib"));
// AUTHENTICATION CLASS
class AuthServices extends abstractServices_1.default {
    constructor() {
        super();
    }
    // Register service
    register(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, phone, password: bodyPass, address, reference_id } = body;
            const user = yield this.query.select({
                table: 'admin_queens',
                fields: { columns: ['id'] },
                where: { table: 'admin_queens', field: 'phone', value: phone },
            });
            if (user.length) {
                return { success: false, msg: 'Already register with this number!' };
            }
            if (reference_id) {
                const refCheck = yield this.query.select({
                    table: 'admin_queens',
                    fields: { columns: ['id'] },
                    where: { table: 'admin_queens', field: 'id', value: reference_id },
                });
                if (!refCheck.length) {
                    return {
                        success: false,
                        msg: 'Invalid ME reference id!',
                    };
                }
            }
            const hashedPass = yield lib_1.default.hashPass(bodyPass);
            const data = yield this.query.insert('admin_queens', Object.assign(Object.assign({}, body), { password: hashedPass }));
            const { password } = body, rest = __rest(body, ["password"]);
            const tokenCreds = { name, phone, address };
            const token = lib_1.default.createToken(tokenCreds, lib_1.default.maxAge);
            return {
                success: true,
                user: Object.assign(Object.assign({}, rest), { id: data.insertId, status: 'Pending', social_user: 0, trainee: 0, seller: 0 }),
                token,
            };
        });
    }
    // Login service
    login(table, creds) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone, password } = creds;
            // console.log({ creds });
            const fields = [
                'id',
                'name',
                'phone',
                'password',
                'photo',
                'email',
                'address',
                'city',
                'post_code',
            ];
            if (table === 'admin_queens') {
                fields.push('nid_front');
                fields.push('nid_back');
                fields.push('status');
                fields.push('division');
                fields.push('seller');
                fields.push('social_user');
                fields.push('trainee');
            }
            const user = yield this.query.select({
                table,
                fields: { columns: fields },
                where: { table, field: 'phone', value: phone },
            });
            if (user.length < 1) {
                return { success: false, message: 'Username or password is incorrect!!' };
            }
            const _a = user[0], { phone: userPhone, password: userPass } = _a, rest = __rest(_a, ["phone", "password"]);
            const isPassValid = yield lib_1.default.compare(password, userPass);
            if (isPassValid) {
                const tokenCreds = Object.assign({ phone: userPhone }, rest);
                const token = lib_1.default.createToken(tokenCreds, lib_1.default.maxAge);
                return { success: true, user: tokenCreds, token };
            }
            else {
                return { success: false, message: 'Username or password is incorrect!!' };
            }
        });
    }
    // forgetPassword
    forgetPassword(user, password, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPass = yield lib_1.default.hashPass(password);
            const table = user === 'queen' ? 'admin_queens' : 'customers';
            yield this.query.update({
                table,
                data: { password: hashedPass },
                where: { phone },
            });
            return { success: true, message: 'Pasword successfully updated' };
        });
    }
    // check a queen for data common
    checkQueenforData(creds) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = 'admin_queens';
            const { phone, password } = creds;
            const fields = [
                'id',
                'name',
                'phone',
                'password',
                'photo',
                'lat',
                'lng',
                'email',
                'address',
                'status',
                'city',
                'post_code',
                'nid_front',
                'nid_back',
                'seller',
            ];
            const user = yield this.query.select({
                table,
                fields: { columns: fields },
                where: { table, field: 'phone', value: phone },
            });
            if (user.length < 1) {
                return {
                    success: false,
                    message: 'Queen phone or password is incorrect!!',
                };
            }
            const { password: userPass } = user[0];
            const isPassValid = yield lib_1.default.compare(password, userPass);
            if (isPassValid) {
                return { success: true, user: user[0] };
            }
            else {
                return {
                    success: false,
                    message: 'Queen phone or password is incorrect!!',
                };
            }
        });
    }
    // check customer for data common
    checkCustomerforData(creds) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = 'customers';
            const { phone, password } = creds;
            const fields = [
                'id',
                'name',
                'phone',
                'password',
                'photo',
                'lat',
                'lng',
                'email',
                'address',
                'city',
                'post_code',
                'division',
            ];
            const user = yield this.query.select({
                table,
                fields: { columns: fields },
                where: { table, field: 'phone', value: phone },
            });
            if (user.length < 1) {
                return {
                    success: false,
                    message: 'Customers phone or password is incorrect!!',
                };
            }
            const { password: userPass } = user[0];
            const isPassValid = yield lib_1.default.compare(password, userPass);
            if (isPassValid) {
                return { success: true, user: user[0] };
            }
            else {
                return { success: false, message: 'Phone or password is incorrect!!' };
            }
        });
    }
}
exports.default = AuthServices;
//# sourceMappingURL=authServices.js.map