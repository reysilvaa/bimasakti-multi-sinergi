import dotenv from 'dotenv';
import { PdamProductCode } from '../types/transaction.types.js';

dotenv.config();

export const CONFIG = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_PATH: process.env.DATABASE_PATH || './data/database.sqlite',
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
