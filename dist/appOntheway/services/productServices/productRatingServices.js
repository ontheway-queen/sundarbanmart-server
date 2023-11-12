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
class productRatingServices extends abstractServices_1.default {
    constructor() {
        super();
    }
    // add a product rating service
    addProductRating(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqFiles = req.files;
            const rating_pic1 = reqFiles[0] && reqFiles[0].filename;
            const rating_pic2 = reqFiles[1] && reqFiles[1].filename;
            const rating_pic3 = reqFiles[2] && reqFiles[2].filename;
            const ratingData = Object.assign(Object.assign({}, req.body), { rating_pic1, rating_pic2, rating_pic3 });
            const check = yield this.query.select({
                table: 'rating',
                fields: { columns: ['id'] },
                where: {
                    and: [
                        { table: 'rating', field: 'product', value: ratingData.product },
                        { table: 'rating', field: 'rater', value: ratingData.rater },
                    ],
                },
            });
            if (check.length) {
                return {
                    success: false,
                    msg: 'User Already added review to this product',
                };
            }
            else {
                yield this.query.insert('rating', ratingData);
                return { success: true, msg: 'Review added successfully' };
            }
        });
    }
    // get a single product all rating/review details
    getProductRatings(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { product } = req.params;
            const { skip, limit } = req.query;
            const ratings = yield this.query.select({
                table: 'rating',
                fields: {
                    columns: [
                        'id',
                        'comment',
                        'rating',
                        'rating_pic1',
                        'rating_pic2',
                        'rating_pic3',
                        'createdAt',
                    ],
                    otherFields: [
                        {
                            table: 'customers',
                            as: [['name', 'rater_name']],
                        },
                    ],
                },
                limit: { limit: limit, skip: Number(skip) || 0 },
                where: { table: 'rating', field: 'product', value: product },
                join: [
                    {
                        join: { table: 'customers', field: 'id' },
                        on: { table: 'rating', field: 'rater' },
                    },
                ],
                orderBy: { table: 'rating', field: 'createdAt' },
                desc: true,
            });
            const sql = `select count(rating.id) as total from ngf_ecommerce.rating where rating.product =  ?`;
            const total = yield this.query.rawQuery(sql, [product]);
            return {
                success: true,
                total: total[0].total,
                data: ratings,
            };
            return { success: true, data: ratings };
        });
    }
    // get a customer all rating/review details
    getCustomerRatings(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rater } = req.params;
            const ratings = yield this.query.select({
                table: 'rating',
                fields: {
                    columns: [
                        'id',
                        'comment',
                        'rating',
                        'rating_pic1',
                        'rating_pic2',
                        'rating_pic3',
                    ],
                    as: [['createdAt', 'date']],
                    otherFields: [
                        {
                            table: 'admin_products',
                            as: [
                                ['id', 'product_id'],
                                ['product_name', 'product'],
                            ],
                        },
                    ],
                },
                where: { table: 'rating', field: 'rater', value: rater },
                join: [
                    {
                        join: { table: 'admin_products', field: 'id' },
                        on: { table: 'rating', field: 'product' },
                    },
                ],
            });
            return { success: true, data: ratings };
        });
    }
    // delete a rating/review service
    deleteRating(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rating } = req.params;
            const result = yield this.query.delete({
                table: 'rating',
                where: { id: rating },
            });
            if (result.affectedRows) {
                return { success: true, msg: 'Reting deleted successfully' };
            }
            else {
                return { success: false, msg: 'Wrong rating id!' };
            }
        });
    }
    // check rating of a customer and product
    checkRatingOfCustomer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { product, customer } = req.params;
            const result = yield this.query.select({
                table: 'rating',
                fields: {
                    columns: ['id'],
                },
                where: {
                    and: [
                        { table: 'rating', field: 'rater', value: customer },
                        { table: 'rating', field: 'product', value: product },
                    ],
                },
            });
            if (result.length) {
                return { success: true, rating: true };
            }
            else {
                return { success: true, rating: false };
            }
        });
    }
}
exports.default = productRatingServices;
//# sourceMappingURL=productRatingServices.js.map