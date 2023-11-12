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
class clientSideServices extends abstractServices_1.default {
    constructor() {
        super();
        // send contact msg service
        this.sendContactMsg = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query.insert('contact_message', req.body);
            if (data.insertId) {
                const msg = yield this.query.select({
                    table: 'contact_message',
                    fields: { columns: ['status', 'msg_date'] },
                    where: { table: 'contact_message', field: 'id', value: data.insertId },
                });
                return {
                    success: true,
                    message: 'Message send successfully!',
                    id: data.insertId,
                    msg_date: msg[0].msg_date,
                    status: msg[0].status,
                };
            }
            else {
                return {
                    success: false,
                    message: "Message couldn't send. Something is wrong",
                };
            }
        });
        // get all contact msg service
        this.getAllContactMsg = () => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query.select({
                table: 'contact_message',
                fields: {
                    columns: ['id', 'name', 'status', 'message', 'note', 'msg_date'],
                },
                orderBy: { table: 'contact_message', field: 'id' },
                desc: true,
            });
            if (data.length) {
                return { success: true, data };
            }
            else {
                return { success: false };
            }
        });
        // get a single contact msg service
        this.getSingleContactMsg = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.query.select({
                table: 'contact_message',
                fields: {
                    columns: [
                        'id',
                        'name',
                        'status',
                        'email',
                        'phone',
                        'message',
                        'note',
                        'msg_date',
                    ],
                },
                where: { table: 'contact_message', field: 'id', value: id },
            });
            if (data.length) {
                return { success: true, data: data[0] };
            }
            else {
                return { success: false };
            }
        });
        // update singel contact msg service
        this.updateSingleContactMsg = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.query.update({
                table: 'contact_message',
                data: req.body,
                where: { id },
            });
            if (data.affectedRows) {
                return { success: true, msg: 'Contact msg updated successfully' };
            }
            else {
                return { success: false };
            }
        });
    }
}
exports.default = clientSideServices;
//# sourceMappingURL=clientSideServices.js.map