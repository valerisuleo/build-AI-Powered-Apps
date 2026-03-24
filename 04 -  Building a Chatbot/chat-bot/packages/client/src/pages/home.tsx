import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import {
    Fragment,
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
} from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

type FormData = {
    prompt: string;
};

type Message = {
    content: string;
    role: 'user' | 'bot';
};

const Home = () => {
    const { register, handleSubmit, reset, formState } = useForm<FormData>();
    const conversationId = useMemo(() => crypto.randomUUID(), []);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const formRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        formRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    }, [messages]);

    const onSubmit = async (data: FormData) => {
        console.log(data);
        setMessages((prev) => [
            ...prev,
            { content: data.prompt, role: 'user' },
        ]);
        setIsBotTyping(true);
        const promise = axios.post('/api/chat', {
            prompt: data.prompt,
            conversationId: conversationId,
        });
        const response = (await promise).data;
        console.log('response', response);
        setMessages((prev) => [
            ...prev,
            { content: response['output_text'], role: 'bot' },
        ]);
        setIsBotTyping(false);

        reset();
    };

    const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    return (
        <Fragment>
            <div className="flex flex-col gap-3">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`px-3 py-1 rounded-xl ${
                            message.role === 'user'
                                ? 'bg-blue-600 text-white self-end'
                                : 'bg-gray-100 text-black self-start'
                        }`}
                    >
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                ))}
                {isBotTyping && (
                    <div className="self-start flex gap-1 px-3 py-3 bg-gray-200 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]" />
                        <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]" />
                    </div>
                )}
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
