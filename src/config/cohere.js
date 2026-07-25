import { CohereClientV2 } from 'cohere-ai';
import 'dotenv/config';
export const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});
