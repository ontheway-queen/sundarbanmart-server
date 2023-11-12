import AbstractRouter from '../../../abstracts/abstractRouter';
import CustomerControllers from '../../controllers/genController/customerControllers';

class CustomerRouters extends AbstractRouter {
  private customerController = new CustomerControllers();

  constructor() {
    super();

    this.callRouters();
  }
  private callRouters() {
    /**
     * reguster customer
     */
    this.routers.post('/auth/register', this.customerController.register);

    /**
     * get all customers
     */
    this.routers.get('/get/all', this.customerController.getAllCustomers);

    /**
     *  get a customer by id
     */
    this.routers.get('/get/:id', this.customerController.getACustomer);

    /**
     *  get a customer by phone
     */
    this.routers.get(
      '/get/by-phone/:phone',
      this.customerController.getACustomer
    );

    /**
     *  update customer info
     */
    this.routers.put(
      '/update/:id',
      this.singleUploader.upload('customers'),
      this.reqSetter.setRequest,
      this.customerController.updateCustomerInfo
    );
  }
}

export default CustomerRouters;
