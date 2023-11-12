import AbstractRouter from '../../../abstracts/abstractRouter';
import CommonController from '../../controllers/commonController/commonController';

class CommonRouter extends AbstractRouter {
  private commonController = new CommonController();
  constructor() {
    super();
    this.callRouter();
  }
  // call router
  private callRouter() {
    this.routers.get(
      '/register/check/phone/:type/:phone',
      this.commonController.checkPhoneForReg
    );
  }
}
export default CommonRouter;
