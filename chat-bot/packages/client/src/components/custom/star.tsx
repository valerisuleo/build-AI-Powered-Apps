import { FaStar, FaRegStar } from 'react-icons/fa';

const StarComponent = ({ rating }: { rating: number }) => {
    return (
        <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) =>
                i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />,
            )}
        </div>
    );
};

export default StarComponent;
