import { createBrowserRouter } from 'react-router-dom';
import IndexPage from './pages/products/index';
import ShowPage from './pages/products/show';

const router = createBrowserRouter([
    {
        path: '/products',
        element: <IndexPage />,
    },
    {
        path: '/products/:id',
        element: <ShowPage />,
    },
]);

export default router;
