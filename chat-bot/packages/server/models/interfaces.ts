export interface IPayload {
    prompt: string;
    conversationId: string;
}

export interface IResponse {
    id: string;
    object: string;
    created_at: number;
    status: string;
    background: boolean;
    billing?: {
        payer?: string;
    };
    completed_at?: number | null;
    error?: string | null;
    frequency_penalty?: number;
    incomplete_details?: string | null;
    instructions?: string | null;
    max_output_tokens?: number | null;
    max_tool_calls?: number | null;
    model?: string;
    output?: Array<{
        id: string;
        type: string;
        status: string;
        role: string;
        content?: Array<{
            type: string;
            text?: string;
        }>;
    }>;
    parallel_tool_calls?: boolean;
    presence_penalty?: number;
    previous_response_id?: string | null;
    prompt_cache_key?: string | null;
    prompt_cache_retention?: string | null;
    reasoning?: {
        effort?: string | null;
        summary?: string | null;
    };
    safety_identifier?: string | null;
    service_tier?: string;
    store?: boolean;
    temperature?: number;
    text?: {
        format?: {
            type?: string;
        };
        verbosity?: string;
    };
    tool_choice?: string;
    tools?: unknown[];
    top_logprobs?: number;
    top_p?: number;
    truncation?: string;
    usage?: {
        input_tokens?: number;
        input_tokens_details?: {
            cached_tokens?: number;
        };
        output_tokens?: number;
        output_tokens_details?: {
            reasoning_tokens?: number;
        };
        total_tokens?: number;
    };
    user?: string | null;
    metadata?: Record<string, unknown>;
    output_text?: string;
}
