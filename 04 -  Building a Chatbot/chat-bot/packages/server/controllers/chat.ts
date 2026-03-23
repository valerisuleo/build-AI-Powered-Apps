import {
    chat as Chat,
    chatSchema,
    type ChatRequest,
    type ChatResponse,
} from '../models/chat';
import { conversations } from '../config/conversations';

import { type Request, type Response, type NextFunction } from 'express';

export async function createRoute(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    try {
        const validatedData = chatSchema.parse(request.body);
        const result = await handleChat(validatedData);
        response.json(result);
    } catch (error) {
        next(error);
    }
}

async function handleChat(request: ChatRequest): Promise<ChatResponse> {
    const { prompt, conversationId } = request;

    const result = await Chat.create({
        model: 'gpt-4o-mini',
        input: prompt,
        temperature: 0.2,
        max_output_tokens: 100,
        previous_response_id: conversations.get(conversationId),
    });

    conversations.set(conversationId, result.id);

    return {
        message: result.output_text,
    };
}
