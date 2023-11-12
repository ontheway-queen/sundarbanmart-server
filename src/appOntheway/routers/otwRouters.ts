import OptRouter from './otpRouter/otpRouters';
import FundRouters from './genRouter/fundRouters';
import AuthRouters from './authRouter/authRouters';
import QueenRouters from './genRouter/queenRouters';
import OrderRouters from './orderRouter/orderRouters';
import ProductRouters from './genRouter/productRouters';
import CustomerRouters from './genRouter/customerRouters';
import AdminFundRouters from './adminRouter/adminFundRouters';
import AdminQueenRouters from './adminRouter/adminQueenRouters';
import AdminPanelRouters from './adminPanelRouter/adminPanelRouter';
import AdminProductRouters from './adminRouter/adminProductRouters';
import ContentImageRouters from './contentImageRouter/contentImageRouters';
import AdminSearchRouters from './adminRouter/adminSearchRouters';
import ClientRouters from './clientRouter/clientRouter';
import ratingRouter from './genRouter/ratingRouter';
import productQARouters from './genRouter/productQARouters';
import queenOffersRouter from './queenOffersRouter/queenOffersRouter';
import BlogRouter from './blogRouter/blogRouter';
import CommonRouter from './commonRouter/commonRouters';
import ExternalRouter from './externalRouter/externalRouter';

class Routers {
  public otpRouter = new OptRouter().routers;
  public fundRouter = new FundRouters().routers;
  public authRouter = new AuthRouters().routers;
  public queenRouter = new QueenRouters().routers;
  public queenOfferRouter = new queenOffersRouter().routers;
  public orderRouter = new OrderRouters().routers;
  public productRouter = new ProductRouters().routers;
  public customerRouter = new CustomerRouters().routers;
  public adminFundRouters = new AdminFundRouters().routers;
  public adminQueenRouter = new AdminQueenRouters().routers;
  public adminPanelRouter = new AdminPanelRouters().routers;
  public contentImageRouter = new ContentImageRouters().routers;
  public adminProductRouter = new AdminProductRouters().routers;
  public adminSearchRouter = new AdminSearchRouters().routers;
  public clientRouter = new ClientRouters().routers;
  public ratingRouter = new ratingRouter().routers;
  public porductQARouter = new productQARouters().routers;
  public blogRouter = new BlogRouter().routers;
  public commonRouter = new CommonRouter().routers;
  public externalRouter = new ExternalRouter().routers;
}

export default Routers;
