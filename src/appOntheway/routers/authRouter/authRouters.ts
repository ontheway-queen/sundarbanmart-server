import AuthController from '../../controllers/authController/authControllers';
import AbstractRouter from '../../../abstracts/abstractRouter';

class AuthRouters extends AbstractRouter {
  private authCon = new AuthController();

  constructor() {
    super();
    this.callRouters();
  }

  private callRouters() {
    /**
     * register a user
     */
    this.routers.post(
      '/queen/register',
      this.singleUploader.upload('queens'),
      this.reqSetter.setRequest,
      this.authCon.register
    );

    /**
     * login a user
     */
    this.routers.post('/:user/login', this.authCon.login);

    /**
     * forgetPassword
     */
    this.routers.post('/forget/:user', this.authCon.forgetPassword);
  }
}

export default AuthRouters;
