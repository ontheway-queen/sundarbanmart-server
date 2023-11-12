import Queries from '../../dataAccess/queries';
import CustomError from '../errors/customError';
import DbAccess from '../../dataAccess/dbAccess';

type TObj = {
  success: boolean;
  message?: string;
  data?: any;
  status?: number;
  token?: string;
  user?: object;
};

class Transaction {
  private pool;

  constructor(db: DbAccess) {
    this.pool = db.instance.getPool();
  }

  /**
   * beginTransaction
   */
  public beginTransaction = async (
    cb: (query: Queries) => Promise<TObj>
  ): Promise<TObj> => {
    const conn = await this.pool.promise().getConnection();
    const query = new Queries(conn);

    try {
      await query.beginTransaction();

      const data = await cb(query);

      await query.commit();

      return data;
    } catch (err: any) {
      console.log({ sad: err.sql });
      query.rollback();
      throw new CustomError(err.message, err.status, err.type);
    }
  };
}

export default Transaction;
