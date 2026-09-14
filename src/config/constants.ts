import dotenv from 'dotenv';
import { PdamProductCode } from '../models/transaction.js';

dotenv.config();

export const CONFIG = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB: {
    HOST: process.env.DB_HOST || '127.0.0.1',
    PORT: parseInt(process.env.DB_PORT || '3306', 10),
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_NAME || 'bimasakti_pdam',
    TEST_NAME: process.env.DB_TEST_NAME || 'bimasakti_pdam_test',
  },
  RAJABILLER: {
    URL: process.env.RAJABILLER_URL || 'https://c-dev-partnerlink.rajabiller.com/json/index.php',
    UID: process.env.RAJABILLER_UID || 'SP300203',
    PIN: process.env.RAJABILLER_PIN || '311575',
  },
} as const;

// Single source of truth for products. A code is supported iff it is a key here.
export const SUPPORTED_PRODUCTS: Record<PdamProductCode, { name: string; defaultIdpel: string }> = {
  WASDA: { name: 'PDAM SIDOARJO', defaultIdpel: '01002676' },
  WABONDO: { name: 'PDAM BONDOWOSO', defaultIdpel: '09000879' },
};
