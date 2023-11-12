import QueenControllers from '../../controllers/genController/queenControllers';
import AbstractRouter from '../../../abstracts/abstractRouter';

class QueenRouters extends AbstractRouter {
  private queenControllers = new QueenControllers();

  constructor() {
    super();

    this.callRouters();
  }

  private callRouters() {
    /**
     *  get a queen
     */
    this.routers.get('/getqueen/:id', this.queenControllers.getAQueen);

    // get a queens all ref queen
    this.routers.get(
      '/get/all/ref/queen/:id',
      this.queenControllers.getAQueensAllRefQ
    );

    // search queen by name
    this.routers.get(
      '/search/for-client/:name',
      this.queenControllers.searchQueen
    );

    /**
     *  queen upload nid
     */
    this.routers.post(
      '/upload/nid/:id',
      this.multipleUploader.upload('nids'),
      this.reqSetter.setRequest,
      this.queenControllers.queenUploadNids
    );

    /**
     *  update queens info
     */
    this.routers.put(
      '/update/info/:id',
      this.queenControllers.updateQueensInfo
    );

    /**
     *  update queen dp
     */
    this.routers.put(
      '/update/dp/:id',
      this.singleUploader.upload('queens'),
      this.reqSetter.setRequest,
      this.queenControllers.updateQueenDp
    );

    /**
     *  get all approved queens who has products
     */
    this.routers.get(
      '/get/approved/with/products',
      this.queenControllers.getAllApprovedQueens
    );

    /**
     *  queen update password
     */
    this.routers.put(
      '/update/password/:id',
      this.queenControllers.queenUpdatePassword
    );
  }
}

export default QueenRouters;
