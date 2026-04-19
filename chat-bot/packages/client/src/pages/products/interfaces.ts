export interface IReview {
    id: number;
    author: string;
    rating: number;
    content: string;
    createdAt: string;
    productId: number;
}

export interface IProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    reviews?: IReview[];
}
