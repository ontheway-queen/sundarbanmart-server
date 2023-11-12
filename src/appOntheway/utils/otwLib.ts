import cron from 'node-cron';
import Queries from '../../common/dataAccess/queries';
import DbAccess from '../../common/dataAccess/dbAccess';
import { dbCon } from '../../otwDb';

class otwLib {
  // CREATE CRON JOB
  public static cronTask() {
    cron.schedule('0 0 0 * * *', () => {
      new Queries(new DbAccess(dbCon)).cronDeleteOTP();
    });

    cron.schedule('0 0 0 * * *', () => {
      new Queries(new DbAccess(dbCon)).cronDeleteNoti();
    });
  }
}

export default otwLib;
