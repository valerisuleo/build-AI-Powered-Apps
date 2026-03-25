import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FaArrowUp } from 'react-icons/fa';
import { IoInformationCircle } from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import {
    Fragment,
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
} from 'react';
import axios from '@/lib/axios';
import ReactMarkdown from 'react-markdown';
import { TypingIndicator } from '@/components/custom/typing-indicator';
import { MessageBubble } from '@/components/custom/message-bubble';
import type { FormData, Message } from '@/types/interface';

const Home = () => {
    const { register, handleSubmit, reset, formState } = useForm<FormData>();
    const conversationId = useMemo(() => crypto.randomUUID(), []);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        formRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    }, [messages]);

    const promptCreate = async (prompt: string, conversationId: string) => {
        try {
            const response = await axios.post('/api/chat', {
                prompt,
                conversationId,
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'An error occurred',
            };
        }
    };

    const onSubmit = async (data: FormData) => {
        setError(null);
        setMessages((prev) => [
            ...prev,
            { content: data.prompt, role: 'user' },
        ]);
        setIsBotTyping(true);

        const response = await promptCreate(data.prompt, conversationId);

        if (response.success) {
            setMessages((prev) => [
                ...prev,
                { content: response.data['output_text'], role: 'bot' },
            ]);
            reset();
        } else {
            setError(response.error || 'An error occurred');
            setTimeout(() => {
                setError(null);
            }, 3000);
        }

        setIsBotTyping(false);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    return (
        <Fragment>
            {error && (
                <Alert variant="default" className="mb-4 max-w-md">
                    <IoInformationCircle />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col gap-3">
                {messages.map((message, index) => (
                    <MessageBubble key={index} role={message.role}>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </MessageBubble>
                ))}
                {isBotTyping && <TypingIndicator />}
            </div>

            <form
                ref={formRef}
                className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl my-5"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Textarea
                    onKeyDown={onKeyDown}
                    className="border-0 focus:outline-0 resize-none"
                    placeholder="Ask anything"
                    maxLength={1000}
                    {...register('prompt', {
                        required: true,
                        validate: (value) => value.trim().length > 0,
                    })}
                />
                <Button
                    className="rounded-full w-9 h-9"
                    disabled={!formState.isValid}
                >
                    <FaArrowUp />
                </Button>
            </form>
        </Fragment>
    );
};

export default Home;
