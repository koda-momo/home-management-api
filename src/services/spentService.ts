import { ref, getDatabase, child, get } from 'firebase/database';
import { app } from '../config/firebase';
import { errorResponse } from '../utils/const';

/**
 * 支出額取得API.
 */
export const getSpentService = async (): Promise<{ data: string }> => {
  try {
    const dbRef = ref(getDatabase(app));
    const dateQuery = child(dbRef, 'price');
    const yearMonthString = '202507';

    const dateSnapShot = await get(child(dateQuery, yearMonthString));
    const spendingData = dateSnapShot.val();

    return {
      data: spendingData,
    };
  } catch (error) {
    throw { ...errorResponse.internalServerError, message: error };
  }
};
