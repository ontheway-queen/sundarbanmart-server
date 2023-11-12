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
const abstractServices_1 = __importDefault(require("../../abstracts/abstractServices"));
const customError_1 = __importDefault(require("../../common/utils/errors/customError"));
class CommonServices extends abstractServices_1.default {
    constructor() {
        super();
    }
    /**
     * updateDp
     */
    updateDp(table, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { filename } = req.file || {};
            if (filename) {
                return yield this.transaction.beginTransaction((query) => __awaiter(this, void 0, void 0, function* () {
                    const qInfo = yield query.select({
                        table,
                        fields: { columns: ['photo', 'status'] },
                        where: { table, field: 'id', value: id },
                    });
                    if (qInfo.length < 1) {
                        throw new customError_1.default('Please provide a valid ID to update photo', 400, 'Bad request');
                    }
                    const { photo, status } = qInfo[0];
                    yield query.update({
                        table,
                        data: { photo: filename },
                        where: { id },
                    });
                    if (status === 'Approved') {
                        yield query.update({
                            table: 'queens',
                            data: { photo: filename },
                            where: { admin_queens_id: id },
                        });
                    }
                    const folder = table === 'admin_queens'
                        ? 'queens'
                        : table === 'trainer'
                            ? 'trainer'
                            : '';
                    if (!folder) {
                        throw new customError_1.default('Please select a valid table to update photo e.g.(admin_queens or trainer)', 500, 'Internal server error');
                    }
                    // if (table === 'admin_queens') {
                    //   await this.outServiceShare.updateSellerInfo(id, { photo: filename });
                    // }
                    this.deleteFile.delete(folder, photo);
                    return {
                        success: true,
                        message: 'successfully updated dp',
                        data: filename,
                    };
                }));
            }
            else {
                throw new customError_1.default('Please provide an image to update', 400, 'Bad request');
            }
        });
    }
    /**
     * updateNids
     */
    updateNids(table, req) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const files = req.files || [];
            const nid_front = ((_a = files[0]) === null || _a === void 0 ? void 0 : _a.fieldname) === 'nid_front'
                ? files[0].filename
                : ((_b = files[1]) === null || _b === void 0 ? void 0 : _b.fieldname) === 'nid_front'
                    ? (_c = files[1]) === null || _c === void 0 ? void 0 : _c.filename
                    : null;
            const nid_back = ((_d = files[0]) === null || _d === void 0 ? void 0 : _d.fieldname) === 'nid_back'
                ? files[0].filename
                : ((_e = files[1]) === null || _e === void 0 ? void 0 : _e.fieldname) === 'nid_back'
                    ? (_f = files[1]) === null || _f === void 0 ? void 0 : _f.filename
                    : null;
            if (files.length < 2) {
                throw new customError_1.default('Must send two NID images.', 400, 'Bad request');
            }
            else if (files.length > 2) {
                throw new customError_1.default('Cannot upload more than 2 images.', 400, 'Bad request');
            }
            else if (!nid_front || !nid_back) {
                throw new customError_1.default('Fields name must be `nid_front` and `nid_back`.', 400, 'Bad request');
            }
            const folder = table === 'admin_queens'
                ? 'queens'
                : table === 'trainer'
                    ? 'trainer'
                    : table === 'fund_guaranter'
                        ? 'fund_guaranter'
                        : '';
            if (!folder) {
                throw new customError_1.default('Please select a valid table to update NId e.g.(admin_queens or trainer)', 500, 'Internal server error');
            }
            return yield this.transaction.beginTransaction((query) => __awaiter(this, void 0, void 0, function* () {
                const nids = yield query.select({
                    table,
                    fields: { columns: ['nid_front', 'nid_back'] },
                    where: { table, field: 'id', value: id },
                });
                if (nids.length >= 1) {
                    const nidFront = nids[0].nid_front;
                    const nidBack = nids[0].nid_back;
                    this.deleteFile.delete('nids', nidFront);
                    this.deleteFile.delete('nids', nidBack);
                }
                const data = yield query.update({
                    table,
                    data: { nid_back, nid_front },
                    where: { id },
                });
                if (data.affectedRows && data.changedRows) {
                    return {
                        success: true,
                        message: 'NID update successful',
                        data: { nid_front, nid_back },
                    };
                }
                else {
                    return {
                        success: false,
                        message: 'Cannot update nids, Please check if you are providing valid ID',
                        status: 400,
                    };
                }
            }));
        });
    }
    // check phone for reg
    checkPhoneForReg(phone, table) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query.select({
                table,
                fields: { columns: ['id', 'status'] },
                where: { table, field: 'phone', value: phone },
            });
            if (data.length) {
                return {
                    success: false,
                    message: 'User already exist with this phone',
                };
            }
            else {
                return {
                    success: true,
                    message: 'No user found with this id',
                };
            }
        });
    }
}
exports.default = CommonServices;
//# sourceMappingURL=commonServices.js.map