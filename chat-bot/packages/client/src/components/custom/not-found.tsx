const NotFound = ({ message }: { message: string }) => {
    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-2xl font-bold text-center">{message}</p>
        </div>
    );
};

export default NotFound;
