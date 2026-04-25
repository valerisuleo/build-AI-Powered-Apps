# AI-Powered Apps — Study Notes


## The concrete problem

You are building an application. At some point you want it to do something intelligent — summarize a block of text, answer a question, classify an email, generate a description.

You could write code for each of these. But writing code that understands language is extremely hard. It requires years of research, enormous datasets, and enormous compute.

So the practical answer is: **use a model that someone else already trained**.

That is where LLMs come in.


## What is an LLM, actually?

LLM stands for Large Language Model.

The word "large" refers to two things:
- It was trained on a massive amount of text (books, articles, code, forums, documentation)
- It has billions of internal numerical parameters that were adjusted during training

When you send a prompt to an LLM, it does not search a database. It does not look anything up. It **predicts** what text should come next, based on the patterns it learned during training.

It is, at its core, a very large mathematical function: text goes in, probable text comes out.

### What this means in practice

Because the model is predicting, not reasoning:
- It can sound confident while being completely wrong
- Its output quality depends heavily on the quality of its training data
- Code it generates can look clean and professional while being buggy or insecure

Understanding this shapes how you use the model correctly.


## The basic interaction

In almost every application, the interaction with a model follows the same simple pattern:

1. You send a **prompt** (text input)
2. The model returns a **response** (text output)

The response can be plain text, JSON, a list, a number — whatever you ask for.

Here is the simplest possible version in code using the OpenAI SDK:

```js
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await client.responses.create({
  model: "gpt-4.1",
  input: "What is the capital of France?",
});

console.log(response.output_text); // "The capital of France is Paris."
```

This works. But as soon as you start using it in a real application, you run into two immediate problems: **cost** and **limits**.


## Tokens — why they matter for cost and limits

Models do not process text character by character or word by word. They break text into chunks called **tokens**.

A token is roughly 3–4 characters on average, but it varies. "Hello" is one token. "unhappiness" might be two. Punctuation and spaces are tokens too.

### Why you need to care

**Cost.** Most AI platforms charge per token — both input and output. If you are summarizing long documents or handling high traffic, the bill adds up fast.

**Limits.** Every model has a **context window** — the maximum number of tokens it can process in a single request. This includes:
- Your prompt
- The model's response
- Any conversation history

If you exceed the context window, the model either stops or cuts off the output.

### How to count tokens before sending

```js
import pkg from "tiktoken";
const { get_encoding } = pkg;

const encoding = get_encoding("cl100k_base"); // OpenAI's tokenizer
const tokens = encoding.encode("Hello world, this is a test.");
console.log("Token count:", tokens.length);
```

Use this before making requests when working with long documents or conversation history, so you can truncate or compress input before hitting the limit.


## Choosing the right model

There are hundreds of models available. The temptation is to always use the most powerful one. That is the wrong default.

A more powerful model is:
- Slower
- More expensive
- Often unnecessary for simple tasks

The right question is: **what does this specific task actually need?**

| Factor | What to ask |
|---|---|
| **Reasoning** | Does the task need complex logic, or is it simple extraction? |
| **Speed** | Is this a real-time chat interface, or a background job? |
| **Modalities** | Do you need image or audio input, or just text? |
| **Cost** | How many requests per day? How long are the inputs? |
| **Context window** | Are you summarizing full documents or short snippets? |
| **Privacy** | Is the data sensitive? Can it leave your infrastructure? |

For a chatbot answering park opening hours: a small, fast, cheap model is fine.
For analyzing a 50-page legal contract: you need a model with a large context window.
For sensitive health data: you may need a model you run yourself.


## Model settings — controlling the output

Once you have chosen a model, you can tune how it behaves using a few key settings.

### Temperature

This controls how random or creative the output is.

A value of `0` means the model always picks the most likely next token — very deterministic.
A value of `2` means it picks from a much wider range — very random, often incoherent.

**Practical guide:**

| Range | Use for |
|---|---|
| `0.2 – 0.4` | Summarization, extraction, classification, factual answers |
| `0.7 – 1.0` | Creative writing, brainstorming, marketing copy |

Start at `0.2` for precision tasks. Raise it only if the output feels too mechanical.

### Max output tokens

This caps the length of the response. Set it too low and the response gets cut off mid-sentence.

If you use a low value, guide the model explicitly in your prompt:

```
Write a summary in 50 words or fewer. Make sure the answer is complete.
```

### Top P

This limits which tokens the model can pick from at each step. Instead of scaling randomness like temperature, it restricts the candidate pool.

**Practical rule:** tune either temperature **or** top P, not both at the same time. When in doubt, leave `top_p = 1.0` and adjust temperature instead.

### Response format

By default you get plain text. But you can ask for structured output:

**JSON object** — useful when your code needs to parse the response:
```
Give me three benefits of exercising. Return a JSON object.
```

**JSON schema** — when you need a very specific structure enforced:
```json
{
  "name": "benefits_schema",
  "schema": {
    "type": "object",
    "properties": {
      "benefits": {
        "type": "array",
        "items": { "type": "string" }
      }
    },
    "required": ["benefits"]
  }
}
```

With a schema, the model is forced to match your exact shape. This is the right choice when the output feeds directly into application code.


## Prompt engineering — shaping what you get back

You have a working API call. The model responds. But the response is vague, inconsistent, or in the wrong format.

The problem is almost always the prompt.

Prompt engineering is not magic. It is structuring your natural language instructions so the model has enough information to produce the output you actually need.

### The simplest version: just ask

```
Summarize this text.
```

This works sometimes. But it gives the model no information about:
- How long the summary should be
- Who will read it
- What format to use

So the output varies wildly between calls.

### A structured prompt

A good prompt has three parts:

**1. Instruction** — what to do

```
Summarize the following product reviews in three short bullet points.
```

**2. Context** — background that shapes the response

```
You are a helpful support agent writing summaries for first-time buyers.
Focus on common themes and use simple language.
```

**3. Output format** — what form the answer should take

```
Return only the bullet points. No introduction, no conclusion.
```

Combined:

```
You are a helpful support agent writing summaries for first-time buyers.
Summarize the following product reviews in three short bullet points.
Focus on common themes and use simple language.
Return only the bullet points. No introduction, no conclusion.
```

This is a far more reliable prompt. Every sentence removes a degree of freedom the model would otherwise fill arbitrarily.

### Context techniques

| Technique | Example |
|---|---|
| Assign a role | `You are a customer support agent for WonderWorld theme park.` |
| Provide background | `Here is our refund policy. Use it to answer the question.` |
| Set the audience | `Explain this to someone with no technical background.` |
| Control the tone | `Use a warm, conversational tone. Avoid sounding formal or robotic.` |
| Separate reference material | Use `---` or XML tags to divide instructions from source content |

### Separating instructions from content

When you include source material in the prompt (reviews, a policy, an email), separate it visually from the instructions. The model needs to know what is an instruction and what is data.

```
You are a support assistant. Use the policy below to answer the question.

Refunds are allowed within 14 days if the ticket has not been used.

Customer question: Can I get a refund for tickets I bought last week?
```

### Storing prompts in separate files

As prompts get longer, keeping them inside code becomes messy. Move them to `.txt` or `.md` files with placeholders:

```
# prompts/chatbot.txt

You are a customer support agent for WonderWorld theme park.

Here is some key information about the park:
{{parkInfo}}

Only answer questions related to WonderWorld.
Always answer in a cheerful tone.
Avoid making up information.
```

In code, load the file and replace the placeholder at runtime:

```ts
const prompt = template.replace("{{parkInfo}}", parkInfo);
```

This keeps application logic and prompt content cleanly separated.


## Prompting strategies — when simple is not enough

### Start simple: zero-shot

Give the task with no examples. Rely on the model's training.

```
Classify this review as positive, neutral, or negative.
```

This works well when the task is familiar and the output categories are clear. But notice: you must name the exact categories you want. If you don't, the model might return "somewhat happy" or "mostly positive" — values you cannot use in code.

**Limit:** if you need a very specific output structure (e.g. a JSON object with multiple fields), zero-shot often produces inconsistent results.

### Add one example: one-shot

Show the model exactly what you want by giving one input/output pair.

```
Review: "Fast delivery but the box was damaged."
Output: {"sentiment": "neutral"}

Review: "Absolutely love this product!"
Output:
```

One example is usually enough to enforce a format. The model learns the structure from the demonstration.

**Limit:** if there are multiple fields, ambiguous categories, or edge cases the model has never seen, one example is not enough.

### Add several examples: few-shot

For complex tasks, provide 3–5 examples that cover different cases.

**What makes good examples:**
- High quality and unambiguous
- Consistent in structure every time
- Diverse enough to cover different inputs
- Include at least one or two edge cases

There is no magic number. More complex tasks need more examples.


## Hallucinations — why they happen and how to reduce them

The model predicts text. When it lacks the necessary information, it does not say "I don't know" — it fills in the gap with whatever sounds plausible. That is a hallucination.

### Why it happens

If the prompt is vague, or the answer requires knowledge the model doesn't have, it generates something that fits the pattern of a correct answer — without actually being correct.

### Strategy 1: provide the facts in the prompt

Don't ask the model to know things. Give it the information.

**Without grounding:**
```
Can a customer get a refund?
```
The model guesses. It might be right or wrong.

**With grounding:**
```
Here is our refund policy:
Refunds are allowed within 14 days of purchase if the ticket has not been used.
Customer question: Can I get a refund for tickets I bought last week?
```
Now the model answers from the text you provided, not from a guess.

### Strategy 2: tell the model what to do when it doesn't know

```
If you are unsure or the answer is not available, respond with:
"Sorry, I don't have that information." Do not guess.
```

### Strategy 3: limit the model's scope

A general-purpose model will try to answer any question. If your chatbot is for a theme park, it should not answer questions about Python scripts or the capital of Brazil.

```
You are a support assistant for WonderWorld theme park.
Only answer questions related to the park (rides, tickets, hours, policies).
If the question is unrelated, respond with:
"I'm here to help with park-related questions. Let me know if there's anything about your visit."
```

### What not to do

Even with good prompts, hallucinations can still occur. Do not:
- Use AI for critical decisions without human review
- Trust structured output without validating it (use a schema validator like Zod)
- Assume the model is correct because it sounds confident


## Multi-turn conversations — adding memory

A basic API call has no memory. Each request is independent. If you ask "What is the capital of France?" and then "What was my previous question?", the model will say it has no record of previous interactions.

### The naive fix: a global variable

```ts
let lastResponseId: string | null = null;

const result = await client.responses.create({
  model: "gpt-4o-mini",
  input: prompt,
  previous_response_id: lastResponseId, // chain to previous response
});

lastResponseId = result.id; // update after each call
```

This works for one conversation. But a real application has multiple users, each with multiple conversations. A single global variable breaks immediately.

### The correct fix: a map per conversation

Each conversation gets a unique ID. The server tracks the last response ID per conversation.

```ts
const conversations = new Map<string, string>(); // conversationId → lastResponseId

const result = await client.responses.create({
  model: "gpt-4o-mini",
  input: prompt,
  previous_response_id: conversations.get(conversationId), // per-conversation state
});

conversations.set(conversationId, result.id);
```

The client generates a `conversationId` once (using `crypto.randomUUID()`) and sends it with every message.

**Remaining limit:** this stores state in memory. If the server restarts, all conversation history is lost. In production, store conversation state in a database.


## Open-source models — when you don't want to use a hosted API

Hosted APIs like OpenAI charge per token and your prompts travel over the network. This is fine for most use cases. But sometimes it is not:

- **Cost:** you are running high volumes and the bill is growing
- **Privacy:** the data is sensitive and cannot leave your infrastructure
- **Offline:** the application runs without internet access

Open-source models solve all three. You run the model yourself.

### Why open-source models exist

| Reason | What it gives you |
|---|---|
| **Cost** | Pay once for hardware; run forever for free |
| **Privacy** | Data never leaves your machine |
| **Flexibility** | Choose from thousands of models, including small ones tuned for specific tasks |
| **Offline access** | Works in air-gapped environments |
| **Transparency** | You can inspect the code and sometimes the training data |


## Hugging Face — where to find models

[huggingface.co/models](https://huggingface.co/models) is the main registry for open-source models — think of it as GitHub for machine learning.

You can filter by task (summarization, text generation, translation, etc.) and sort by downloads to find the most widely used models.

### Calling a model via the Hugging Face Inference API

This is the simplest way to try a model — no local setup required.

```ts
import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_TOKEN);

const result = await client.chat.completions.create({
  model: "meta-llama/Llama-3-8b-instruct",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userInput },
  ],
});
```

**Important:** with this approach, your prompts still travel over the network to Hugging Face's servers. If privacy is the reason you are using open-source, this does not solve it.

**Also:** match the model to the task. BART (`facebook/bart-large-cnn`) is optimized for summarizing news-style articles. Sending product reviews to it will produce poor results. Use a general-purpose instruction-following model instead.


## Ollama — running models locally

[ollama.com](https://ollama.com) is a tool that makes running models locally as simple as a single terminal command. Think of it like Docker, but for LLMs.

### Basic CLI usage

```bash
ollama run llama3          # download and run a model interactively
ollama list                # see all models stored on your machine
ollama ps                  # see running models and their resource usage
ollama rm llama3           # remove a model to free disk space
```

### Approximate resource requirements

| Model | Disk | RAM |
|---|---|---|
| llama3 (Ollama registry) | ~4 GB | ~6 GB |
| llama GGUF (Hugging Face) | ~2 GB | ~3 GB |
| tinyllama | — | ~1.4 GB |

Start with a smaller model like `tinyllama` to test your setup before downloading larger ones.

### Using the Ollama JavaScript client

When Ollama runs a model, it starts a local HTTP server on your machine. The JavaScript client wraps that communication.

```bash
bun add ollama
```

```ts
import Ollama from "ollama";

const ollamaClient = new Ollama();

const response = await ollamaClient.chat({
  model: "tinyllama",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userInput },
  ],
});

return response.message.content || "";
```

No network call. No API key. No billing. Everything runs on your machine.

### Running Hugging Face models via Ollama

Ollama can also run models from Hugging Face — but only models published in **GGUF format**.

1. Go to your Hugging Face profile → Settings → Local Apps → enable Ollama
2. Filter models by GGUF format on the models page
3. On the model page, copy the `ollama run` command and execute it


## LLM caching — don't pay for the same answer twice

Here is the problem: every call to the model costs money and takes time. If ten users view the same product page within a week, you are paying to summarize the same reviews ten times.

The fix is simple: **generate the summary once, store it, and serve the stored version until it expires**.

### The pattern

```
Request comes in for product summary
  → Is there a cached summary that has not expired?
      YES → return it immediately (no LLM call)
      NO  → call the LLM → store the result with an expiry date → return it
```

### Implementation

```ts
// Check for a valid (non-expired) cached summary
async function getCachedSummary(productId: number) {
  return prisma.summary.findFirst({
    where: {
      productId,
      expiresAt: { gt: new Date() }, // only return rows that have not expired
    },
  });
}

// Store a new summary, or update the existing one
async function storeReviewSummary(productId: number, summary: string) {
  const expiresAt = dayjs().add(7, "day").toDate(); // 7-day TTL

  return prisma.summary.upsert({
    where: { productId },
    create: { productId, content: summary, expiresAt },
    update: { content: summary, generatedAt: new Date(), expiresAt },
  });
}
```

`upsert` means: if the row exists, update it; if it does not, create it. This handles both the first summary and future regenerations with one operation.

### Why 7 days?

It is arbitrary. The right TTL depends on how often the underlying data changes. If new reviews come in daily, a shorter TTL keeps the summary fresh. If reviews are rare, a longer TTL saves more on API costs. Choose based on your business requirements.

### What this gives you

- First visitor: LLM is called, result is stored
- All subsequent visitors within the TTL: instant response, zero LLM calls
- After expiry: regenerated on next request and cached again

This is one of the most impactful optimizations you can make when integrating LLMs into a production application.
