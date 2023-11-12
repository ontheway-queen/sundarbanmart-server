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
const queries_1 = __importDefault(require("../../../common/dataAccess/queries"));
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
const sendOtp_1 = __importDefault(require("./sendOtp"));
const otwDb_1 = require("../../../otwDb");
class GenOtp {
    constructor(obj) {
        this.phone = obj.phone;
        this.user = obj.user;
        this.type = obj.type;
    }
    /**
     * Generate OTP
     */
    genOtp() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = otwDb_1.dbCon.getPool();
            const conn = yield pool.promise().getConnection();
            const sendObj = {
                conn,
                phone: this.phone,
                type: this.type,
            };
            const query = new queries_1.default(conn);
            const { sendOtp } = new sendOtp_1.default(sendObj);
            const table = this.user === 'customer'
                ? 'customers'
                : this.user === 'queen'
                    ? 'admin_queens'
                    : this.user === 'seller'
                        ? 'freelancing_seller'
                        : this.user === 'social'
                            ? 'social_users'
                            : this.user === 'trainee'
                                ? 'training_trainee'
                                : this.user === 'trainer'
                                    ? 'training_trainer'
                                    : this.user === 'buyer'
                                        ? 'freelancing_buyer'
                                        : '';
            if (table === '' && this.type === 'forget') {
                throw new customError_1.default('Please insert valid user, i.e (customer, queen, seller,buyer, social, trainee or trainer).', 400, 'Invalid user!');
            }
            else if (this.type === 'forget') {
                const fields = table === 'customers' ? ['id', 'guest'] : ['id'];
                const data = yield query.select({
                    table,
                    fields: { columns: fields },
                    where: { table, field: 'phone', value: this.phone },
                });
                const { guest } = data[0] || {};
                if (data.length < 1 || guest === 1) {
                    throw new customError_1.default('No account found with this phone number', 500, 'Invalid phone');
                }
                else {
                    return yield sendOtp();
                }
            }
            else {
                // if the type is not forget then just send the otp
                return yield sendOtp();
            }
        });
    }
}
exports.default = GenOtp;
//# sourceMappingURL=genOtp.js.map