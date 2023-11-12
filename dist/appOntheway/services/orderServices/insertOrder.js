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
const abstractServices_1 = __importDefault(require("../../../abstracts/abstractServices"));
class OrderDetails extends abstractServices_1.default {
    constructor() {
        super();
    }
    /**
     * insert
     */
    insert(query, order, order_details) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield query.insert('orders', order);
            const fileds = [
                'order_id',
                'product_name',
                'product_category',
                'product_id',
                'price',
                'quantity',
                'queen_id',
                'delivery_date',
            ];
            const values = [];
            for (let i = 0; i < order_details.length; i++) {
                const element = order_details[i];
                values.push([
                    data.insertId,
                    element.product_name,
                    element.product_category,
                    element.product_id,
                    element.price,
                    element.quantity,
                    element.queen_id,
                    element.delivery_date,
                ]);
            }
            yield query.multipleInsert('order_details', fileds, values);
            return { success: true, orderId: data.insertId };
        });
    }
}
exports.default = OrderDetails;
//# sourceMappingURL=insertOrder.js.map