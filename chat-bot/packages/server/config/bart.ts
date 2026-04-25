import dotenv from 'dotenv';
import { InferenceClient } from '@huggingface/inference';

dotenv.config();

export const inferenceClient = new InferenceClient(process.env.HF_TOKEN);
