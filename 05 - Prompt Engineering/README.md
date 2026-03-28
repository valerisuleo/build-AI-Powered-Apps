# Introduction to prompt engineering



When we use tools like ChatGPT or integrate models like GPT-4 into our applications, we’re not writing code for the model, we’re giving it text prompts.

Based on those prompts, the model predicts what to say next.

So the way we write those prompts, even small differences, can dramatically change what we get back.

That’s why prompt engineering matters.



#### Example: vague vs clear prompt

If we just write:

```
Summarize this text.
```

that’s a prompt, but it’s vague.

It doesn’t say:

* how long the summary should be
* who the audience is
* what format we want

Now compare that to this:

```
Summarize the following product reviews in three short bullet points. 
Focus on common themes and use simple language.
```

That’s a much better prompt.

It’s still natural language, but it’s structured.

It gives the model:

* clear instructions
* formatting guidance
* a sense of tone

That’s the essence of prompt engineering.




> What prompt engineering helps us do ?

* reduce ambiguity
* improve consistency
* shape the kind of output we want

especially when that output is going directly into our application.


## The anatomy of a good prompt

Now that we understand what prompt engineering is and why it matters, let’s talk about the basic anatomy of a good prompt.

Most prompts that produce consistent, high-quality results have a simple pattern:

* an instruction
* some context
* a desired output format

Let’s talk about each of these parts with examples so we can see how they shape the model’s response.

### 1. Instruction

First is the instruction.

This is where we tell the model what to do.

For example, we can say:

```
Summarize the following product reviews.
```

It works, but we can make it better by saying:

```
Summarize the following reviews in three short bullet points using simple language.
```



### 2. Context

Now let’s talk about context.

This is where we give the model background information to work with.

It could be:

* a role we want it to play
* a block of text we want it to analyze
* anything that helps the model better understand the task

For example, we can say:

```
You are a senior software engineer. 
Read the code snippet below and explain it in plain English.
```

That kind of context helps guide:

* the tone
* the focus of the response

And the more clear we are here, the more details we add, the more background information, the better the output is going to be.

### 3. Output format

This is often overlooked, but it’s really important, especially for developers.

We want to be clear about what kind of output we’re expecting.

Do we want:

* a list
* a table
* a paragraph
* structured data like JSON

For example, let’s say we’re building a spam classifier.

We can write the prompt like this:

```
Label this message as spam or not spam. 
Return the result as JSON with a single key called "label".
```

Now we’re telling the model not just what to do, but how to return the result.

### Putting it all together

So let’s combine all these parts into a well-structured prompt.

```
You are a helpful support agent. 
Summarize the following customer reviews in two to three bullet points. 
Focus on pain points related to the login experience.
```

With this prompt, we are telling the model:

* who it is, in this case a helpful support agent
* what to do, which is summarization
* how to do it, which is using two to three bullet points and focusing on login pain points
* what kind of output we want, which is plain text in bullet form




## Why context matters

Right now the chatbot we built earlier works. We can ask it questions and get a response.

But really, it’s just a wrapper around ChatGPT and it doesn’t add a lot of value.

**What really makes the difference is giving the model more context.**

In this section we improve our chatbot by teaching it about an imaginary theme park, like:

* the rides
* opening hours
* ticket policies

### Assigning a role

One simple way to provide context is by assigning a **role**.

We can tell the model who it is supposed to be, and it will play along.

```
You are a customer support agent. 
Respond to this customer in a polite and empathetic tone.
```

This small addition instantly changes how the model thinks and communicates.

It does not give the model new capabilities, but it changes:

* the tone
* the structure
* the focus of the response

### Supplying background information

We can also supply relevant **background information**.

This is useful when the model needs to know about specific rules, facts, or content.

```
You are a customer support assistant. 
Here is our refund policy. 
Now answer this customer's question.
```

This gives the model the domain-specific information it needs to answer accurately.

### Setting the audience

We can also guide the model by **setting the audience**.

This is especially helpful when we want to control the tone or complexity of the response.

For example:

```
Explain this topic to a non-technical user.
```

Or:

```
Write this summary for a high school student.
```

That gives the model a sense of who it is writing for and helps it adjust accordingly.

### Controlling tone

Tone is another subtle but important lever.

If we’re building a chatbot or a customer-facing feature, and we want the language to feel warm, casual, or reassuring, we can just say that in the prompt.

For example:

```
Respond in a friendly, conversational tone. 
Avoid sounding formal or robotic.
```

Or:

```
Use professional, empathetic language, like a calm support rep helping a frustrated customer.
```

These simple instructions go a long way toward making the interaction feel human.

### Including reference material

Sometimes we also need to include reference material, because in many cases the model needs something concrete to work with.

Maybe it’s:

* a product description
* a block of reviews
* an email
* a transcript

To include that data in the prompt, it’s best to separate it visually from the instructions.

There is no strict rule for doing that, but we can use:

* triple dashes
* triple quotes
* XML-style tags

They all work.

What matters is that we clearly separate our instructions from the content.

For example:

```
You are a support assistant. Use the policy below to answer the question.

---
Refunds are allowed within 14 days of purchase if the ticket has not been used.
---

Customer question: Can I get a refund for tickets I bought last week?
```

>!!! That makes it much easier for the model to understand what is instruction and what is source material.

## Controlling the format of the output

when we’re building real applications, we don’t just care about **what** the model says, we care about **how** it says it.

Do we want:

* a paragraph of plain text
* a clean list
* a structured JSON object we can use in code

This is where prompt engineering kind of starts to feel like programming.

### Plain text and length control

By default, if we ask a model a question, we usually get back a paragraph of plain text but we can still control the **length** of the response.

So it helps to say something like:

```
Summarize this in two short sentences.
```

or:

```
Summarize this in under 100 tokens.
```

Another good practice is to also say:

```
Make sure the summary is complete and does not end mid-sentence.
```

### Markdown output

Now, if we want the response to be a little more polished, especially for things like summaries or lists, we can ask the model to respond in Markdown.

With Markdown, we can add basic formatting like:

* bold text
* italics
* bullet points

For example:

```
Summarize this review in two bullet points using Markdown. 
Highlight important details in bold.
```

That gives us output that is still plain text, but formatted in a way that is much easier to render nicely in an application.



### JSON output

If we want real structured data, we ask for JSON.

Let’s say we want to extract all product names and their prices from a piece of text.

We can write a prompt like this:

```
From the paragraph below, extract all product names and their prices. Return a valid JSON array of objects.
Each object should include a name as a string and a price as a number without currency symbols.
```

That already gives the model a much clearer target.

Now we can tighten it even further by adding:

```
Only return valid JSON. No explanation or extra text.
```

That matters because sometimes models try to be helpful and add extra explanation before or after the JSON.

That’s not something we want in a real application.

We want something we can parse directly.

>Why this matters ?

So controlling the format is not just about presentation.

It helps us:

* reduce unnecessary output
* control token usage
* make the response easier to render
* make the response easier to parse in code

That is why output formatting is such a big part of prompt engineering.


## Prompting strategies

### Zero-shot prompting

Zero-shot is the simplest type of prompt.

We give the model a task with no examples and rely on it to figure things out.

For example:

```
Classify product reviews as positive, neutral, or negative.
```

Now, this usually works well because sentiment analysis is a classic NLP task, and the categories are intuitive.

Most LLMs have seen thousands of reviews like this during training, so they know what to do.

But note that here, with this prompt, we are clearly telling the model what values to return:

* positive
* neutral
* negative

If we didn’t, the model could respond with something vague like:

* somewhat happy
* positive sentiment
* a long sentence

and that is not useful if we want to take that value and use it in code.


### One-shot prompting

Now, there are situations where zero-shot prompts don’t work.

For example, let’s say we want the model to return the sentiment in a structured format like a JSON object.

If we just say:

```
Turn this review into a JSON object.
```

the model might invent its own structure or return something inconsistent.

So instead, we give it one example to show the format we want.

That is a one-shot prompt.

With this example, we are telling the model:

* what the structure should look like
* what key to use, in this case sentiment
* what kind of value to return

And because the task is simple and the output format is clear, one example is usually enough.

### Few-shot prompting

But not every task is that simple.

Let’s say we want the model to analyze support messages and return structured data with multiple fields like this:

* intent
* urgency
* mentionsOrder

If we only give the model one example, it won’t know:

* what values are valid for intent
* how to infer urgency
* when to set mentionsOrder to true or false

So in this case, we use a few-shot prompt, meaning we give it a few examples to learn from.

> **How many examples should we give?**

There is no magic number, but as a rule of thumb, three to five well-written examples usually work well. Of course, that depends on the task. For more complex tasks, we might need more examples.


> **What makes good examples?**

We should make sure our examples are:

* high quality
* clear and unambiguous
* well-formatted
* consistent in structure every time
* diverse enough to cover different use cases
* including at least a couple of edge cases

That makes it much easier for the model to learn the pattern we want.



## Handling errors and edge cases in prompts

When we write a function, we don’t just test it with valid input.

We test the happy path, and then we test how it handles bad data.

Prompting is no different.

Even if our prompt works with clean input, we still need to check how it behaves when the input is:

* vague
* empty
* just wrong


### Returning an error for invalid input

One option is to tell the model to return an error when the input is missing or invalid.

By default, the model will usually try to answer anyway, even if the input is total nonsense.

For example, we can say:

```
Summarize this product review. 
If the input is empty or not a valid review, respond with this error object.
```

Or:

```
If the input contains fewer than five words, return this error object.
```

but we should still tell the model what to do when the input is missing or invalid.

### Asking a clarifying question

Another option is to ask a clarifying question when the input is vague.

> Of course, this only really makes sense in chatbots.

For example, we can say:

```
If the user's request is too vague or lacks detail, ask a clarifying question instead of guessing.
```

That is often better than forcing the model to produce an answer based on incomplete information.

### Always test your prompts

Now, regardless of the technique we use, we should always test our prompts.

We should test them with:

* an empty string
* just white spaces
* one or two random words
* gibberish text
* extremely long input
* content that is missing key details

Then we watch how the model responds.

If it breaks or gives bad output, we go back and refine the prompt.


## Why hallucinations happen

LLMs don’t know facts.

They are not looking things up in a database.

They are predicting what text should come next based on patterns in their training data.

So if we ask a vague or open-ended question, or if our prompt doesn’t give enough information, the model will just fill in the blanks using whatever it thinks sounds right.

That’s when hallucinations happen.

### Strategy 1: provide facts in the prompt

If we want the model to answer accurately, we should give it the data.

For example, let’s say a customer asks our chatbot:

```
Can I cancel my ticket for tomorrow?
```

If we don’t provide the refund policy in the prompt, the model might guess, and that guess could be wrong.

So instead, we should write something like:

```
Here is our refund policy. 
Now answer this customer's question: Can I cancel my ticket for tomorrow?
```

That is called *grounding*.

We are anchoring the response to something real.

### Strategy 2: tell the model what to do when it doesn’t know

Sometimes the input is vague or the answer just isn’t available.

In those cases, it’s better for the model to say I don’t know than to fake it.

For example, we can say:

```
If you are unsure or the answer is not available, say: "Sorry, I don't have that information." Do not guess or make up a response.
```

### Strategy 3: limit the model’s scope

One common cause of hallucination is when the model starts answering questions it really shouldn’t.

Let’s say we have built a chatbot for our theme park.

If someone asks:

* can you write me a Python script?
* what’s the capital of Brazil?

the model doesn’t automatically know that it shouldn’t answer those questions, so it happily tries to answer everything.

That is how we end up with off-topic responses that sound confident, but have nothing to do with our application.

To prevent that, we can add a boundary like this:

```
You are a support assistant for a theme park. 
Only answer questions related to the park, including rides, tickets, hours, and policies. 
If the question is unrelated, respond with: "I'm here to help with park-related questions. 
Let me know if there's anything you'd like to know about your visit."
```

With this kind of boundary setting, we help the model stay focused and avoid hallucinations.

### Don’t overtrust the model

Even with all these strategies, we still shouldn’t overtrust the model.

Even with good prompts, hallucinations can still happen, especially with general-purpose models.

So we should **always**:

* sanitize or validate outputs before using them
* avoid using AI for critical decisions without human review
* log outputs and monitor for strange behavior

For example, if our application expects JSON, we can validate the output using a library like Zod, just like we validated API input earlier.

## Refining a real prompt in the Playground

All right, now let’s build and refine a real prompt for a theme park assistant step by step using OpenAI’s Playground.

Once we do this, we’ll bring this prompt into our application and improve our chatbot.

### Starting with no context

Here in the Playground, let’s start by asking a question like:

```
What time does the park close?
```

It says:

```
Could you please specify which park you are referring to?
```

So it doesn’t know anything about our theme park or our business.

This is essentially like ChatGPT.

### Adding context

Now we can give it context by providing some instruction.

For example:

```
You are a customer support agent for a theme park named WonderWorld. 
Park's opening hours are Monday through Thursday, 9 a.m. to 5 p.m., and Friday to Sunday, 9 a.m. to 9 p.m.
```

Now let’s repeat our question:

```
What time does the park close?
```

It says:

```
WonderWorld's closing times are Monday to Thursday, 5 p.m., and Friday to Sunday, 9 p.m.
```

Great.

This is a step in the right direction, but it’s not exactly what I wanted.

As a user, I want to know what time the park closes today.


### Adding more business knowledge

Now obviously we can give the model more context.

We can give it information about:

* the location
* the rides
* the tickets
* other business details

The more it knows about our business, the better it can answer customer questions.

### Restricting the scope

Now, what if we ask an irrelevant question like:

```
What is the capital of France?
```

It happily answers us.

But that’s kind of weird, because as a customer support agent, this chatbot should only answer questions about WonderWorld.

So we refine the prompt again and say:

```
Only answer questions related to WonderWorld.
```

Now if we repeat the same question:

```
What is the capital of France?
```

the model says something like:

```
I'm here to help with any questions you have about WonderWorld.
```

## Bringing the refined prompt into the application

All right, now we’re going to bring the prompt we built in the previous lesson into our application and improve our chatbot.

### Storing prompts in separate files

Back in our project, here in the server directory, we add a new directory called:

```
prompts
```

We’re going to store our prompts in separate files because we don’t want a huge block of text sitting in the middle of our code.

So in this directory, we add a new file called:

```
chatbot.txt
```

and we paste our prompt there.


Now we’re going to use a separate markdown file for park information:

```
wonderworld.md
```

and it also lives in the prompts directory.

This file contains all the park information, like:

* tickets and pricing
* park hours
* rides
* accommodation
* other details

In this scenario, we’re assuming the park closes at the same time every day, so we don’t need to include today’s date in the prompt.

### Updating chatbot.txt

Now back to chatbot.txt.

Instead of embedding all the park details directly into the prompt, we keep the prompt focused on instructions and add a placeholder.

So the prompt becomes something like this:

```
You are a customer support agent for a theme park named WonderWorld.

Here is some key information about the park:

{{parkInfo}}

Only answer questions related to WonderWorld.
Always answer in a cheerful tone.
Avoid making up information.
```

The important part here is:

```
{{parkInfo}}
```

That is the placeholder we will replace later in our service.

> **Why use a placeholder instead of pasting the whole file?**

Now you might wonder why we don’t just copy the contents of wonderworld.md and paste them directly into chatbot.txt.

Because these are two separate concerns.

The prompt is purely for instructing the model how to respond.

Over time, we may want to refine that prompt to improve tone, boundaries, and behavior.

But the actual information about the park is a completely different piece of content.

So it makes sense to keep:

* prompt instructions in one file
* park knowledge in another file

That separation keeps things cleaner and easier to maintain.

### Loading the files in the chat service

Now to use this, we go to our chat.service.ts.

First, we import the prompt file.

We’re going to call it template, because it contains a placeholder that we’ll replace.

```
import template from '../prompts/chatbot.txt';
```

Then, to read wonderworld.md, we use Node’s file system module.

So on the top, we import:

```
import fs from 'fs';
import path from 'path';
```

Now we read the markdown file with fs.readFileSync().

We build the file path using path.join():

```
const parkInfo = fs.readFileSync(
  path.join(__dirname, '..', 'prompts', 'wonderworld.md'),
  'utf-8'
);
```

Then we take the prompt template and replace the placeholder with the actual park information:

```
const instructions = template.replace('{{parkInfo}}', parkInfo);
```

We do this once when the module is loaded, and then reuse the final instructions for every API request.

### Passing the instructions to OpenAI

Now, down where we call OpenAI, we set the instructions property.

So the request becomes something like this:

```
const response = await client.responses.create({
  model: 'gpt-4o-mini',
  instructions,
  input: prompt,
  temperature: 0.2,
  max_output_tokens: 200,
  previous_response_id: conversationRepository.getLastResponseId(conversationId),
});
```

## What this gives us

At this point, the chatbot is no longer just a generic assistant.

It now knows about WonderWorld.

So if we ask something like:

```
What time does the park close?
```

it can answer based on the data from wonderworld.md.

If we ask:

```
Do you have a hotel?
```

it can answer based on the accommodation information in that file.

And if we ask something irrelevant like:

```
What comes after one?
```

it stays within scope and redirects us back to WonderWorld-related questions.

That is a huge improvement over the earlier generic chatbot.

