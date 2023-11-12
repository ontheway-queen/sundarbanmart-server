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
const dbAccess_1 = __importDefault(require("../dataAccess/dbAccess"));
const lib_1 = __importDefault(require("../utils/libraries/lib"));
class Queries {
    constructor(dbcon) {
        /*
        raw query
        */
        this.rawQuery = (sql, values) => __awaiter(this, void 0, void 0, function* () {
            const options = values ? { sql, values } : { sql };
            const [data] = (yield this.connection.query(options));
            return data;
        });
        /**
         * query to insert
         */
        this.insert = (table, body) => __awaiter(this, void 0, void 0, function* () {
            const sql = 'INSERT INTO ?? SET ?';
            const [data] = (yield this.connection.query({
                sql,
                values: [table, body],
            }));
            return data;
        });
        /**
         * query to insert multiple data
         */
        this.multipleInsert = (table, fields, values) => __awaiter(this, void 0, void 0, function* () {
            const sql = 'INSERT INTO ?? (??) VALUES ?';
            const [data] = (yield this.connection.query({
                sql,
                values: [table, fields, values],
            }));
            return data;
        });
        /**
         * query to select
         */
        this.select = (creds) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const asFields = [];
            const asCreds = (_a = creds.fields) === null || _a === void 0 ? void 0 : _a.as;
            if (asCreds) {
                for (let i = 0; i < asCreds.length; i++) {
                    const element = asCreds[i];
                    asFields.push(`${creds.table}.${element[0]} as ${element[1]}`);
                }
            }
            let join = '';
            if (creds.join) {
                for (let i = 0; i < creds.join.length; i++) {
                    const element = creds.join[i];
                    const joinTable = element.join.table;
                    const joinField = element.join.field;
                    const joinOnTable = element.on.table;
                    const joinOnField = element.on.field;
                    join += ` JOIN ${joinTable} ON ${joinOnTable}.${joinOnField} = ${joinTable}.${joinField}`;
                }
            }
            let where = '';
            const and = (_b = creds.where) === null || _b === void 0 ? void 0 : _b.and;
            const or = (_c = creds.where) === null || _c === void 0 ? void 0 : _c.or;
            if (creds.where) {
                if (and && or) {
                    throw new Error('Currently cannot have both AND and OR operator');
                }
                else if (and || or) {
                    where = 'WHERE';
                    if (and) {
                        for (let i = 0; i < and.length; i++) {
                            const element = and[i];
                            const andKey = and.length - 1 > i ? 'AND' : '';
                            where += ` ${element.table}.${element.field} ${element.compare || '='} ${element.value} ${andKey}`;
                        }
                    }
                    if (or) {
                        for (let i = 0; i < or.length; i++) {
                            const element = or[i];
                            const orKey = or.length - 1 > i ? 'OR' : '';
                            where += ` ${element.table}.${element.field} ${element.compare || '='} ${element.value} ${orKey}`;
                        }
                    }
                }
                else {
                    const tw = creds.where;
                    where = `WHERE ${tw.date ? `date(${tw.table}.${tw.field})` : `${tw.table}.${tw.field}`}  ${tw.compare || '='} ${tw.value}`;
                }
            }
            let fts = ((_d = creds.fields) === null || _d === void 0 ? void 0 : _d.columns)
                ? lib_1.default.fieldParser(creds.table, creds.fields.columns)
                : [];
            const otherFields = (_e = creds.fields) === null || _e === void 0 ? void 0 : _e.otherFields;
            if (otherFields && !creds.all) {
                for (let i = 0; i < otherFields.length; i++) {
                    const element = otherFields[i];
                    if (element.as && element.as.length >= 1) {
                        for (let i = 0; i < element.as.length; i++) {
                            const asEl = element.as[i];
                            asFields.push(`${element.table}.${asEl[0]} as ${asEl[1]}`);
                        }
                    }
                    if (element.columns && element.columns.length >= 1) {
                        fts.push(...lib_1.default.fieldParser(element.table, element.columns));
                    }
                }
            }
            const all = creds.all ? '*' : '';
            const special = creds.special ? creds.special + ',' : '';
            const limit = creds.limit
                ? `LIMIT ${creds.limit.skip},${creds.limit.limit}`
                : '';
            const as = asFields.length >= 1 ? `${asFields},` : '';
            const joinStr = join ? join : '';
            const orderBy = creds.orderBy
                ? `ORDER BY ${creds.orderBy.table}.${creds.orderBy.field}`
                : '';
            const groupBy = creds.groupBy
                ? `GROUP BY ${creds.groupBy.table}.${creds.groupBy.field}`
                : '';
            const asc = creds.asc ? 'ASC' : '';
            const desc = creds.desc ? 'DESC' : '';
            const sql = `SELECT ${special} ${as} ${all || '??'} FROM ?? ${joinStr} ${where} ${orderBy} ${asc} ${desc} ${groupBy} ${limit}`;
            const dts = [creds.table];
            !all && dts.unshift(fts);
            console.log({ sql, dts });
            const [data] = (yield this.connection.query({
                sql,
                values: dts,
            }));
            return data;
        });
        /**
         * select otp
         */
        this.getOtp = (obj) => __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT ?? FROM ?? WHERE phone = ? AND type = ? AND ADDTIME(create_time, '0:2:0') > NOW() AND tried < 3 AND matched = 0`;
            const [data] = (yield this.connection.query({
                sql,
                values: [obj.fields, obj.table, obj.phone, obj.type],
            }));
            console.log({ data });
            return data;
        });
        /**
         * update
         */
        this.update = (obj) => __awaiter(this, void 0, void 0, function* () {
            let where = 'UPDATE ?? SET ? WHERE ?';
            let values = [obj.table, obj.data, obj.where];
            if (obj.and) {
                where = 'UPDATE ?? SET ? WHERE ';
                for (let i = 0; i < obj.and.length; i++) {
                    const element = obj.and[i];
                    const andKey = obj.and.length - 1 > i ? 'AND' : '';
                    where += ` ${element.table}.${element.field} = ${element.value} ${andKey}`;
                }
                values = [obj.table, obj.data];
            }
            const [data] = (yield this.connection.query({
                sql: where,
                values,
            }));
            return data;
        });
        /**
         * replace
         */
        this.replace = (obj) => __awaiter(this, void 0, void 0, function* () {
            const { into, replace, select, from, where } = obj;
            console.log({ select });
            const sql = select
                ? 'REPLACE INTO ?? (??) SELECT ?? FROM ?? WHERE ?'
                : 'REPLACE INTO ?? SET ?';
            const values = select
                ? [into, replace, select, from, where]
                : [into, replace];
            const [data] = (yield this.connection.query({
                sql,
                values,
            }));
            return data;
        });
        /**
         * delete
         */
        this.delete = (obj) => __awaiter(this, void 0, void 0, function* () {
            let sql = 'DELETE FROM ?? WHERE ?';
            const and = obj.and;
            let where = '';
            if (and) {
                for (let i = 0; i < and.length; i++) {
                    const element = and[i];
                    const andKey = and.length - 1 > i ? 'AND' : '';
                    where += ` ${element.field} = ${element.value} ${andKey}`;
                }
                sql = `DELETE FROM ?? WHERE ${where}`;
            }
            const values = [obj.table, obj.and ? '' : obj.where];
            const [data] = (yield this.connection.query({
                sql,
                values,
            }));
            return data;
        });
        /**
         * cronDelete otp
         */
        this.cronDeleteOTP = () => __awaiter(this, void 0, void 0, function* () {
            const qStr = 'DELETE FROM otp WHERE create_time < DATE_SUB(NOW(), INTERVAL 10 MINUTE)';
            yield this.connection.query({ sql: qStr });
        });
        /**
         * cronDelete notification
         */
        this.cronDeleteNoti = () => __awaiter(this, void 0, void 0, function* () {
            const qStr = "DELETE FROM ngf_ecommerce.notifications WHERE notifications.date < date_sub(now(),interval 7 day) AND notifications.status = 'read'";
            yield this.connection.query({ sql: qStr });
        });
        /**
         * search
         */
        this.search = (phrase, limit, skip) => __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT admin_products_id AS id, product_name, product_picture_1, price, stock_status FROM products WHERE MATCH (product_name, tags) AGAINST (?) LIMIT ? OFFSET ?`;
            const totalSql = `SELECT count(admin_products_id) as total FROM products WHERE MATCH (product_name, tags) AGAINST (?)`;
            const [total] = (yield this.connection.query(totalSql, [
                phrase,
            ]));
            const [data] = (yield this.connection.query(sql, [
                phrase,
                Number(limit),
                Number(skip),
            ]));
            return Object.assign({ data }, total[0]);
        });
        /**
         * beginTransaction
         */
        this.beginTransaction = () => __awaiter(this, void 0, void 0, function* () {
            if (this.connection === this.dbcon) {
                yield this.connection.beginTransaction();
            }
            else {
                throw new Error('Cannot start transaction on a Pool. For transaction, use PoolConnection');
            }
        });
        /**
         * rollback the transaction
         */
        this.rollback = () => __awaiter(this, void 0, void 0, function* () {
            if (this.connection === this.dbcon) {
                yield this.connection.rollback();
                this.connection.release();
            }
            else {
                throw new Error('Cannot rollback Pool. To rollback, use PoolConnection');
            }
        });
        /**
         * commit transaction
         */
        this.commit = () => __awaiter(this, void 0, void 0, function* () {
            if (this.connection === this.dbcon) {
                yield this.connection.commit();
                this.connection.release();
            }
            else {
                throw new Error('Cannot commit Pool. To commit, use PoolConnection');
            }
        });
        this.dbcon = dbcon;
        if (this.dbcon instanceof dbAccess_1.default) {
            this.connection = this.dbcon.instance.getPool().promise();
        }
        else {
            this.connection = this.dbcon;
        }
    }
}
exports.default = Queries;
//# sourceMappingURL=queries.js.map