import { PoolConnection } from 'mysql2/promise';
import Queries from '../../../common/dataAccess/queries';
import CustomError from '../../../common/utils/errors/customError';
import SendOtp from './sendOtp';
import { dbCon } from '../../../otwDb';

type IotpInfo = {
  phone: number;
  user: string;
  type: string;
};

class GenOtp {
  private phone: number;
  private user: string;
  private type: string;

  constructor(obj: IotpInfo) {
    this.phone = obj.phone;
    this.user = obj.user;
    this.type = obj.type;
  }

  /**
   * Generate OTP
   */
  public async genOtp() {
    const pool = dbCon.getPool();
    const conn: PoolConnection = await pool.promise().getConnection();

    const sendObj = {
      conn,
      phone: this.phone,
      type: this.type,
    };

    const query = new Queries(conn);
    const { sendOtp } = new SendOtp(sendObj);

    const table =
      this.user === 'customer'
        ? 'customers'
        : this.user === 'queen'
        ? 'admin_queens'
        : this.user === 'seller'
        ? 'freelancing_seller'
        : this.user === 'social'
        ? 'social_users'
        : this.user === 'trainee'
        ? 'training_trainee'
        : this.user === 'trainer'
        ? 'training_trainer'
        : this.user === 'buyer'
        ? 'freelancing_buyer'
        : '';

    if (table === '' && this.type === 'forget') {
      throw new CustomError(
        'Please insert valid user, i.e (customer, queen, seller,buyer, social, trainee or trainer).',
        400,
        'Invalid user!'
      );
    } else if (this.type === 'forget') {
      const fields = table === 'customers' ? ['id', 'guest'] : ['id'];
      const data = await query.select({
        table,
        fields: { columns: fields },
        where: { table, field: 'phone', value: this.phone },
      });

      const { guest } = data[0] || {};
      if (data.length < 1 || guest === 1) {
        throw new CustomError(
          'No account found with this phone number',
          500,
          'Invalid phone'
        );
      } else {
        return await sendOtp();
      }
    } else {
      // if the type is not forget then just send the otp
      return await sendOtp();
    }
  }
}

export default GenOtp;
