import AbstractRouter from '../../../abstracts/abstractRouter';
import AdminFundControllers from '../../controllers/adminController/adminFundController';

class AdminFundRouters extends AbstractRouter {
  private adminFundControllers = new AdminFundControllers();

  constructor() {
    super();

    this.callRouters();
  }

  private callRouters() {
    /**
     * getAllFunds
     */

    this.routers.get('/get/all', this.adminFundControllers.getAllFunds);

    /**
     * get a fund
     */
    this.routers.get('/get/one/:id', this.adminFundControllers.getAFund);

    /**
     * update queen fund info
     */
    this.routers.put(
      '/update/info/:id',
      this.adminFundControllers.updateQueenFundInfo
    );
  }
}

export default AdminFundRouters;
