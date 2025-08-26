import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || '';
export const SCRAPING_USER_AGENT = process.env.SCRAPING_USER_AGENT || '';
export const SCRAPING_USER_ID = process.env.SCRAPING_USER_ID || '';
export const SCRAPING_PASSWORD = process.env.SCRAPING_PASSWORD || '';
export const SCRAPING_GAS_URL = process.env.SCRAPING_GAS_URL || '';
