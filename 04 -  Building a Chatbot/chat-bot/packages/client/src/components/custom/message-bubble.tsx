import { type ReactNode } from 'react';

type MessageBubbleProps = {
    role: 'user' | 'bot';
    children: ReactNode;
};

export const MessageBubble = ({ role, children }: MessageBubbleProps) => {
    return (
        <div
            className={`px-3 py-1 rounded-xl ${
                role === 'user'
                    ? 'bg-blue-600 text-white self-end'
                    : 'bg-gray-100 text-black self-start'
            }`}
        >
            {children}
        </div>
    );
};
