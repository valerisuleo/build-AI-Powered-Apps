/* eslint-disable react-hooks/immutability */
import axios from '@/lib/axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IoSparklesOutline } from 'react-icons/io5';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import type { IProduct } from './interfaces';
import NotFound from '@/components/custom/not-found';
import StarComponent from '@/components/custom/star';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ShowPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<IProduct>();
    const [error, setError] = useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);

    useEffect(() => {
        getProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getProduct(): Promise<void> {
        try {
            const response = await axios.get(`/api/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Something went wrong',
            );
        }
    }

    async function createSummary(): Promise<void> {
        setIsSummarizing(true);
        try {
            const response = await axios.post(
                `/api/products/${id}/reviews/summarize`,
            );
            setProduct((prev) => ({ ...prev!, summary: response.data.summary }));
        } finally {
            setIsSummarizing(false);
        }
    }

    if (error) return <NotFound message={error} />;

    return (
        <div className="flex flex-col gap-8 p-4">
            {/* Row 1: product info + photo */}
            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">
                        {product?.name ?? <Skeleton width="50%" />}
                    </h1>
                    <p className="text-muted-foreground">
                        {product?.description ?? <Skeleton count={2} />}
                    </p>
                    <p className="font-semibold text-lg">
                        {product?.price ? (
                            `$${product.price}`
                        ) : (
                            <Skeleton width="20%" />
                        )}
                    </p>
                </div>
                <div className="bg-muted rounded-xl aspect-square flex items-center justify-center text-muted-foreground">
                    Photo placeholder
                </div>
            </div>

            {/* Row 2: reviews */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <Button onClick={createSummary} disabled={isSummarizing}>
                        {isSummarizing ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                            <IoSparklesOutline />
                        )}
                        {isSummarizing ? 'Summarizing...' : 'Get Summary'}
                    </Button>
                </div>

                {product?.summary && (
                    <p className="text-sm text-muted-foreground">
                        {product.summary}
                    </p>
                )}
                <h2 className="text-xl font-semibold">Reviews</h2>

                {!product ? (
                    <div className="flex flex-col gap-5">
                        {[1, 2, 3].map((i) => (
                            <div key={i}>
                                <Skeleton width={150} />
                                <Skeleton width={100} />
                                <Skeleton count={2} />
                            </div>
                        ))}
                    </div>
                ) : (
                    product.reviews?.map((review) => (
                        <Card key={review.id}>
                            <CardHeader>
                                <CardTitle>{review.author}</CardTitle>
                                <StarComponent rating={review.rating} />
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {review.content}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default ShowPage;
