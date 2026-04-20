# Building the Reviews Frontend

> Connect the front end to the back end, display product reviews with star ratings and loading skeletons, handle errors gracefully, and integrate TanStack Query for caching and retries.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [TypeScript Interfaces](#2-typescript-interfaces)
3. [Axios Setup](#3-axios-setup)
4. [TanStack Query Setup](#4-tanstack-query-setup)
5. [Product List Page](#5-product-list-page)
6. [Product Detail Page](#6-product-detail-page)
7. [Star Ratings](#7-star-ratings)
8. [Loading Skeletons](#8-loading-skeletons)
9. [Error Handling](#9-error-handling)
10. [AI Summary Flow](#10-ai-summary-flow)

---

## 1. Project Structure

```
src/
├── components/
│   ├── custom/
│   │   ├── not-found.tsx        # Full-screen error message
│   │   ├── star.tsx             # Star rating display
│   │   ├── message-bubble.tsx   # (chatbot only)
│   │   └── typing-indicator.tsx # (chatbot only)
│   └── ui/                      # shadcn/ui primitives
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
├── lib/
│   └── axios.ts                 # Axios instance with error interceptor
├── pages/
│   ├── home.tsx                 # Chatbot UI (not routed for this project)
│   └── products/
│       ├── index.tsx            # Product listing page
│       ├── show.tsx             # Product detail + reviews + AI summary
│       └── interfaces.ts        # IProduct, IReview types
├── router.tsx                   # React Router config
├── main.tsx                     # App entry point + QueryClientProvider
└── App.tsx                      # RouterProvider root
```

---

## 2. TypeScript Interfaces

Define shared types in `pages/products/interfaces.ts`:

```ts
export interface IReview {
    id: number;
    author: string;
    rating: number;
    content: string;
    createdAt: string; // DateTime serialized as ISO string
    productId: number;
}

export interface IProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    reviews?: IReview[];
    summary?: string; // null when no valid cached summary exists
}
```

---

## 3. Axios Setup

Create a shared axios instance at `lib/axios.ts` with a response interceptor that normalises error messages before they reach components:

```ts
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
```

The interceptor ensures components always receive a plain `Error` with a readable message — no need to inspect `error.response` in every handler.

---

## 4. TanStack Query Setup

Install:

```bash
bun add @tanstack/react-query
```

Wrap the app in `main.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </StrictMode>,
);
```

---

## 5. Product List Page

`pages/products/index.tsx` fetches the product list using **TanStack Query**, giving automatic caching and retries with no manual `useState`/`useEffect`.

```tsx
import { useQuery } from '@tanstack/react-query';

const IndexPage = () => {
    const navigate = useNavigate();

    const { data: products = [], error } = useQuery<IProduct[]>({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await axios.get('/api/products');
            return response.data;
        },
    });

    if (error) return <NotFound message={error.message} />;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {products.map((product) => (
                <Card
                    key={product.id}
                    className="h-full cursor-pointer"
                    onClick={() => navigate(`/products/${product.id}`, { state: { product } })}
                >
                    <CardHeader>
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold">${product.price}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
```

**What TanStack Query provides here:**
- ✅ Automatic retries on failure (3 attempts by default)
- ✅ Cached result — navigating away and back skips the network call
- ✅ No manual loading/error state boilerplate

---

## 6. Product Detail Page

`pages/products/show.tsx` fetches a single product (including its reviews and any cached summary) using plain `useState` + `useEffect`. This keeps the summary mutation logic self-contained in the same component.

```tsx
const ShowPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<IProduct>();
    const [error, setError] = useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);

    useEffect(() => {
        getProduct();
    }, []);

    async function getProduct(): Promise<void> {
        try {
            const response = await axios.get(`/api/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong');
        }
    }
    // ...
};
```

> The `GET /api/products/:id` endpoint returns `{ ...product, reviews, summary }` in one shot — the summary field is `null` if no valid cache exists on the server.

---

## 7. Star Ratings

`components/custom/star.tsx` renders a row of filled/empty star icons using `react-icons`:

```tsx
import { FaStar, FaRegStar } from 'react-icons/fa';

const StarComponent = ({ rating }: { rating: number }) => {
    return (
        <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) =>
                i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
            )}
        </div>
    );
};
```

Used in `ShowPage` inside each review card:

```tsx
<StarComponent rating={review.rating} />
```

| Input | Result |
|-------|--------|
| `0` | No filled stars |
| `3` | Three filled, two empty |
| `5` | All filled |

---

## 8. Loading Skeletons

Install [react-loading-skeleton](https://github.com/dvtng/react-loading-skeleton):

```bash
bun add react-loading-skeleton
```

Import the CSS once at the top of the page file:

```ts
import 'react-loading-skeleton/dist/skeleton.css';
```

In `ShowPage`, `product` is `undefined` until the fetch resolves. Use that as the loading condition:

```tsx
// Product info (name, description, price)
{product?.name ?? <Skeleton width="50%" />}
{product?.description ?? <Skeleton count={2} />}
{product?.price ? `$${product.price}` : <Skeleton width="20%" />}

// Reviews list
{!product ? (
    <div className="flex flex-col gap-5">
        {[1, 2, 3].map((i) => (
            <div key={i}>
                <Skeleton width={150} />  {/* author */}
                <Skeleton width={100} />  {/* rating */}
                <Skeleton count={2} />    {/* content */}
            </div>
        ))}
    </div>
) : (
    product.reviews?.map((review) => /* ... */)
)}
```

> **Tip:** Use Chrome DevTools → Network → Slow 4G throttling to see skeletons in action.

---

## 9. Error Handling

### Page-level errors

If the product fetch fails, `ShowPage` renders the `NotFound` component:

```tsx
const NotFound = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-bold text-center">{message}</p>
    </div>
);

// In ShowPage:
if (error) return <NotFound message={error} />;
```

### Axios interceptor

The shared axios instance (`lib/axios.ts`) normalises all API errors into a plain `Error` before they reach components, so every `catch` block only needs to handle `error instanceof Error`.

---

## 10. AI Summary Flow

The summary feature has two modes:

| Scenario | Behaviour |
|---|---|
| Cached summary exists on server | Returned in the initial `GET /api/products/:id` response; shown immediately |
| No cached summary | `summary` is `null`; user presses "Get Summary" to generate one |

### Generating a summary

```tsx
async function createSummary(): Promise<void> {
    setIsSummarizing(true);
    try {
        const response = await axios.post(`/api/products/${id}/reviews/summarize`);
        setProduct((prev) => ({ ...prev!, summary: response.data.summary }));
    } finally {
        setIsSummarizing(false);
    }
}
```

- `POST /api/products/:id/reviews/summarize` calls the LLM, stores the result with a 7-day TTL, and returns `{ summary: string }`.
- On success, the local `product` state is patched with the new summary — no page refresh needed.

### Button with loading state

```tsx
<Button onClick={createSummary} disabled={isSummarizing}>
    {isSummarizing
        ? <AiOutlineLoading3Quarters className="animate-spin" />
        : <IoSparklesOutline />
    }
    {isSummarizing ? 'Summarizing...' : 'Get Summary'}
</Button>
```

- `disabled={isSummarizing}` prevents duplicate submissions while the LLM call is in flight.
- The spinner replaces the sparkle icon to give clear visual feedback.

### Summary display

```tsx
{product?.summary && (
    <p className="text-sm text-muted-foreground">{product.summary}</p>
)}
```

The summary renders above the reviews list whenever `product.summary` is truthy — whether it arrived from the initial fetch or was just generated.

---

## Complete State Overview (`ShowPage`)

| Variable | Type | Purpose |
|---|---|---|
| `product` | `IProduct \| undefined` | Full product data incl. reviews and summary |
| `error` | `string \| null` | Error message from the product fetch |
| `isSummarizing` | `boolean` | Spinner/disabled state during summary POST |

### Key decisions

- **TanStack Query** is used for the product list (repeated navigations benefit from caching).
- **Local state** is used for the product detail (one product per page load; summary mutation is simpler to co-locate).
- **Axios interceptor** normalises errors globally so components stay clean.
- **`disabled={isSummarizing}`** prevents duplicate LLM calls during an in-flight request.
- **Patch pattern** (`setProduct(prev => ({ ...prev!, summary }))`) avoids a full re-fetch after summary generation.
