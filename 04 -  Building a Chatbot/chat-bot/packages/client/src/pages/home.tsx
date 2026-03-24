import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { Fragment, useMemo, useState, type KeyboardEvent } from 'react';
import axios from 'axios';

type FormData = {
    prompt: string;
};

const Home = () => {
    const { register, handleSubmit, reset, formState } = useForm<FormData>();
    const conversationId = useMemo(() => crypto.randomUUID(), []);
    const [messages, setMessages] = useState<string[]>([]);

    const onSubmit = async (data: FormData) => {
        console.log(data);
        setMessages((prev) => {
            const result = [...prev, data.prompt];
            return result;
        });
        const promise = axios.post('/api/chat', {
            prompt: data.prompt,
            conversationId: conversationId,
        });
        const response = (await promise).data;
        console.log('response', response);
        setMessages((prev) => {
            const result = [...prev, response['output_text']];
            return result;
        });

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
            <ul>
                {messages.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>

            <form
                className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
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
