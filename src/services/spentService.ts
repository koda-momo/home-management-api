import { ref, getDatabase, child, get } from 'firebase/database';
import { app } from '../config/firebase';
import { errorResponse } from '../utils/const';
import { makeYearMonthString } from '../utils/functions/makeYearMonthString';
import { SpentApiData, SpentDbArray } from '../types/spentType';

/**
 * 支出額全取得API.
 */
export const getAllSpentService = async (): Promise<SpentApiData[]> => {
  try {
    const dbRef = ref(getDatabase(app));
    const dateQuery = child(dbRef, 'price');

    const dateSnapShot = await get(dateQuery);
    const data: SpentDbArray = dateSnapShot.val();
    const monthKeys = Object.keys(data);
    const responseData = monthKeys.map((monthKey) => {
      // 水道代がなければ上書き
      return { month: monthKey, water: 0, ...data[monthKey] };
    });

    return responseData;
  } catch (error) {
    throw { ...errorResponse.internalServerError, message: error };
  }
};

/**
 * 支出額当月分取得API.
 */
export const getMonthSpentService = async (): Promise<SpentApiData> => {
  try {
    const dbRef = ref(getDatabase(app));
    const dateQuery = child(dbRef, 'price');

    const date = new Date();
    const yearMonthString = makeYearMonthString(date);

    const dateSnapShot = await get(child(dateQuery, yearMonthString));
    const data = dateSnapShot.val();

    return data;
  } catch (error) {
    throw { ...errorResponse.internalServerError, message: error };
  }
};
