import { PoolConnection } from 'mysql2/promise';
import Queries from '../../../common/dataAccess/queries';
import CustomError from '../../../common/utils/errors/customError';
import Lib from '../../../common/utils/libraries/lib';
import { dbCon } from '../../../otwDb';

type IOtpCreds = {
  phone: number;
  otp: string;
  type: string;
};

class RequireOtp {
  private phone: number;
  private otp: string;
  private type: string;

  constructor(otp_creds: IOtpCreds) {
    this.phone = otp_creds.phone;
    this.otp = otp_creds.otp;
    this.type = otp_creds.type;
  }

  /**
   * require otp
   */
  public async requireOtp() {
    const pool = dbCon.getPool();
    const conn: PoolConnection = await pool.promise().getConnection();
    const query = new Queries(conn);
    const fields = ['id', 'hashed_otp', 'tried'];

    const otp_creds = {
      fields,
      table: 'otp',
      phone: this.phone,
      type: this.type,
    };
    const data = await query.getOtp(otp_creds);

    if (data.length < 1) {
      throw new CustomError('OTP expired', 400, 'Invalid OTP');
    } else {
      const { id, hashed_otp, tried } = data[0];

      const isOtpValid = await Lib.compare(this.otp, hashed_otp);

      if (isOtpValid) {
        const data = { tried: tried + 1, matched: 1 };

        await query.update({ table: 'otp', data, where: { id } });

        const maxAge = 15 * 60;

        if (this.type === 'forget' || this.type === 'register') {
          const token = Lib.createToken(
            { phone: this.phone, type: this.type },
            maxAge
          );

          return token;
        } else {
          return true;
        }
      } else {
        const data = { tried: tried + 1 };

        await query.update({ table: 'otp', data, where: { id } });

        throw new CustomError('Please Provide a valid OTP', 400, 'Invalid OTP');
      }
    }
  }
}

export default RequireOtp;
