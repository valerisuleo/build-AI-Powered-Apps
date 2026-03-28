import z from 'zod';
import fs from 'fs';
import path from 'path';
import { client } from '../config/openai';
import type { IPayload } from './interfaces';

const conversations = new Map<string, string>();

const chatSchema = z.object({
    prompt: z
        .string()
        .trim()
        .min(1, 'Prompt is required')
        .max(1000, 'Prompt is too long. Max 1000 characters'),
    conversationId: z.uuid('Invalid UUID'),
});

const template = fs.readFileSync(
    path.join(__dirname, '..', 'prompts', 'chatbot.txt'),
    'utf-8',
);

const parkInfo = fs.readFileSync(
    path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
    'utf-8',
);

const instructions = template.replace('{{parkInfo}}', parkInfo);

export const Chat = {
    async create(body: IPayload) {
        const validatedData = chatSchema.parse(body);
        const { prompt, conversationId } = validatedData;

        const result = await client.responses.create({
            model: 'gpt-4o-mini',
            instructions,
            input: prompt,
            temperature: 0.2,
            max_output_tokens: 200,
            previous_response_id: conversations.get(conversationId),
        });

        conversations.set(conversationId, result.id);

        return result;
    },
};
