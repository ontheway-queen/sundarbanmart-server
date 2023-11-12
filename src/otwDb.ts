import config from './common/config/config';
import mysql, { Pool } from 'mysql2';

class OtwDb {
  private conn: Pool;
  constructor() {
    this.conn = mysql.createPool({
      connectionLimit: 100,
      host: 'm360ictecommerce.cz7yrv0b23wp.ap-south-1.rds.amazonaws.com',
      user: 'ngf_admin',
      password: config.DO_DB_PASS,
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
  public getPool(): Pool {
    return this.conn;
  }
}

export const dbCon = new OtwDb();

export default OtwDb;
