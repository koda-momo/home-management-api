import axios from 'axios';
import { LineApiResponse, LinePushMessagePayload } from '../types/lineType';
import { LINE_CHANNEL_ACCESS_TOKEN, LINE_USER_ID } from '../config/common';
import { validation } from '../schemas';
import { postLineSchema } from '../schemas/lineSchemas';
import { ErrorResponse } from '../utils/types';

/**
 * LINE送信API.
 */
export const postLineService = async (
  body: Request['body']
): Promise<LineApiResponse> => {
  try {
    const { message } = validation(body, postLineSchema);

    const payload: LinePushMessagePayload = {
      to: LINE_USER_ID,
      messages: [
        {
          type: 'text',
          text: message,
        },
      ],
      notificationDisabled: false,
    };

    await axios.post('https://api.line.me/v2/bot/message/push', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      timeout: 5000,
    });

    return {
      message: 'Message sent successfully',
    };
  } catch (error) {
    if (error instanceof Error) {
      const errorResponse = error as ErrorResponse;
      errorResponse.statusCode = 500;
      throw errorResponse;
    }
    const unknownError = new Error('Unknown error occurred') as ErrorResponse;
    unknownError.statusCode = 500;
    throw unknownError;
  }
};
