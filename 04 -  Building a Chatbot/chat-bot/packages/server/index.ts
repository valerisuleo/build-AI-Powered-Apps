import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, type Response } from 'express';
import OpenAI from 'openai';
import z from 'zod';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const conversations = new Map<string, string>();
const chatSchema = z.object({
    prompt: z
        .string()
        .trim()
        .min(1, 'Prompt is required')
        .max(1000, 'Prompt is too long. Max 1000 characters'),
    conversationId: z.uuid('Invalid UUID'),
});

app.post('/api/chat', async (request: Request, response: Response) => {
    const parseResult = chatSchema.safeParse(request.body);

    if (!parseResult.success) {
        response.status(400).json(parseResult.error.format());
        return;
    }

    try {
        const { prompt, conversationId } = parseResult.data;

        const result = await client.responses.create({
            model: 'gpt-4o-mini',
            input: prompt,
            temperature: 0.2,
            max_output_tokens: 100,
            previous_response_id: conversations.get(conversationId),
        });

        conversations.set(conversationId, result.id);

        response.json({
            message: result.output_text,
        });
    } catch (error) {
        response.status(500).json({
            error: 'Failed to generate a response',
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
