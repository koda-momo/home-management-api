import { ref, getDatabase, child, get, set } from 'firebase/database';
import { app } from '../config/firebase';
import { errorResponse } from '../utils/const';
import { makeYearMonthString } from '../utils/functions/makeYearMonthString';
import { SpentApiData, SpentDbArray } from '../types/spentType';
import { validation } from '../schemas';
import { postSpentSchema } from '../schemas/spentSchema';
import { FirebaseError } from 'firebase/app';

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
      return { month: monthKey, ...data[monthKey] };
    });

    return responseData;
  } catch (error) {
    if (error) {
      throw error;
    }
    if (error instanceof FirebaseError) {
      throw {
        ...error,
        status: error.code,
      };
    }
    throw errorResponse.internalServerError;
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
    if (error) {
      throw error;
    }
    if (error instanceof FirebaseError) {
      throw {
        ...error,
        status: error.code,
      };
    }
    throw errorResponse.internalServerError;
  }
};

/**
 * 支出額追加API.
 */
export const postSpentService = async (
  body: Request['body']
): Promise<SpentApiData> => {
  try {
    const requestData = validation(body, postSpentSchema);
    const spending = Object.values(requestData).reduce(
      (a, b) => a + Number(b),
      0
    );
    const postData = { spending, ...requestData };

    const db = getDatabase(app);
    const date = new Date();
    const keyDate = makeYearMonthString(date);
    const path = `price/${keyDate}`;

    await set(ref(db, path), postData);
    return { month: keyDate, ...postData };
  } catch (error) {
    if (error) {
      throw error;
    }
    if (error instanceof FirebaseError) {
      throw {
        ...error,
        status: error.code,
      };
    }
    throw errorResponse.internalServerError;
  }
};
