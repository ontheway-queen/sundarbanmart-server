import { Request, Response, NextFunction } from 'express';
import AbstractController from '../../../abstracts/abstractController';
import GenOtp from '../../services/otpServices/genOtp';
import RequireOtp from '../../services/otpServices/requireOtp';

class OtpController extends AbstractController {
  constructor() {
    super();
  }
  /**
   * generate OTP
   */
  public generateOtp = this.assyncWrapper.wrap(
    async (req: Request, res: Response): Promise<void> => {
      const { type } = req.params;
      const { phone, user } = req.body;

      const obj = { phone, user, type };

      const data = await new GenOtp(obj).genOtp();

      if (data?.success) {
        res.status(200).json({ success: true, message: data.message });
      } else {
        this.error(
          data?.message || 'Something went wrong',
          400,
          'Cannot send OTP'
        );
      }
    }
  );

  /**
   * match OTP
   */
  public matchOtp = this.assyncWrapper.wrap(
    async (req: Request, res: Response): Promise<void> => {
      const { otp_creds } = req.body;

      const token = await new RequireOtp(otp_creds).requireOtp();

      if (token) {
        res.status(200).json({ success: true, token });
      } else {
        this.error(
          'Make sure you are using valid route to verify OTP',
          400,
          'Invlaid OTP route'
        );
      }
    }
  );
}

export default OtpController;
