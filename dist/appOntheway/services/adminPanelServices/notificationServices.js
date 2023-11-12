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
class notificationServices extends abstractServices_1.default {
    constructor() {
        super();
        //post or update a notification
        this.postNotification = (type, body) => __awaiter(this, void 0, void 0, function* () {
            if (type.startsWith('new')) {
                const item = yield this.query.select({
                    table: 'notifications',
                    fields: { columns: ['id', 'status', 'count'] },
                    where: { table: 'notifications', field: 'type', value: `'${type}'` },
                });
                if (item.length) {
                    let updated;
                    if (item[0].status === 'unread') {
                        updated = yield this.query.update({
                            table: 'notifications',
                            data: { count: item[0].count + 1 },
                            where: { id: item[0].id },
                        });
                    }
                    else {
                        updated = yield this.query.update({
                            table: 'notifications',
                            data: { status: 'unread', count: 1 },
                            where: { id: item[0].id },
                        });
                    }
                    const notification = yield this.query.select({
                        table: 'notifications',
                        fields: {
                            columns: ['id', 'count', 'type', 'msg', 'status', 'update_id'],
                            as: [['date', 'time']],
                        },
                        where: { table: 'notifications', field: 'id', value: item[0].id },
                    });
                    return notification[0];
                }
                else {
                    const data = yield this.query.insert('notifications', Object.assign(Object.assign({}, body), { type, count: 1 }));
                    const notification = yield this.query.select({
                        table: 'notifications',
                        fields: {
                            columns: ['id', 'count', 'type', 'msg', 'status', 'update_id'],
                            as: [['date', 'time']],
                        },
                        where: { table: 'notifications', field: 'id', value: data.insertId },
                    });
                    return notification[0];
                }
            }
            else {
                const updated = yield this.query.select({
                    table: 'notifications',
                    fields: { columns: ['id'] },
                    where: {
                        table: 'notifications',
                        field: 'update_id',
                        value: body.update_id,
                    },
                });
                if (updated.length) {
                    yield this.query.update({
                        table: 'notifications',
                        data: { status: 'unread', msg: body.msg },
                        where: { id: updated[0].id },
                    });
                }
                else {
                    yield this.query.insert('notifications', Object.assign(Object.assign({}, body), { type }));
                }
                const notification = yield this.query.select({
                    table: 'notifications',
                    fields: {
                        columns: ['id', 'count', 'type', 'msg', 'status', 'update_id'],
                        as: [['date', 'time']],
                    },
                    where: {
                        table: 'notifications',
                        field: 'update_id',
                        value: body.update_id,
                    },
                });
                return notification[0];
            }
        });
        // get all notifications
        this.getAllNotification = () => __awaiter(this, void 0, void 0, function* () {
            const notifications = yield this.query.select({
                table: 'notifications',
                fields: {
                    columns: ['id', 'count', 'type', 'msg', 'status', 'update_id'],
                    as: [['date', 'time']],
                },
                orderBy: { table: 'notifications', field: 'date' },
                desc: true,
            });
            return { success: true, data: notifications };
        });
        // read notification
        this.readNotification = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            const result = yield this.query.update({
                table: 'notifications',
                data: { status: 'read' },
                where: { id },
            });
            if (result.affectedRows) {
                return { success: true, msg: 'Notification read successfully' };
            }
            else {
                return { success: false };
            }
        });
        // delete all notification
        this.clearNotifications = () => __awaiter(this, void 0, void 0, function* () {
            const sql = `DELETE FROM ngf_ecommerce.notifications`;
            const result = (yield this.query.rawQuery(sql));
            if (result.affectedRows) {
                return { success: true, msg: 'Notifications clear successfully' };
            }
            else {
                return { success: false };
            }
        });
    }
}
exports.default = notificationServices;
//# sourceMappingURL=notificationServices.js.map