import axios from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import 'react-loading-skeleton/dist/skeleton.css';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { IProduct } from './interfaces';
import NotFound from '@/components/custom/not-found';

const IndexPage = () => {
    const navigate = useNavigate();

    const { data: products = [], error } = useQuery<IProduct[]>({
        queryKey: ['products'],
        queryFn: getList,
    });

    async function getList(): Promise<IProduct[]> {
        const response = await axios.get('/api/products');
        return response.data;
    }

    if (error) return <NotFound message={error.message} />;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {products.map((product) => (
                <div key={product.id}>
                    <Card
                        className="h-full cursor-pointer"
                        onClick={() =>
                            navigate(`/products/${product.id}`, {
                                state: { product },
                            })
                        }
                    >
                        <CardHeader>
                            <CardTitle>{product.name}</CardTitle>
                            <CardDescription>
                                {product.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="font-semibold">${product.price}</p>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
};

export default IndexPage;
