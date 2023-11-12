"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbCon = void 0;
const config_1 = __importDefault(require("./common/config/config"));
const mysql2_1 = __importDefault(require("mysql2"));
class OtwDb {
    constructor() {
        this.conn = mysql2_1.default.createPool({
            connectionLimit: 100,
            host: 'm360ictecommerce.cz7yrv0b23wp.ap-south-1.rds.amazonaws.com',
            user: 'ngf_admin',
            password: config_1.default.DO_DB_PASS,
            database: 'ngf_ecommerce',
            queueLimit: 100,
            port: 3306,
        });
    }
    // constructor() {
    //   this.conn = mysql.createPool({
    //     connectionLimit: 100,
    //     host: 'localhost',
    //     user: 'root',
    //     password: config.DB_PASS,
    //     database: 'ngf_ecommerce',
    //     queueLimit: 100,
    //   });
    // }
    /*  getConnection  */
    getPool() {
        return this.conn;
    }
}
exports.dbCon = new OtwDb();
exports.default = OtwDb;
//# sourceMappingURL=otwDb.js.map