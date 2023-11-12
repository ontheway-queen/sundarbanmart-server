import { PoolConnection } from 'mysql2/promise';
import Lib from '../../../common/utils/libraries/lib';
import Queries from '../../../common/dataAccess/queries';
import CustomError from '../../../common/utils/errors/customError';

type Tobj = {
  conn: PoolConnection;
  phone: number;
  type: string;
};

class SendOtp {
  private phone: number;
  private type: string;
  private query: Queries;

  constructor(obj: Tobj) {
    this.phone = obj.phone;
    this.type = obj.type;
    this.query = new Queries(obj.conn);
  }

  public sendOtp = async () => {
    const fields = ['id', 'hashed_otp', 'tried'];

    const data = await this.query.getOtp({
      fields,
      table: 'otp',
      phone: this.phone,
      type: this.type,
    });

    if (data.length > 0) {
      throw new CustomError(
        'Cannot send another OTP within 2 minutes',
        400,
        'Limited OTP'
      );
    } else {
      const otp = Lib.otpGen();
      const hashed_otp = await Lib.hashPass(otp);

      let message: string;

      if (this.type === 'forget') {
        message = `${otp} - is the OTP to reset your password. Thank you for being with ngf_ecommerce. https://onthe-way.com`;
      } else if (this.type === 'register') {
        message = `${otp} - is the OTP to register your account. Thank you for being with ngf_ecommerce. https://onthe-way.com`;
      } else if (this.type === 'order') {
        message = `Your OTP is - ${otp}. Thank you for being with ngf_ecommerce. https://onthe-way.com`;
      } else {
        throw new CustomError(
          'Please select a valid OTP type eg. (forget | register | order)',
          400,
          'Invalid OTP'
        );
      }

      const otp_creds = {
        hashed_otp,
        phone: this.phone,
        type: this.type,
      };

      const sent = await Lib.sendSms(Number(this.phone), message);
      await this.query.insert('otp', otp_creds);

      if (sent) {
        return { success: true, message: 'OTP sent successfully' };
      } else {
        return { success: false, message: 'Cannot send OTP' };
      }
    }
  };
}

export default SendOtp;
