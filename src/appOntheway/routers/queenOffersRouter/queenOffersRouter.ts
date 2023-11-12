import AbstractRouter from '../../../abstracts/abstractRouter';
import queenOffersController from '../../controllers/queenOffersController/queenOffersController';

class queenOffersRouter extends AbstractRouter {
  private queenOffersController = new queenOffersController();
  constructor() {
    super();
    this.callRouters();
  }
  private callRouters() {
    // create offer for queen
    this.routers.post(
      '/create/offer',
      this.singleUploader.upload('queens_offer'),
      this.reqSetter.setRequest,
      this.queenOffersController.createQueenOffer
    );

    // update offer
    this.routers.put(
      '/update/offer/:id',
      this.singleUploader.upload('queens_offer'),
      this.reqSetter.setRequest,
      this.queenOffersController.updateQueensOffer
    );

    // get all offers
    this.routers.get('/get/all', this.queenOffersController.getAllQueensOffer);

    // get all offer by status
    this.routers.get(
      '/get/all/by-status/:status',
      this.queenOffersController.getAllQueensOfferByStatus
    );

    // get a single queens offer
    this.routers.get(
      '/get/single/:offer_id',
      this.queenOffersController.getASingleQueensOffer
    );

    // queen get an queens offfer
    this.routers.post(
      '/queen/get/offer',
      this.queenOffersController.queenGetAnOffer
    );

    // update a get offer by queen
    this.routers.put(
      '/update/queen/getting/offer',
      this.queenOffersController.updateQueensGettingOffer
    );

    // get an offers getting all queens
    this.routers.get(
      '/get/all/getting-queens/by/offer/:offer_id',
      this.queenOffersController.offersAllGettingQueen
    );

    // get a queens getting all offer
    this.routers.get(
      '/get/all/queens-offer/by/queen/:queen_id',
      this.queenOffersController.queensGettingAllOffers
    );
  }
}
export default queenOffersRouter;
