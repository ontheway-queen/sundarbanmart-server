import AbstractRouter from '../../../abstracts/abstractRouter';
import FundControllers from '../../controllers/genController/fundControllers';

class FundRouters extends AbstractRouter {
  private fundControllers = new FundControllers();

  constructor() {
    super();

    this.callRouters();
  }

  private callRouters() {
    /**
     *  queen apply for fund
     */
    this.routers.post('/apply', this.fundControllers.queenApplyForFund);

    /**
     *  queen update guaranter
     */
    this.routers.post(
      '/update/guaranter/:fund_id',
      this.singleUploader.upload('guaranters'),
      this.reqSetter.setRequest,
      this.fundControllers.queenUpdateGuaranter
    );

    /**
     *  queen update guaranter nids
     */
    this.routers.put(
      '/update/g/nid/:id',
      this.multipleUploader.upload('nids'),
      this.reqSetter.setRequest,
      this.fundControllers.queenUpdateGuaranerNids
    );

    /**
     *  get a queens all applications
     */
    this.routers.get(
      '/get/all/by/queen/:queen_id',
      this.fundControllers.getAQueensAllApplications
    );
  }
}

export default FundRouters;
