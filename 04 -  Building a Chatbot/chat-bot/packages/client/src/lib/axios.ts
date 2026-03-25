import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'Failed to send message';
            return Promise.reject(new Error(message));
        }
        return Promise.reject(
            new Error('Sorry, something went wrong. Please try again.')
        );
    }
);

export default axiosInstance;
