import CustomError from '../common/utils/errors/customError';
import AssyncWrapper from '../common/middlewares/assypers/assyper';
import CommonServices from '../appOntheway/services/commonServices';

abstract class AbstractController {
  protected assyncWrapper: AssyncWrapper;
  protected commonServices: CommonServices;

  constructor() {
    this.assyncWrapper = new AssyncWrapper();
    this.commonServices = new CommonServices();
  }

  protected error(message?: string, status?: number, type?: string) {
    throw new CustomError(
      message || 'Something went wrong',
      status || 500,
      type || 'Internal server Error'
    );
  }
}

export default AbstractController;
