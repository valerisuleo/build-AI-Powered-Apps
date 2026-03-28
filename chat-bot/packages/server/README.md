# Building a chatbot backend

In this section we’ll start by building the **backend** for our chatbot.

we’ll create a basic API that:

* receives a message
* returns a response from an AI model

To get started, first we open a new terminal window, go to `packages/server`, and install OpenAI.

```bash
cd packages/server
bun add openai
```

## Creating the OpenAI client

Next, we go into `index.ts` in our server application.

On the top, first we import `OpenAI` from `openai`.

Once we run `dotenv.config()`, we create a new instance of `OpenAI` with our API key.

So we declare a constant called `client` and set it to a new `OpenAI` instance. Here we set `apiKey` to `process.env.OPENAI_API_KEY`.

```ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

### Defining the chat endpoint

Next, we define a new endpoint for receiving prompts from the user.

So we call `app.post()`.

In this case, we’re not going to use `get`, because we are not just getting information. We’re submitting data to the server, so we need an HTTP `POST` request.

For the path, we go with:

```ts
'/api/chat'
```

Then we add `request` and `response` as parameters.

Inside this function, the first step is to grab the user’s prompt from the request.

The `request` object has a `body` property. Let’s say the object we send to the server has a property called `prompt`.

The cleaner way to read it is with destructuring:

```ts
const { prompt } = request.body;
```

That’s cleaner than accessing `request.body.prompt` directly.

### Sending the prompt to OpenAI

Next, we send this to OpenAI.

We call `client.responses.create()` and pass it an object.

First, we set the model.

For a chatbot, we can go with one of the cost-optimized models, because we want a smaller model that can respond quickly. We don’t need reasoning here, and we don’t need to solve complex multi-step problems.

So we set the model to:

```ts
'gpt-4o-mini'
```

Next, we set `input` to the user’s prompt.

It’s also good to set the temperature.

In a chatbot, responses should be accurate and consistent. We don’t need a lot of creativity here, so we should stick with a lower temperature, somewhere between `0.2` and `0.4`.

I’m going to go with `0.2`, but we can always adjust this later.

It’s also good to set `max_output_tokens`. Otherwise, responses may become too long, and in a chat application we usually want relatively short answers.

I’m going to set this to `100`.

Since we are using `await`, we also need to mark the route handler as `async`.

So the endpoint looks like this:

```ts
app.post('/api/chat', async (request: Request, response: Response) => {
  const { prompt } = request.body;

  const result = await client.responses.create({
    model: 'gpt-4o-mini',
    input: prompt,
    temperature: 0.2,
    max_output_tokens: 100,
  });

  response.json({
    message: result.output_text,
  });
});
```

### Enabling JSON parsing in Express

We’re almost done, but there is one important step missing.

In this function, we are extracting `prompt` from `request.body`. By default, this is not going to work unless we tell Express to automatically parse JSON objects from the request body.

The way we do that is by adding a middleware function.

Right after creating the app, we call:

```ts
app.use(express.json());
```

So now the setup becomes:

```ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

This middleware runs before the request reaches our handler. It parses the JSON body and stores the result in `request.body`.

Without it, `request.body` will be `undefined`.

More generally, in an Express application we can have one or more middleware functions, and these can be used for things like:

* parsing request data
* enforcing security rules
* logging
* authentication

Here we’re using middleware specifically to parse JSON.

### Full version so far

So the full file at this point looks like this:

```ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', async (request: Request, response: Response) => {
  const { prompt } = request.body;

  const result = await client.responses.create({
    model: 'gpt-4o-mini',
    input: prompt,
    temperature: 0.2,
    max_output_tokens: 100,
  });

  response.json({
    message: result.output_text,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

### Result

At this point, we have:

* installed the OpenAI SDK
* created an OpenAI client with our API key
* added a new `POST /api/chat` endpoint
* extracted the user’s prompt from `request.body`
* sent that prompt to the model
* configured the model, temperature, and max output tokens
* returned the AI response as JSON
* added `express.json()` so the request body is parsed correctly

## Testing the chat endpoint with Postman

All right, now to test our API endpoint, let’s go to the **Extensions** panel and search for **Postman**.

This is a very useful extension for testing API endpoints. It’s also available as a standalone application. In the past, I used to use the application, but recently I’ve been using the extension more. It’s kind of more convenient.

So let’s go ahead and install it.

Once you do this, go to the **Command Palette**. You can find it under the **View** menu.

The shortcut is:

* `Shift + Command + P` on Mac
* probably `Shift + Control + P` on Windows

Here, search for:

```text
Show Postman
```

You get this panel.

The first time, you have to create an account and sign in. I know it’s a pain in the neck, but trust me, it’s completely worth it. It only takes a minute.

With this, we can save our HTTP requests in our account and share them across different machines, so we don’t have to recreate them every time. We can also share requests with other members of the team.

### Sending the first request

We’re going to create a new HTTP request.

We send a `POST` request to:

```text
http://localhost:3000/api/chat
```

Next, we go to the **Body** tab, select **raw** for the type of data we want to send, and from the dropdown list we select **JSON**.

Now here we add a JSON object to send to the server:

```json
{
  "prompt": "What is the capital of France?"
}
```

Let’s send this request.

All right, we got a response with a status of `200`.

If we look at the response, we get:

```json
{
  "message": "The capital of France is Paris."
}
```

Beautiful. So our API is working.

### The memory problem

Now let’s move on.

Right now, our chatbot doesn’t have memory.

So if we ask a follow-up question, it doesn’t remember our previous questions.

For example, if we change the prompt to:

```json
{
  "prompt": "What was my previous question?"
}
```

the model says it can’t access previous interactions or questions.

>So how can we solve this?

### First step: a global variable

One very basic way to solve this is by declaring a global variable for keeping track of the last response ID.

This is just a temporary solution. We’re going to do things step by step.

So outside of our route handler, we declare a global variable like `lastResponseId`.

This can be either:

* a `string` if we have a valid response ID
* `null` if we don’t

So we initialize it to `null`:

```ts
let lastResponseId: string | null = null;
```

Now, every time we get a response from OpenAI, we update `lastResponseId` and set it to `result.id`.

And when calling `client.responses.create()`, we can pass `previous_response_id` to establish conversation history.

So the route becomes something like this:

```ts
app.post('/api/chat', async (request: Request, response: Response) => {
  const { prompt } = request.body;

  const result = await client.responses.create({
    model: 'gpt-4o-mini',
    input: prompt,
    temperature: 0.2,
    max_output_tokens: 100,
    previous_response_id: lastResponseId,
  });

  lastResponseId = result.id;

  response.json({
    message: result.output_text,
  });
});
```

Now if we test again, first with:

```json
{
  "prompt": "What is the capital of France?"
}
```

and then:

```json
{
  "prompt": "What was my previous question?"
}
```

the model can answer correctly.

So now we have built memory into the chatbot.

> Why this is not enough?

With this global variable, we can only keep track of the last response ID for **one conversation**.

In a real application, we can have:

* multiple users
* and each user can have multiple conversations

So this approach breaks down immediately.

### Replacing the global variable with a map

The right way to improve this is by using a **Map**.

Instead of one global variable, we declare a map called `conversations`:

```ts
const conversations = new Map<string, string>();
```

Here, the first `string` is the **conversation ID**, and the second `string` is the **last response ID** for that conversation.

So conceptually, we are storing something like this:

* `conversation-1 -> response-100`
* `conversation-2 -> response-200`

That means each conversation keeps track of its own last response.

### Getting the conversation ID from the request

Now in our route handler, we also need to get the `conversationId` from the request body.

So instead of just extracting `prompt`, we extract both:

```ts
const { prompt, conversationId } = request.body;
```

This is basically the same idea we have in ChatGPT.

When we ask a question, the client creates a unique identifier for that conversation, and that conversation ID is sent to the server so the server knows which thread the message belongs to.

### Updating and reading conversation state

Once we get a response from OpenAI, we update the map with the new last response ID for that conversation.

So after the call, we do:

```ts
conversations.set(conversationId, result.id);
```

And when we call `client.responses.create()`, instead of using a single global variable, we retrieve the last response ID for the current conversation:

```ts
previous_response_id: conversations.get(conversationId),
```

So now the route becomes:

```ts
app.post('/api/chat', async (request: Request, response: Response) => {
  const { prompt, conversationId } = request.body;

  const result = await client.responses.create({
    model: 'gpt-4o-mini',
    input: prompt,
    temperature: 0.2,
    max_output_tokens: 100,
    previous_response_id: conversations.get(conversationId),
  });

  conversations.set(conversationId, result.id);

  response.json({
    message: result.output_text,
  });
});
```

### Testing multiple conversations

Now let’s test this again in Postman.

We start with:

```json
{
  "prompt": "What is the capital of France?",
  "conversationId": "conv1"
}
```

Then in the same conversation:

```json
{
  "prompt": "What was my previous question?",
  "conversationId": "conv1"
}
```

Now it correctly says the previous question was about the capital of France.

If the **Pretty** tab in the Postman extension doesn’t update, that’s just a glitch with the extension. Sometimes it happens. In that case, we can:

* switch to the **Raw** tab
* switch to the **Preview** tab
* or close and reopen the request

Now let’s open a different conversation:

```json
{
  "prompt": "What was my previous question?",
  "conversationId": "conv2"
}
```

In this new conversation, there is no history yet, so the model says it can’t access previous questions or conversations.

Then if we ask:

```json
{
  "prompt": "What is after one?",
  "conversationId": "conv2"
}
```

and follow it with:

```json
{
  "prompt": "What was my previous question?",
  "conversationId": "conv2"
}
```

it correctly answers based on the history of `conv2`.

And if we go back to `conv1`, it still remembers the history of `conv1`, not `conv2`.

So it is now properly keeping track of conversation history per conversation.

### Full version so far

At this point, the server code looks like this:

```ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const conversations = new Map<string, string>();

app.post('/api/chat', async (request: Request, response: Response) => {
  const { prompt, conversationId } = request.body;

  const result = await client.responses.create({
    model: 'gpt-4o-mini',
    input: prompt,
    temperature: 0.2,
    max_output_tokens: 100,
    previous_response_id: conversations.get(conversationId),
  });

  conversations.set(conversationId, result.id);

  response.json({
    message: result.output_text,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

>in this implementation, we are storing these values **in memory**.
In a real application, like ChatGPT, we should store these values in a **database**.


## Validating request data with Zod

In the last lesson, we assumed that everything would go smoothly, but in a real-world application, we can’t rely on that.

We need to make sure that the request body contains valid data.

More specifically, we want to make sure that:

* `prompt` is a string between `1` and `1000` characters
* `conversationId` is a valid GUID or UUID, just like the one we see in ChatGPT

So how can we implement these validation rules?

This is where we use **Zod**.

Zod is a very popular data validation library used in React applications.

### Installing Zod

First, we open a terminal window, go to the `server` directory, and install Zod.

```bash
cd packages/server
bun add zod
```

Good.

### Defining the schema

Now, with Zod, we can define the shape of our objects, like incoming request data, and easily validate them.

So we go to `index.ts`.

First, on the top, we import `z` from `zod`.

```ts
import { z } from 'zod';
```

Now, outside of our route handler, we declare a constant called `chatSchema`.

We set it to `z.object()` and define the shape of the incoming request body.

We want two properties:

* `prompt`
* `conversationId`

For `prompt`, we want a string. Then we chain validation rules.

First, we trim the string. Then we apply a minimum length of `1` and a maximum length of `1000`.

So the schema looks like this:

```ts
const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long. Max 1000 characters'),
  conversationId: z.string().uuid('Invalid UUID'),
});
```

A couple of important details here.

For `prompt`, I like to break the chained methods into multiple lines because it makes the validation rules much easier to read.

Also, we apply both a minimum and a maximum length.

The minimum length prevents empty input.

The maximum length prevents bad users from sending huge amounts of text and either:

* wasting our tokens
* or at worst putting unnecessary load on the system

So we should always apply constraints to string lengths.

For `conversationId`, we don’t use `min()` or `max()`. Instead, we validate that it is a proper UUID:

```ts
z.string().uuid('Invalid UUID')
```

UUID and GUID are basically the same thing here.

### Validating the request body

Now that we have a schema, we go to our route handler.

The first thing we do is validate `request.body`.

We call `chatSchema.safeParse()` and pass the request body.

```ts
const parseResult = chatSchema.safeParse(request.body);
```

This gives us an object that tells us whether validation succeeded.

If validation fails, we return a `400 Bad Request` response and include the validation errors in the response body.

So the beginning of the route becomes:

```ts
app.post('/api/chat', async (request: Request, response: Response) => {
  const parseResult = chatSchema.safeParse(request.body);

  if (!parseResult.success) {
    response.status(400).json(parseResult.error.format());
    return;
  }

  const { prompt, conversationId } = parseResult.data;

  const result = await client.responses.create({
    model: 'gpt-4o-mini',
    input: prompt,
    temperature: 0.2,
    max_output_tokens: 100,
    previous_response_id: conversations.get(conversationId),
  });

  conversations.set(conversationId, result.id);

  response.json({
    message: result.output_text,
  });
});
```

A very important detail here is that after validation succeeds, we should destructure from:

```ts
parseResult.data
```

not from `request.body`.

That way, we are using the validated and cleaned data coming from Zod.

>Why trim matters ?

Now let’s test this.

If we go to Postman and send an empty string for `prompt`, we should get a validation error.

For example:

```json
{
  "prompt": "",
  "conversationId": "not-a-valid-uuid"
}
```

We get a `400` response, and the response body contains validation errors for the invalid fields.

Now let’s try a prompt made only of whitespace:

```json
{
  "prompt": "   ",
  "conversationId": "not-a-valid-uuid"
}
```

Without `.trim()`, this would pass the `min(1)` check, because technically it is a string with length greater than zero.

That’s not good.

So to prevent that, we call `.trim()` before `.min()` and `.max()`.

That way, leading and trailing whitespace is removed before validation runs.

So after trimming, `"   "` becomes `""`, and the validation error comes back correctly.

### Generating a valid UUID

Now let’s pass a valid prompt, like:

```json
{
  "prompt": "What is the capital of France?",
  "conversationId": "..."
}
```

For `conversationId`, we need a real UUID.

One easy way to get that is to install a VS Code extension for generating UUIDs.

For example, a UUID generator extension.

Then in the request editor, we place the cursor where we want the value, open the command palette, and run a command like:

```text
Generate UUID at Cursor
```

That gives us a valid UUID we can paste into the request body.

So the request becomes something like this:

```json
{
  "prompt": "What is the capital of France?",
  "conversationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

Now if we send the request, it goes through and we get a valid response from OpenAI.

### Full version so far

At this point, the server file looks like this:

```ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import OpenAI from 'openai';
import { z } from 'zod';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const conversations = new Map<string, string>();

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long. Max 1000 characters'),
  conversationId: z.string().uuid('Invalid UUID'),
});

app.post('/api/chat', async (request: Request, response: Response) => {
  const parseResult = chatSchema.safeParse(request.body);

  if (!parseResult.success) {
    response.status(400).json(parseResult.error.format());
    return;
  }

  const { prompt, conversationId } = parseResult.data;

  const result = await client.responses.create({
    model: 'gpt-4o-mini',
    input: prompt,
    temperature: 0.2,
    max_output_tokens: 100,
    previous_response_id: conversations.get(conversationId),
  });

  conversations.set(conversationId, result.id);

  response.json({
    message: result.output_text,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

### Result

At this point, we have added proper validation to the request body.

We now make sure that:

* `prompt` is not empty
* `prompt` is trimmed before validation
* `prompt` cannot exceed `1000` characters
* `conversationId` must be a valid UUID

And if the client sends invalid data, we return a proper `400 Bad Request` response instead of letting bad input flow into the rest of the system.

## Handling runtime errors in the API

All right, now that we have added basic input validation, the next step is to handle unexpected errors more gracefully.

In this lesson, we’ll update our API to catch and respond to runtime errors and return a proper error message to the client.

Look at the line where we try to get a response from OpenAI.

```ts
const result = await client.responses.create({
  model: 'gpt-4o-mini',
  input: prompt,
  temperature: 0.2,
  max_output_tokens: 100,
  previous_response_id: conversations.get(conversationId),
});
```

This line might fail for various reasons.

Maybe:

* the network is down
* OpenAI servers are down
* we’ve run out of tokens
* the model name is invalid
* something else goes wrong at runtime

Right now, we are not handling errors.

### What happens without error handling

To demonstrate this, I want to add an exclamation mark to the model name to represent an invalid model.

```ts
model: 'gpt-4o-mini!',
```

Now if we send a request to our API, we get back an HTML error document instead of a clean API response.

If we preview it, we see:

* `Error 400`
* the requested model does not exist
* a full stack trace showing where the error happened

This is not a good response to return from our API.

We don’t want to expose stack traces to the client, and we don’t want to return HTML from a JSON API.

### Wrapping the handler in a try-catch block

So instead, we handle this error ourselves and return a proper error message to the client.

To do that, we add a `try-catch` block in our route handler.

The `try` block contains the happy path:

* extracting `prompt` and `conversationId`
* calling OpenAI
* updating the conversations map
* returning the successful response

Since extracting `prompt` and `conversationId` is closely related to the rest of the logic, I want to move that inside the `try` block as well for clarity.

So the route becomes:

```ts
app.post('/api/chat', async (request: Request, response: Response) => {
  const parseResult = chatSchema.safeParse(request.body);

  if (!parseResult.success) {
    response.status(400).json(parseResult.error.format());
    return;
  }

  try {
    const { prompt, conversationId } = parseResult.data;

    const result = await client.responses.create({
      model: 'gpt-4o-mini!',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id: conversations.get(conversationId),
    });

    conversations.set(conversationId, result.id);

    response.json({
      message: result.output_text,
    });
  } catch {
    response.status(500).json({
      error: 'Failed to generate a response',
    });
  }
});
```


### Outcome

At this point, we have improved the API by:

* catching runtime errors with `try-catch`
* preventing raw HTML error pages from leaking to the client
* returning a proper `500` response
* sending a clean JSON error payload the frontend can consume








