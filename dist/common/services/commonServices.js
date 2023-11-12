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
const axios_1 = __importDefault(require("axios"));
const abstractServices_1 = __importDefault(require("../../abstracts/abstractServices"));
const lib_1 = __importDefault(require("../utils/libraries/lib"));
class commonServices extends abstractServices_1.default {
    // change password
    ChangePassword(table, password, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPass = yield lib_1.default.hashPass(password);
            const result = yield this.query.update({
                table,
                data: { password: hashedPass },
                where: { phone },
            });
            if (result.affectedRows) {
                return { success: true, message: 'Password successfully updated' };
            }
            else {
                return { success: false, message: 'Cannot change password now' };
            }
        });
    }
    // extrernal service for ATAB
    // atab payment success
    atabPaymentSuccess(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { link, type } = req.query;
            try {
                const res = yield axios_1.default.post('https://atab.services/api/atab/common/ssl/payment/success', Object.assign(Object.assign({}, body), { type }));
                console.log({ res });
            }
            catch (err) {
                console.log({ err });
            }
            return {
                success: true,
                data: link,
            };
        });
    }
    // atab payment failed
    atabPaymentFailed(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { link, type } = req.query;
            return {
                data: link,
            };
        });
    }
    // atab payment cancelled
    atabPaymentCancelled(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { link, type } = req.query;
            return {
                data: link,
            };
        });
    }
    // create video app test
    createVideoAppTest(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { caption } = req.body;
            const files = req.files || [];
            if (!files.length) {
                return {
                    success: false,
                    message: 'Must put video',
                };
            }
            const body = {
                caption,
                video_url: `https://hajjmanagment.online/get/video/others/${files[0].filename}`,
            };
            const data = yield this.query.insert('test_videos', body);
            if (data.insertId) {
                return {
                    success: true,
                    data: Object.assign(Object.assign({}, body), { id: data.insertId }),
                };
            }
            else {
                return {
                    success: false,
                    message: 'Cannot create video',
                };
            }
        });
    }
    // get all video app test
    getAllAppVideos() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query.select({
                table: 'test_videos',
                fields: { columns: ['id', 'caption', 'video_url', 'created_at'] },
            });
            return {
                success: true,
                data,
            };
        });
    }
}
exports.default = commonServices;
//# sourceMappingURL=commonServices.js.map