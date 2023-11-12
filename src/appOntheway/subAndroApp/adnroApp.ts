import express, { Application } from 'express';
import Routers from '../routers/otwRouters';
import HeaderSetter from './androMiddlewares/headerSetter';

class AndroApp {
  public app: Application;
  private headerSetter = new HeaderSetter();

  constructor(routers: Routers) {
    this.app = express();
    this.initMiddlewares();
    this.initRouters(routers);
  }

  private initMiddlewares() {
    this.app.use(this.headerSetter.setHeader);
  }

  private initRouters(routers: Routers) {
    this.app.use('/api/auth', routers.authRouter);
    this.app.use('/api/admin/auth', routers.adminPanelRouter);

    // GENERAL ROUTERS
    this.app.use('/api/otp', routers.otpRouter);
    this.app.use('/api/admin/queen', routers.queenRouter);
    this.app.use('/api/customer', routers.customerRouter);
    this.app.use('/api/admin/product', routers.productRouter);
    this.app.use('/api/admin/queen', routers.adminQueenRouter);
    this.app.use('/api/orders', routers.orderRouter);
    this.app.use('/api/fund', routers.fundRouter);
    this.app.use(
      '/api/admin/product',
      // this.checker.check('qotw', 'cotw', '__a_o'),
      routers.adminProductRouter
    );
    this.app.use('/api/admin/fund', routers.adminFundRouters);
  }
}

export default AndroApp;
