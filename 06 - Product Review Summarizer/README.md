# Product Review Summarizer

We’re going to build a product review summarizer.

On this page, we have the reviews for a given product, and this button for summarizing the reviews. 

1. With this, the user can click this button to quickly generate a summary of the reviews so they don’t have to read every single review.
2. Now, once we have the summary, if you come back to this page, the summary is retrieved from the database, so it doesn’t have to be regenerated.


## Setting up the database

Before we start building our API, we need to set up a database to store our:

* products
* reviews
* summaries

For this project, we’ll be using **MySQL**.

go to the MySQL website and download MySQL Community Server for your operating system.

For Mac, make sure you choose the right package based on your CPU architecture:

* ARM
* x86 for Intel CPUs

During installation, there is one important part you need to pay attention to:

You have to enter a password for the root user, which is the admin user.

Whatever you use, make sure to remember it, because we’re going to use that in our application.


## Verifying the MySQL installation

To verify that MySQL is installed properly, open up a terminal window and run:

```
mysql -u root -p
```

Press Enter, and then enter the password you created for logging into MySQL.

If everything works, that verifies that MySQL is installed properly on your machine.

To get out of the MySQL shell, type:

```
quit
```

So MySQL is installed.

Next, we’re going to set up Prisma.




## Configuring the database connection with Prisma

Now that we have MySQL running, it’s time to connect our application to the database.

For that, we’ll be using Prisma.

Prisma is what we call an ORM, or Object-Relational Mapping tool. It’s a tool that sits between our application and the database.

You can think of it like a translator. It helps our application talk to the database in a clean and type-safe way.

So back to our project, open the terminal window pointing to the server directory.

There are two packages we need to install here:

* one is a development dependency
* the other is a runtime dependency

First, let’s install Prisma:

```
bun add -d prisma
```

This is the CLI, or command line interface, we’ll use to create and manage the schema, or shape, of our database.

Next, we should install the Prisma client:

```
bun add @prisma/client
```

This is the client that we’ll use in our code to talk to the database.

Now we need to initialize Prisma in this directory. For that, we run:

```
bunx prisma init
```

Now look. Here in the server directory, we have a new directory called prisma, where we have a schema. Let’s open this file.

Here we have two sections:

* one defines the client
* the other defines the database

First, we should change the provider from Postgres to MySQL.

```
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

Now look at the URL. The URL is set to an environment variable called DATABASE_URL.

So let’s copy this key.

Next, we go to our .env file.

Now, Prisma has added this line. This is a bug with the current version of Prisma I’m using. It shouldn’t be like this. So let’s delete these lines and instead paste the key that we copied.

We’re going to set this URL to:

* mysql://
* then the username, that is root
* followed by :
* and then the password we used to log into MySQL
* then an @ sign
* followed by the name of the server, which is localhost
* followed by :
* and the port
* then a /
* and the name of our database

The default port is 3306.

Let’s call the database review_summarizer.

So the connection string should look like this:

```
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/review_summarizer"
```

With this, we’re telling Prisma to connect to our local MySQL server using:

* the root username
* our password
* and the review_summarizer database

We’re done with this lesson.




## Defining the Prisma schema

In this lesson, I’m going to define our Prisma schema, which is how we describe the structure of our database directly inside our codebase.

Back to our project, let’s open schema.prisma.

In this file, we’re going to define three models:

* Product
* Review
* Summary

### Defining the Product model

First, we type:

```
model Product {
}
```

Note that here, I’m using the Pascal naming convention, so the first letter of this word should be uppercase.

Now, inside braces, we define the fields of this model.

Each product should have a bunch of fields like:

* id
* name
* description
* price

So first, we define the id field:

```
id Int @id @default(autoincrement())
```

Here:

* Int means integer
* @id marks this as an ID, or a primary key column in the database
* @default(autoincrement()) tells the database to automatically assign and increment the ID when we store a product

So the database will automatically increment the ID like 1, 2, 3, 4, and so on.

Next, we define the name field, which is a string:

```
name String
```

Then we add description, which is also a string:

```
description String?
```

We can make this optional by appending a question mark.

Next, we add price, which is a float:

```
price Float
```

So our Product model looks like this:

```
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
}
```

Now, we can add additional fields here, but this is a good starting point.


### Defining the Review model

Now let’s move on and define the Review model.

```
model Review {
}
```

What fields do we need here?

Just like the product, we need to uniquely identify each review.

So we have:

```
id Int @id @default(autoincrement())
```

Next, we have author, or the person who wrote this review:

```
author String
```

Then we have rating, which is an integer:

```
rating Int
```

Next, we have content, which is a string:

```
content String
```

And finally, createdAt, which is a datetime:

```
createdAt DateTime @default(now())
```

With @default(now()), when we insert a review in the database, the database will automatically store the current datetime in this field.

So far, the model looks like this:

```
model Review {
  id        Int      @id @default(autoincrement())
  author    String
  rating    Int
  content   String
  createdAt DateTime @default(now())
}
```


### Creating the relationship between Review and Product

Now we need to create a relationship between these two models.

Each review is for a particular product, right?

So here we add another field:

```
productId Int
```

We also add a product field to connect a review to a particular product object:

```
product Product @relation(fields: [productId], references: [id])
```

This means that the productId field in this model references the id field in the Product model.

So now the Review model becomes:

```
model Review {
  id        Int      @id @default(autoincrement())
  author    String
  rating    Int
  content   String
  createdAt DateTime @default(now())
  productId Int
  product   Product  @relation(fields: [productId], references: [id])
}
```

At this point, Prisma gives us an error because we haven’t created the opposite relationship.

So whenever we create a relationship, we should create it in both models.

We go back to the Product model and say that each product has a field called reviews, which is a review array:

```
reviews Review[]
```

So now the Product model becomes:

```
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  reviews     Review[]
}
```

Now the error is gone.


### Defining the Summary model

Now we need a model for storing the summaries that we generate using a language model.

The Summary model should have these fields:

* id
* productId
* product
* content
* generatedAt
* expiresAt

So let’s define it.

First, the ID field:

```
id Int @id @default(autoincrement())
```

Next, productId, which is an integer:

```
productId Int
```

Next, product, which is a Product instance:

```
product Product @relation(fields: [productId], references: [id])
```

So far:

```
model Summary {
  id        Int     @id @default(autoincrement())
  productId Int
  product   Product @relation(fields: [productId], references: [id])
}
```

Now here we get an error because we haven’t defined the opposite relationship.

So we go to the Product model and add a new field:

```
summary Summary?
```

We have to make this optional because not every product is going to have a summary.

We could have a product without any reviews, so summary should be optional.

Now we still have another error:

> a one-to-one relation must use unique fields on the defining side

Because each summary is for a particular product, and we cannot have multiple summaries here, we should apply the @unique attribute to productId.

So we change it to:

```
productId Int @unique
```

Next, we add the content field:

```
content String
```

Then we add generatedAt, which should be a datetime with a default value using now():

```
generatedAt DateTime @default(now())
```

And finally, expiresAt, which should also be a datetime:

```
expiresAt DateTime
```

We’re not going to assign this a default value. We’re going to calculate this dynamically in code when storing a summary.

### Final schema

So now our full schema looks like this:

```
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  reviews     Review[]
  summary     Summary?
}

model Review {
  id        Int      @id @default(autoincrement())
  author    String
  rating    Int
  content   String
  createdAt DateTime @default(now())
  productId Int
  product   Product  @relation(fields: [productId], references: [id])
}

model Summary {
  id          Int      @id @default(autoincrement())
  productId   Int      @unique
  product     Product  @relation(fields: [productId], references: [id])
  content     String
  generatedAt DateTime @default(now())
  expiresAt   DateTime
}
```



## Creating the database tables with Prisma migrations

Now that we have defined our Prisma schema, we are ready to create the actual database tables based on that schema.

To do that, we’re going to use the Prisma CLI to create a migration.

A migration is a way to create or update our database tables and keep them in sync with our codebase.

So open the terminal window, point it to the server directory, and run:

```
bunx prisma migrate dev
```

We are telling the Prisma CLI to create a migration.

Let’s go ahead.

If everything works, Prisma will tell us that the MySQL database review_summarizer was created at localhost.

So Prisma CLI automatically created our database for us.

Now it’s asking for a name for this new migration.

Because this is the first migration, we’re going to call this `init`.

> !!! As we go forward, **anytime** we modify our Prisma schema file, anytime we modify our models, we’re going to create a new migration and give it a proper descriptive name, the same way we use Git commits.


### The migrations directory

Once the migration is created, we get a new directory called migrations.

Inside the prisma directory, we now have something like this:

```
prisma/
  migrations/
    2025..._init/
      migration.sql
```

So inside migrations, we have another directory that includes:

* a date timestamp
* the name of the migration

In this directory, we have a migration file, which is just a raw SQL file that contains instructions for creating or updating our database tables.

In this case, we have CREATE TABLE statements for creating:

* product
* review
* summary

This is based exactly on our Prisma schema.

So Prisma takes our models and turns them into actual SQL instructions for the database.


### Selecting the database

At this point, we still may not see our database because we haven’t selected it yet.

So we select review_summarizer.

Now we can see the database used by our application.

Inside this database, we have **four tables**:

* product
* review
* summary
* `_prisma_migrations`



### The `_prisma_migrations` table

The `_prisma_migrations` table is used internally by Prisma to keep track of the migrations that have been run on this database.

If we inspect it, we can see things like:

* the ID of the migration
* a checksum
* when the migration finished
* the migration name

The checksum is a long string computed from the content of the migration file.

This is used for validation.

So if you accidentally modify the content of a migration file later, Prisma CLI will complain.

> You should never touch this table.

It’s used internally by Prisma CLI to keep track of the migrations that have been run.

### Looking at the generated tables

We also have the three application tables:

* product
* review
* summary


Now let’s have a quick look at the product table.

In this table, we have four columns:

* id
* name
* description
* price

Now look at the type of the name column.

It is:

```
VARCHAR(191)
```

What is this?

Well, varchar is short for variable character.

It’s essentially a variable-length string, and the length of that string can be a maximum of 191 characters.

This is the default value that Prisma uses for MySQL databases.

Now, 191 is kind of weird. In most modern applications, we use more standardized lengths for strings.

For example, for something like a product name, we often use:

```
VARCHAR(255)
```


## Refining the Prisma schema
You’ll notice that the String type is automatically mapped to VARCHAR(191) in MySQL.

But here, you can override the type using the `@db` attribute.

### Product model

For the *name* field, we can change it to VARCHAR(255):

```
name String @db.VarChar(255)
```

For *description*, we can use a larger type.

We can use VARCHAR(1000), but Text gives us more storage, so let’s use Text:

```
description String? @db.Text
```


The second thing we’re going to improve is the name of our tables.

I told you that a lot of people don’t like to use the Pascal naming convention for their tables, but here you can easily override the table name using the @@map attribute.

So in the Product model, we add:

```
@@map("products")
```

This maps the Product model to a table called products, all in lowercase.


### Review model

- For *author*, we’re going to use VARCHAR(255):

	```
	author String @db.VarChar(255)
	```

- For *rating*, we don’t need to use a regular integer, because with integers we can store values up to 2 billion. But here we just need to store 1, 2, 3, 4, or 5. So the smallest numeric type that we can use is TinyInt:

	```
	rating Int @db.TinyInt
	```


- For content, again, we can use Text:

	```
	content String @db.Text
	```


### Summary model

For the *content* field, let’s use Text as well:

```
content String @db.Text
```


### Updated schema

So now our schema looks like this:

```
model Product {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(255)
  description String?  @db.Text
  price       Float
  reviews     Review[]
  summary     Summary?

  @@map("products")
}

model Review {
  id        Int      @id @default(autoincrement())
  author    String   @db.VarChar(255)
  rating    Int      @db.TinyInt
  content   String   @db.Text
  createdAt DateTime @default(now())
  productId Int
  product   Product  @relation(fields: [productId], references: [id])

  @@map("reviews")
}

model Summary {
  id          Int      @id @default(autoincrement())
  productId   Int      @unique
  product     Product  @relation(fields: [productId], references: [id])
  content     String   @db.Text
  generatedAt DateTime @default(now())
  expiresAt   DateTime

  @@map("summaries")
}
```

## Creating a new migration

Now we should create a new migration and apply it to our database.

Back in the terminal, here in the server directory, let’s run:

```
bunx prisma migrate dev
```

It’s asking for a name for the new migration.

Let’s call that:

```
refine-schema
```


### What Prisma generates ?

Now back to our project, here in the migrations directory, we have a new directory which again has a timestamp.

This is the name of our migration, refine-schema.

Inside, we have another migration file with instructions for updating our tables.


### Verifying the changes in the database

Now back to our database, let’s refresh.

Look, table names are changed.

If you inspect the products table, you can see that:

* the type of the name column is changed to VARCHAR(255)
* the description column is changed to TEXT

Great.

Now, if you look at the migrations table, you can see that the second migration is applied as well.


## Populating the database with sample data

We can use AI to help us generate this data. We’re going to write a prompt like this:

```
Here's my Prisma schema.

[paste your Prisma schema here]

Generate a complete SQL script to populate the products and reviews tables in a MySQL database based on the schema above.

- Create 5 products
- For each product, insert 5 realistic customer reviews
- Make sure each review is long and tailored to the product type
- Do not include data for the summaries table
- Output only the SQL script, no comments or explanations
```




Now let’s take a look at the database.

In the products table, we should have five realistic products.

In the reviews table, we should have 25 reviews, five for each product.

Beautiful.

So now we have some realistic data.

We are ready to start building the backend.



## Building our first API endpoint

Now that our database is ready, we’re ready to build the backend of our application.

We’ll create a couple of endpoints for fetching and summarizing reviews.


### Adding the route

Here in the server application, let’s open routes.ts.

Here we remove all our routes in this module.

Then we add a new route:

```
router.get('/api/products/:id/reviews', async (req: Request, res: Response) => {
});
```

So the path is:

```
/api/products/:id/reviews
```


### Creating a Prisma client

In this route handler, we’re going to use Prisma to fetch all the reviews for a particular product.

So first, we create a new Prisma client object.

```
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
```

This Prisma client gets regenerated every time we modify our Prisma schema and create a new migration.

So anytime we go to the Prisma schema, make changes, and create a new migration, Prisma CLI automatically regenerates this client.


### Reading the product ID from the URL

Next, we should read the product ID from the URL.

```
const productId = Number(req.params.id);
```


It’s a string, so we have to convert it to a number.

At first, we want to focus on the happy path.

We want to assume that productId is a valid number.


## Fetching reviews with Prisma

Now we’re going to use Prisma to fetch all the reviews for this product.

We call prisma.review.findMany() and pass it an object to customize the query.

```
const reviews = await prisma.review.findMany({
  where: {
    productId,
  },
  orderBy: {
    createdAt: 'desc',
  },
});
```

Here:

* where filters reviews by productId
* orderBy sorts them by createdAt in descending order

So Prisma will generate a SQL query similar to this:

```
SELECT * FROM reviews
WHERE productId = ?
ORDER BY createdAt DESC;
```

This is the benefit of using an ORM like Prisma.

We don’t have to write raw SQL statements.

We work with objects in our application and let the ORM generate the actual SQL queries.

That said, this is not a silver bullet.

It doesn’t mean you don’t need to learn SQL.

This approach works well for simple scenarios, but in more complex cases, you still have to write SQL queries by hand.


### Returning the reviews

findMany() returns a promise, so we have to await it.

Because we’re using await, we mark the route handler as async.

Once we get the reviews, we can return them in the response:

```
res.json(reviews);
```

So the full implementation looks like this:

```
import express, { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/api/products/:id/reviews', async (req: Request, res: Response) => {
  const productId = Number(req.params.id);

  const reviews = await prisma.review.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json(reviews);
});

export default router;
```

### Handling invalid product IDs

Now what if we include a non-numeric value, like a?

```
http://localhost:3000/api/products/a/reviews
```

We get a 500 error, which is an internal server error.

That’s something we should avoid, because that basically means our backend crashed.

So here we have to validate the productId and do something if it’s not a valid number.

Right after converting the route parameter, we add this check:

```
if (isNaN(productId)) {
  res.status(400).json({ error: 'Invalid product ID' });
  return;
}
```

Now the route becomes:

```
import express, { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/api/products/:id/reviews', async (req: Request, res: Response) => {
  const productId = Number(req.params.id);

  if (isNaN(productId)) {
    res.status(400).json({ error: 'Invalid product ID' });
    return;
  }

  const reviews = await prisma.review.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json(reviews);
});

export default router;
```

## Creating the endpoint for summarizing reviews

All right, now I’m going to create a new endpoint for summarizing the reviews for a given product.

Let’s start by going to our routes module.

```
router.post('/api/products/:id/reviews/summarize', reviewController.summarizeReviews);
```

### Adding the controller method

Now for our request handler, we have to create a new method in our review controller.

So let’s go to that module and define a new method.

This is going to be async.

```
async summarizeReviews(req: Request, res: Response) {
}
```

Just like before, first we have to read the productId and validate it.



Now, instead of returning a raw string, it’s nicer to wrap it in an object.

So we return:

```
{
  "summary": "..."
}
```

That’s better than simply returning a string.



### Fetching the latest reviews

In this method, first we have to get the last 10 reviews.

>Why are we using 10?

 Because over time, these reviews are going to add up. We might end up with thousands of reviews. We don’t want to send all of those to the language model because:

* that increases the context window
* the most recent reviews probably better reflect the current quality of the product

So we’re going to pick the latest 10 reviews.

To do that, we ask our repository.

```
const reviews = await reviewRepository.getReviews(productId, 10);
```


### Joining the reviews into one string

After fetching the reviews, we’re going to join them into one long string.

Eventually, this is what we’re going to send to the language model.

So first, we map each review object to its content.

Then we join them using two line breaks as a separator.

```
const joinedReviews = reviews
  .map((r) => r.content)
  .join('\n\n');
```

This gives us one properly formatted string containing all the selected reviews.

### Returning a placeholder summary

In the next lesson, we’re going to send joinedReviews to the language model.

But in this lesson, we’re just going to hardcode a summary and return it to the client.

We just want to build the endpoint, test it, make sure all the moving parts are there, and then come back and implement the actual summarization.

So for now:

```
async summarizeReviews(productId: number): Promise<string> {
  const reviews = await reviewRepository.getReviews(productId, 10);

  const joinedReviews = reviews
    .map((r) => r.content)
    .join('\n\n');

  const summary = 'This is a placeholder summary.';

  return summary;
}
```


### Testing the endpoint

Now let’s test our implementation.

In Postman, send a POST request to:

```
http://localhost:3000/api/products/1/reviews/summarize
```

If everything works, we get:

```
{
  "summary": "This is a placeholder summary."
}
```

## Summarizing reviews with a language model

we’re going to send this to a language model for summarization.


### Building the prompt

Once we have the joined reviews, then we create a prompt.

```
const prompt = `Summarize the following customer reviews into a short paragraph, highlighting key themes, both positive and negative.

${joinedReviews}`;
```

For the prompt, we’re going to say:

* summarize the following customer reviews into a short paragraph
* highlight key themes
* include both positive and negative points


### Calling the model

Once we have the prompt, then we’re going to use our client to create the summary.

```
const response = await client.responses.create({
  model: 'gpt-4.1',
  input: prompt,
  temperature: 0.2,
  max_output_tokens: 500,
});
```


Now we can return response.outputText as the summary.

So we remove the hard-coded placeholder summary and replace it with this:

```
return response.outputText;
```



## Refactoring the prompt

Currently, our prompt is in the middle of the code.

It’s not terribly bad because our prompt is only two lines, but as our prompts get more complex, we really want to separate them from the actual code.


Here in the prompts directory, let’s add a new file called:

```
summarize-reviews.txt
```

Next, we go to our review service and grab our prompt, cut it, and paste it here.

Let’s reformat this.

We just need to replace joinedReviews with a placeholder.

Earlier we used double braces for placeholders, and we’re going to follow the same pattern here.

We can call this placeholder reviews.

So our prompt file becomes:

```
Summarize the following customer reviews into a short paragraph, highlighting key themes, both positive and negative.

{{reviews}}
```


we’re going to import the template from the prompts directory.

```
import template from '../prompts/summarize-reviews.txt';
```

Next, we create our prompt.

By using our template, we just have to replace our placeholder, which is reviews, with joinedReviews.

Quite simple as that.

```
const prompt = template.replace('{{reviews}}', joinedReviews);
```


## Storing the summary in the database

Right now, we are generating the summary every time the API is called. That is **slow** and **expensive**, because every time we generate the summary, we’re paying for it.

> **We’re using tokens every time!**

So we’re going to store the summary in our database.
With this, we only generate it once, and the next time someone views a product, we can show the cached version.


## Adding a method for storing summaries

Right now, we have a single method for getting reviews.
Now let’s add another method for storing the summary.

```
storeReviewSummary(productId: number, summary: string) {
}
```

In this method, we use Prisma.


### Using `upsert(...)`

In our new method, we call:

```
prisma.summary.upsert(...)
```

upsert is like a combination of insert and update.

- If the record does not exist, it inserts it.
- If it already exists, it updates it.

When calling this method, we need to provide an object with three properties:

```
prisma.summary.upsert({
        where: { productId },
        create: { productId, content: summary, expiresAt },
        update: { content: summary, generatedAt: new Date(), expiresAt },
    });
```

The `where` prop tells Prisma which record we want to insert or update.

Here, we identify the record by productId.


### Adding expiration logic with


For expiresAt, we need to do some date computation.
For that, we’re going to use dayjs.


```
bun add dayjs
```

Then import it at the top of the repository:


```
const expiresAt = dayjs().add(7, 'days').toDate();
```

Here we’re adding 7 days to the current date.

That value is arbitrary.

The actual number should depend on the business requirements.




## Reusing a cached summary unless it is expired

In the last lesson, I told you that we are still regenerating the summary every time the API is called.

What we need to do is generate the summary only if:

* it doesn’t exist
* or it is expired

To do that, first we have to know if there is an existing summary for a given product.

```
async function getCachedSummary(productId: number) {
    return prisma.summary.findFirst({
        where: {
            productId,
            expiresAt: { gt: new Date() }, // only a non-expired  row is ever returned
        },
    });
}
```
## Updated service flow

So now the logic becomes:

1. Check if a summary already exists
2. If it exists and is not expired, return it immediately
3. Otherwise, fetch reviews, generate a new summary, store it, and return it

⠀
Here is what that looks like:

```
async function getCachedSummary(productId: number) {
    return prisma.summary.findFirst({
        where: {
            productId,
            expiresAt: { gt: new Date() }, // only a non-expired  row is ever returned
        },
    });
}

async function storeReviewSummary(productId: number, summary: string) {
    const now = new Date();
    const expiresAt = dayjs().add(7, 'day').toDate();

    return prisma.summary.upsert({
        where: { productId },
        create: { productId, content: summary, expiresAt },
        update: { content: summary, generatedAt: now, expiresAt },
    });
}

async function createRoute(req: Request, res: Response, next: NextFunction) {
    const productId = Number(req.params.id);
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) return res.notFound();

        const cached = await getCachedSummary(productId);
        if (cached) return res.json({ summary: cached.content });

        const reviews = await getReviews(productId, 10);
        const joinedReviews = reviews.map((r) => r.content).join('\n\n');
        const summary = await Summary.create(joinedReviews);
        await storeReviewSummary(productId, summary);
        res.json({ summary });
    } catch (error) {
        next(error);
    }
}
```


## Handling edge cases for review summaries

So we’re successfully generating summaries, but as developer, **we should always think about edge cases**.

- What if the product ID passed in the URL is not a numeric value?
- What if the product ID is numeric, but it’s not a valid product?
- What if it doesn’t exist in the database?
- What if you have a valid product, but you don’t have any reviews to summarize?

```
async function createRoute(req: Request, res: Response, next: NextFunction) {
    const productId = Number(req.params.id);
    try {
        if (isNaN(productId)) return res.badRequest('Invalid product ID');

        const product = await prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) return res.notFound();

        const cached = await getCachedSummary(productId);
        if (cached) return res.json({ summary: cached.content });

        const reviews = await getReviews(productId, 10);
        if (reviews.length === 0) return res.badRequest('No reviews to summarize');
        const joinedReviews = reviews.map((r) => r.content).join('\n\n');
        const summary = await Summary.create(joinedReviews);
        await storeReviewSummary(productId, summary);
        res.json({ summary });
    } catch (error) {
        next(error);
    }
}
```