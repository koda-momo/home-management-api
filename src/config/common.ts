import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || '';
export const SCRAPING_USER_AGENT = process.env.SCRAPING_USER_AGENT || '';
