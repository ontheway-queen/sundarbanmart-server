import OtpController from '../../controllers/otpController/otpController';
import AbstractRouter from '../../../abstracts/abstractRouter';

class OptRouter extends AbstractRouter {
  private otpCon = new OtpController();

  constructor() {
    super();

    this.callRouters();
  }

  private callRouters() {
    /**
     * generate OTP
     */
    this.routers.post('/send/:type', this.otpCon.generateOtp);

    /**
     * match OTP
     */
    this.routers.post('/match', this.otpCon.matchOtp);
  }
}

export default OptRouter;
