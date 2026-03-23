import z from 'zod';
import { client } from '../config/openai';

export const chatSchema = z.object({
    prompt: z
        .string()
        .trim()
        .min(1, 'Prompt is required')
        .max(1000, 'Prompt is too long. Max 1000 characters'),
    conversationId: z.uuid('Invalid UUID'),
});

export const chat = client.responses;
export interface ChatRequest {
    prompt: string;
    conversationId: string;
}

export interface ChatResponse {
    message: string;
}
