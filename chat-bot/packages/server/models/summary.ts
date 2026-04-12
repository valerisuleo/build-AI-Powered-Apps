import fs from 'fs';
import path from 'path';
import { client } from '../config/openai';

const template = fs.readFileSync(
    path.join(__dirname, '..', 'prompts', 'summarize.txt'),
    'utf-8',
);

export const Summary = {
    async create(joinedReviews: string): Promise<string> {
        const prompt = template.replace('{{reviews}}', joinedReviews);
        const response = await client.responses.create({
            model: 'gpt-4.1',
            input: prompt,
            temperature: 0.2,
            max_output_tokens: 500,
        });
        return response.output_text;
    },
};
