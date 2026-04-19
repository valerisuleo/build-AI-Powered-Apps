/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
import axios from '@/lib/axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [products, setProducts] = useState<IProduct[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getList();
    }, []);

    async function getList(): Promise<void> {
        try {
            const promise = axios.get('/api/products');
            const response = await promise;

            setProducts(response.data);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Something went wrong',
            );
        }
    }

    if (error) return <NotFound message={error} />;

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
