import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { type KeyboardEvent } from 'react';

type FormData = {
    prompt: string;
};

const Home = () => {
    const { register, handleSubmit, reset, formState } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        console.log(data);
        reset();
    };

    const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    return (
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
    );
};

export default Home;
