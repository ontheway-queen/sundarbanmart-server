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
class queenOffersServices extends abstractServices_1.default {
    constructor() {
        super();
    }
    // create a queens offer
    createQueensOffer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            const res = yield this.query.insert('queens_offer', Object.assign(Object.assign({}, req.body), { banner: file.filename }));
            if (res.insertId) {
                return {
                    success: true,
                    message: 'Offer created successfully!',
                    data: { id: res.insertId },
                };
            }
            else {
                return { success: false, message: 'Cannot create offer now' };
            }
        });
    }
    // update a queens offer
    updateQueensOffer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            const body = req.body;
            console.log({ body, file });
            const { id } = req.params;
            const table = 'queens_offer';
            const check = yield this.query.select({
                table,
                fields: { columns: ['banner', 'status'] },
                where: { table, field: 'id', value: id },
            });
            if (file) {
                body.banner = file.filename;
            }
            const res = yield this.query.update({
                table: 'queens_offer',
                data: body,
                where: { id },
            });
            if (res.affectedRows) {
                if (file && check[0].banner) {
                    yield this.deleteFile.delete('queens_offer', check[0].banner);
                }
                return {
                    success: true,
                    message: 'Queen offer updated successfully',
                    data: { banner: body.banner },
                };
            }
            else {
                return { success: false, message: 'cannot update this offer now!' };
            }
        });
    }
    // get all queens offer
    getAllQueensOffer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const data = yield this.query.select({
                table: 'queens_offer',
                fields: {
                    columns: [
                        'id',
                        'title',
                        'details',
                        'banner',
                        'created_date',
                        'end_date',
                        'status',
                    ],
                },
                limit: { skip: skip, limit: limit },
                orderBy: { table: 'queens_offer', field: 'end_date' },
                desc: true,
            });
            const forCount = 'SELECT count(ngf_ecommerce.queens_offer.id) as total FROM ngf_ecommerce.queens_offer';
            const count = (yield this.query.rawQuery(forCount));
            return { success: true, total: count[0].total, data };
        });
    }
    // get all queens offer by status
    getAllQueensOfferByStatus(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const { status } = req.params;
            const table = 'queens_offer';
            const data = yield this.query.select({
                table,
                fields: {
                    columns: [
                        'id',
                        'title',
                        'details',
                        'banner',
                        'created_date',
                        'end_date',
                        'status',
                    ],
                },
                where: { table, field: 'status', value: `'${status}'` },
                limit: { skip: skip, limit: limit },
                orderBy: { table, field: 'end_date' },
                desc: true,
            });
            const forCount = 'SELECT count(ngf_ecommerce.queens_offer.id) as total FROM ngf_ecommerce.queens_offer where queens_offer.status = ?';
            const count = (yield this.query.rawQuery(forCount, [
                status,
            ]));
            return {
                success: true,
                total: count[0].total,
                data,
            };
        });
    }
    // get a single queens offer
    getASingleQueensOffer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { offer_id } = req.params;
            const table = 'queens_offer';
            const data = yield this.query.select({
                table,
                fields: {
                    columns: [
                        'id',
                        'title',
                        'details',
                        'banner',
                        'created_date',
                        'end_date',
                        'status',
                    ],
                },
                where: { table, field: 'id', value: offer_id },
            });
            if (data.length) {
                return {
                    success: true,
                    data: data[0],
                };
            }
            else {
                return {
                    success: true,
                    message: 'Cannot find any queens offer with this id',
                };
            }
        });
    }
    // queen get an queens offer
    queenGetAnOffer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { offer_id, queen_id } = req.body;
            const offerTable = 'queens_offer';
            const queenGettingOfferTable = 'queens_getting_offer';
            const checkOffer = yield this.query.select({
                table: offerTable,
                fields: { columns: ['id', 'status'] },
                where: { table: offerTable, field: 'id', value: offer_id },
            });
            if (checkOffer[0].status !== 'Active') {
                return {
                    success: false,
                    message: 'This offer is expired!',
                };
            }
            const checkQueenGettingOffer = yield this.query.select({
                table: queenGettingOfferTable,
                fields: { columns: ['id', 'status'] },
                where: {
                    and: [
                        { table: queenGettingOfferTable, field: 'offer_id', value: offer_id },
                        { table: queenGettingOfferTable, field: 'queen_id', value: queen_id },
                    ],
                },
            });
            if (checkQueenGettingOffer.length) {
                return {
                    success: false,
                    message: 'You already get this offer!',
                };
            }
            const res = yield this.query.insert('queens_getting_offer', {
                offer_id,
                queen_id,
            });
            if (res.insertId) {
                return {
                    success: true,
                    message: 'Offer get successfully',
                    data: { id: res.insertId },
                };
            }
            else {
                return {
                    success: false,
                    message: 'Cannot get offer now!',
                };
            }
        });
    }
    // update a get offer by queen
    updateQueensGettingOffer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { offer_id, queen_id, status } = req.body;
            const table = 'queens_getting_offer';
            const res = yield this.query.update({
                table,
                data: { status },
                and: [
                    { table, field: 'offer_id', value: offer_id },
                    { table, field: 'queen_id', value: queen_id },
                ],
            });
            if (res.affectedRows) {
                return {
                    success: true,
                    message: 'Getting offer updated successfully',
                };
            }
            else {
                return {
                    success: false,
                    message: 'Cannot update this getting offer now',
                };
            }
        });
    }
    // get an offers getting all queens
    offersAllGettingQueen(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { offer_id } = req.params;
            const data = yield this.query.select({
                table: 'queens_getting_offer',
                fields: {
                    columns: ['id', 'getting_date', 'status'],
                    otherFields: [
                        {
                            table: 'admin_queens',
                            as: [
                                ['id', 'queen_id'],
                                ['name', 'queen_name'],
                                ['photo', 'queen_photo'],
                            ],
                        },
                    ],
                },
                join: [
                    {
                        join: { table: 'admin_queens', field: 'id' },
                        on: { table: 'queens_getting_offer', field: 'queen_id' },
                    },
                ],
                where: {
                    table: 'queens_getting_offer',
                    field: 'offer_id',
                    value: offer_id,
                },
            });
            return {
                success: true,
                data,
            };
        });
    }
    // get a queens getting all offer
    queensGettingAllOffers(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { queen_id } = req.params;
            const data = yield this.query.select({
                table: 'queens_getting_offer',
                fields: {
                    columns: ['id', 'getting_date', 'status'],
                    otherFields: [
                        {
                            table: 'queens_offer',
                            as: [
                                ['id', 'offer_id'],
                                ['title', 'title'],
                                ['banner', 'banner'],
                                ['status', 'offer_status'],
                                ['end_date', 'offer_end_date'],
                            ],
                        },
                    ],
                },
                join: [
                    {
                        join: { table: 'queens_offer', field: 'id' },
                        on: { table: 'queens_getting_offer', field: 'offer_id' },
                    },
                ],
                where: {
                    table: 'queens_getting_offer',
                    field: 'queen_id',
                    value: queen_id,
                },
            });
            return {
                success: true,
                data,
            };
        });
    }
}
exports.default = queenOffersServices;
//# sourceMappingURL=queenOffersServices.js.map