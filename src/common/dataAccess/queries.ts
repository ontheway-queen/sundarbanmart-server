import DbAccess from '../dataAccess/dbAccess';
import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { PoolConnection } from 'mysql2/promise';
import Lib from '../utils/libraries/lib';
import {
  TCompare,
  TCredType,
  TDelCred,
  TRaw,
  TResultSetHeader,
  TRowDataPacket,
  TWhere,
} from '../utils/commonTypes/types';

type TGetOtp = {
  fields: string[];
  table: string;
  phone: number;
  type: string;
};

type TUpCred = {
  table: string;
  data: object;
  where?: object;
  and?: { table: string; field: string; value: string | number }[];
  or?: { table: string; field: string; value: string | number }[];
};

type TRepCred = {
  replace: string[] | object;
  into: string;
  select?: string[];
  from?: string;
  where?: object;
};

class Queries {
  private dbcon: PoolConnection | DbAccess;
  private connection: Pool | PoolConnection;

  constructor(dbcon: PoolConnection | DbAccess) {
    this.dbcon = dbcon;

    if (this.dbcon instanceof DbAccess) {
      this.connection = this.dbcon.instance.getPool().promise();
    } else {
      this.connection = this.dbcon;
    }
  }

  /* 
  raw query 
  */
  public rawQuery = async (
    sql: string,
    values?: (object | string | number)[]
  ) => {
    const options = values ? { sql, values } : { sql };

    const [data] = (await this.connection.query(options)) as TRaw;

    return data;
  };

  /**
   * query to insert
   */

  public insert = async (
    table: string,
    body: object
  ): Promise<ResultSetHeader> => {
    const sql = 'INSERT INTO ?? SET ?';

    const [data] = (await this.connection.query({
      sql,
      values: [table, body],
    })) as TResultSetHeader;

    return data;
  };

  /**
   * query to insert multiple data
   */
  public multipleInsert = async (
    table: string,
    fields: string[],
    values: any[]
  ): Promise<ResultSetHeader> => {
    const sql = 'INSERT INTO ?? (??) VALUES ?';

    const [data] = (await this.connection.query({
      sql,
      values: [table, fields, values],
    })) as TResultSetHeader;

    return data;
  };

  /**
   * query to select
   */

  public select = async (creds: TCredType): Promise<RowDataPacket[]> => {
    const asFields: string[] = [];
    const asCreds = creds.fields?.as;

    if (asCreds) {
      for (let i = 0; i < asCreds.length; i++) {
        const element = asCreds[i];

        asFields.push(`${creds.table}.${element[0]} as ${element[1]}`);
      }
    }

    let join: string = '';

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

    let where: string = '';
    const and = (creds.where as TWhere)?.and;
    const or = (creds.where as TWhere)?.or;

    if (creds.where) {
      if (and && or) {
        throw new Error('Currently cannot have both AND and OR operator');
      } else if (and || or) {
        where = 'WHERE';

        if (and) {
          for (let i = 0; i < and.length; i++) {
            const element = and[i];
            const andKey = and.length - 1 > i ? 'AND' : '';
            where += ` ${element.table}.${element.field} ${
              element.compare || '='
            } ${element.value} ${andKey}`;
          }
        }

        if (or) {
          for (let i = 0; i < or.length; i++) {
            const element = or[i];
            const orKey = or.length - 1 > i ? 'OR' : '';
            where += ` ${element.table}.${element.field} ${
              element.compare || '='
            } ${element.value} ${orKey}`;
          }
        }
      } else {
        const tw = creds.where as {
          table: string;
          field: string;
          value: string;
          compare: TCompare;
          date: true;
        };
        where = `WHERE ${
          tw.date ? `date(${tw.table}.${tw.field})` : `${tw.table}.${tw.field}`
        }  ${tw.compare || '='} ${tw.value}`;
      }
    }

    let fts = creds.fields?.columns
      ? Lib.fieldParser(creds.table, creds.fields.columns)
      : [];

    const otherFields = creds.fields?.otherFields;

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
          fts.push(...Lib.fieldParser(element.table, element.columns));
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

    const sql = `SELECT ${special} ${as} ${
      all || '??'
    } FROM ?? ${joinStr} ${where} ${orderBy} ${asc} ${desc} ${groupBy} ${limit}`;

    const dts: (string | string[] | object)[] = [creds.table];

    !all && dts.unshift(fts);

    console.log({ sql, dts });

    const [data] = (await this.connection.query({
      sql,
      values: dts,
    })) as TRowDataPacket;

    return data;
  };

  /**
   * select otp
   */
  public getOtp = async (obj: TGetOtp): Promise<RowDataPacket[]> => {
    const sql = `SELECT ?? FROM ?? WHERE phone = ? AND type = ? AND ADDTIME(create_time, '0:2:0') > NOW() AND tried < 3 AND matched = 0`;

    const [data] = (await this.connection.query({
      sql,
      values: [obj.fields, obj.table, obj.phone, obj.type],
    })) as TRowDataPacket;

    console.log({ data });

    return data;
  };

  /**
   * update
   */
  public update = async (obj: TUpCred): Promise<ResultSetHeader> => {
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

    const [data] = (await this.connection.query({
      sql: where,
      values,
    })) as TResultSetHeader;

    return data;
  };

  /**
   * replace
   */
  public replace = async (obj: TRepCred): Promise<ResultSetHeader> => {
    const { into, replace, select, from, where } = obj;

    console.log({ select });

    const sql = select
      ? 'REPLACE INTO ?? (??) SELECT ?? FROM ?? WHERE ?'
      : 'REPLACE INTO ?? SET ?';

    const values = select
      ? [into, replace, select, from, where]
      : [into, replace];

    const [data] = (await this.connection.query({
      sql,
      values,
    })) as TResultSetHeader;

    return data;
  };

  /**
   * delete
   */
  public delete = async (obj: TDelCred): Promise<ResultSetHeader> => {
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
    const [data] = (await this.connection.query({
      sql,
      values,
    })) as TResultSetHeader;
    return data;
  };

  /**
   * cronDelete otp
   */
  public cronDeleteOTP = async () => {
    const qStr =
      'DELETE FROM otp WHERE create_time < DATE_SUB(NOW(), INTERVAL 10 MINUTE)';
    await this.connection.query({ sql: qStr });
  };

  /**
   * cronDelete notification
   */
  public cronDeleteNoti = async () => {
    const qStr =
      "DELETE FROM ngf_ecommerce.notifications WHERE notifications.date < date_sub(now(),interval 7 day) AND notifications.status = 'read'";
    await this.connection.query({ sql: qStr });
  };

  /**
   * search
   */
  public search = async (
    phrase: string,
    limit: string | number,
    skip: string | number
  ) => {
    const sql = `SELECT admin_products_id AS id, product_name, product_picture_1, price, stock_status FROM products WHERE MATCH (product_name, tags) AGAINST (?) LIMIT ? OFFSET ?`;

    const totalSql = `SELECT count(admin_products_id) as total FROM products WHERE MATCH (product_name, tags) AGAINST (?)`;
    const [total] = (await this.connection.query(totalSql, [
      phrase,
    ])) as TRowDataPacket;

    const [data] = (await this.connection.query(sql, [
      phrase,
      Number(limit),
      Number(skip),
    ])) as TRowDataPacket;

    return { data, ...total[0] };
  };

  /**
   * beginTransaction
   */
  public beginTransaction = async (): Promise<void> => {
    if (this.connection === this.dbcon) {
      await this.connection.beginTransaction();
    } else {
      throw new Error(
        'Cannot start transaction on a Pool. For transaction, use PoolConnection'
      );
    }
  };

  /**
   * rollback the transaction
   */
  public rollback = async (): Promise<void> => {
    if (this.connection === this.dbcon) {
      await this.connection.rollback();
      this.connection.release();
    } else {
      throw new Error('Cannot rollback Pool. To rollback, use PoolConnection');
    }
  };

  /**
   * commit transaction
   */
  public commit = async (): Promise<void> => {
    if (this.connection === this.dbcon) {
      await this.connection.commit();
      this.connection.release();
    } else {
      throw new Error('Cannot commit Pool. To commit, use PoolConnection');
    }
  };
}

export default Queries;
