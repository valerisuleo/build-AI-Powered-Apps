/* eslint-disable react-hooks/immutability */
import axios from '@/lib/axios';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IoSparklesOutline } from 'react-icons/io5';
import type { IProduct, IReview } from './interfaces';
import NotFound from '@/components/custom/not-found';
import StarComponent from '@/components/custom/star';

const ShowPage = () => {
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();
    const [product, setProduct] = useState<IProduct>();
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);

    useEffect(() => {
        getReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getReviews(): Promise<void> {
        try {
            const response = await axios.get(`/api/products/${id}/reviews`);
            getProduct(response.data);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Something went wrong',
            );
        }
    }

    async function getSummary(): Promise<void> {
        const response = await axios.post(
            `/api/products/${id}/reviews/summarize`,
        );
        setSummary(response.data.summary);
    }

    const getProduct = (data: IReview[]) => {
        const updated = { ...state.product, reviews: data };
        setProduct(updated);

        console.log(updated);
    };

    if (error) return <NotFound message={error} />;

    return (
        <div className="flex flex-col gap-8 p-4">
            {/* Row 1: product info + photo */}
            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">{product?.name}</h1>
                    <p className="text-muted-foreground">
                        {product?.description}
                    </p>
                    <p className="font-semibold text-lg">${product?.price}</p>
                </div>
                <div className="bg-muted rounded-xl aspect-square flex items-center justify-center text-muted-foreground">
                    Photo placeholder
                </div>
            </div>

            {/* Row 2: reviews */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Reviews</h2>
                    <Button onClick={getSummary}>
                        <IoSparklesOutline />
                        Get Summary
                    </Button>
                </div>
                {summary && (
                    <p className="text-sm text-muted-foreground">{summary}</p>
                )}
                {product?.reviews?.map((review) => (
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
                ))}
            </div>
        </div>
    );
};

export default ShowPage;
