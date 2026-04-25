import fs from 'fs';
import path from 'path';
import { client } from '../config/openai';
import { inferenceClient } from '../config/bart';
import { ollamaClient } from '../config/ollama';

const template = fs.readFileSync(
    path.join(__dirname, '..', 'prompts', 'summarize.txt'),
    'utf-8',
);

const providers = {
    openai: async (reviews: string) => {
        const prompt = template.replace('{{reviews}}', reviews);
        const response = await client.responses.create({
            model: 'gpt-4.1',
            input: prompt,
            temperature: 0.2,
            max_output_tokens: 500,
        });
        return response.output_text;
    },
    bart: async (reviews: string) => {
        const prompt = template.replace('{{reviews}}', reviews);
        const response = await inferenceClient.summarization({
            model: 'facebook/bart-large-cnn',
            inputs: prompt,
        });
        return response.summary_text;
    },
    llama: async (reviews: string) => {
        const prompt = template.replace('{{reviews}}', reviews);
        const response = await inferenceClient.chatCompletion({
            model: 'meta-llama/Meta-Llama-3-8B-Instruct:novita',
            messages: [{ role: 'user', content: prompt }],
        });
        return response.choices[0]?.message.content ?? '';
    },
    ollama: async (reviews: any) => {
        const summarizePrompt = template.replace('{{reviews}}', '').trim();
        const response = await ollamaClient.chat({
            model: 'tinyllama',
            messages: [
                { role: 'system', content: summarizePrompt },
                { role: 'user', content: reviews },
            ],
        });
        return response.message.content || '';
    },
};

export const Summary = {
    async create(joinedReviews: string): Promise<string> {
        return providers['openai'](joinedReviews);
    },
};
