# Open Source Models, Hugging Face & Ollama



## Why open-source models?

In this section, we're going to talk about open-source models. You will learn why you might choose open-source models, how to find them, and how to run them locally with tools like *Ollama*. Then we'll integrate them into our application so they can power AI features without depending on hosted services. So let's jump in and get started.

Alright, so why bother with open-source models? Why not just stick with something like OpenAI or Anthropic?

Well, there are a few good reasons.

| Reason | Description |
|---|---|
| **Cost** | With hosted models, we are paying by the token, and depending on how much we use them, the bill can grow fast. With open source, we can run models locally for free after the initial hardware setup, or we can put them on our own server and control exactly what we spend. |
| **Privacy** | When we run a model on our own machine, nothing leaves our environment. That means no one else is seeing our prompts or responses. That's a big deal if you're dealing with sensitive data like in healthcare, finance, or government projects. |
| **Flexibility** | With open source, we are not locked into a single model. We have the freedom to choose from hundreds or even thousands of models. Some of these models are what we call small language models. They're tuned for very specific tasks and depending on the job, they might actually perform better than those big commercial large language models. |
| **Offline access** | With hosted models, we need an internet connection, but with open source, we can run them completely offline. And this is perfect for edge devices, field work, or anywhere where we have limited internet connectivity. |
| **Transparency** | We can actually look at the code and sometimes even the training data, so we know what's going on under the hood and where potential biases might come from. |

So in short, open source gives us cost saving, privacy, flexibility, offline access, and transparency.


## Finding models on Hugging Face

Now, to find open-source models, we're going to use **Hugging Face**. It's the go-to platform for hosting and discovering open-source models. 
>You can think of it like GitHub for machine learning. It's where developers and researchers publish open-source models and datasets.

🔗 [huggingface.co/models](https://huggingface.co/models)

Up here, we have models, datasets, spaces, and so on. Let's go to the models section.

Now, if you know the name of a particular model, you can search for it up here, like Mistral. Otherwise, you can use the filters on the left side to find a model.

Here we have various tasks, like text generation, image-to-text, image-to-image, and so on. We can expand this. Now we have various **categories**: 

- multi-modal, where we can find models that support multiple modalities,
- text and image at the same time,
- computer vision, which is all about working with images and videos,
- natural language processing, which is all about text:
	- text classification, 
	- translation, 
	- summarization and so on.

So let's select **summarization**.

Now currently, we have about 2400 models that we can use for summarizing text. The most popular (The publisher is Facebook) 🔗 [BART Language CNN](https://huggingface.co/facebook/bart-large-cnn)

>Note: the more parameters a model has, the larger it is. It's like a larger brain.

Let's take a closer look at this model.

On this page, we have a playground for trying this model directly in the browser. Now the model is summarizing the text. It takes a couple of seconds and returns the summary.

We can click "view code" to see various examples.

We can see examples in Python, JavaScript, and curl for running this in the terminal.



With JavaScript, we have **two options**. 

1. We can use fetch or Axios to directly send an HTTP request to this endpoint.
	
	```ts
	const response = await fetch(
	  "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
	  {
	    method: "POST",
	    headers: {
	      Authorization: "Bearer YOUR_TOKEN",
	      "Content-Type": "application/json",
	    },
	    body: JSON.stringify({
	      inputs: "Your long text here",
	    }),
	  }
	);
	
	const data = await response.json();
	```

2. The other option is to use `Hugging Face.js`, which is a library that abstracts the underlying HTTP communication.

	```ts
	import { InferenceClient } from "@huggingface/inference";
	
	const client = new InferenceClient("YOUR_TOKEN");
	
	const result = await client.summarization({
	  model: "facebook/bart-large-cnn",
	  inputs: "Your long text here",
	});
	
	console.log(result);
	```
	
	With this approach, we no longer have to manually send HTTP requests. We work at a higher level of abstraction. We simply import the client, create an instance, and call a method like summarization.

> ⚠️ **Privacy note:** With either of these approaches, our prompts and responses are going over the network. So if privacy matters, this is not the way to use an open-source model. There is another way, which we'll talk about later in this section.


## Setting up Hugging Face in the project

Now, to call one of the Hugging Face models, first we have to create an access token.

To do that, we go to the top, open our profile, then go to Settings, and Access Tokens, and create a new access token.

> 💡 **Best practice:** Always create separate tokens for your development, testing, and production environments. 

Next, we select the permissions we need. In this case, we go to the Read tab and create a token with read access to our resources.

We create the token and copy it.

Now, back to our project. We go to our `.env` file and add a new key:

```env
HF_TOKEN=your_access_token_here
```



Now:

```bash
bun add @huggingface/inference
```

> ℹ️ **Free tier limitations:** Inference is the service that Hugging Face provides for hosting models. They have a free tier, which we're going to use here, but it comes with limitations like rate limiting and lower performance. It's fine for development, but not ideal for production.

We're not replacing OpenAI. We're just extending the client.

Back to our code, we import the client:

```ts
import { InferenceClient } from "@huggingface/inference";
```

Next, we create a client instance using our token:

```ts
const inferenceClient = new InferenceClient(process.env.HF_TOKEN);
```

If we already have another client, like OpenAI, we keep both and give them distinct names, for example `openaiClient` and `inferenceClient`.

Now, to use a model, we call the summarization method.


Now let's test the application.

Back in the browser, we trigger summarization. We get a response, but it doesn't really look like a proper summary of multiple reviews. It sounds more like a single review sentence.

So what's going on?

> ⚠️ **Watch out:** BART is optimized for summarizing news-style articles, not collections of product reviews. It's not good at extracting themes like pros and cons across multiple reviews. Always match the model to your actual use case.




What can we do here? We have **two options**: 

1. use another model that is fine-tuned on summarizing product reviews. 
2.  use a more general-purpose model, something similar to the GPT series but open source.

let's try the second approach, using a more general-purpose model.

Back to the models page, we search for "Llama". Here we find a model developed by Meta with around 8 billion parameters.

🔗 [meta-llama/Llama-3-8b-instruct](https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct)

Let's open the model card and look at the JavaScript example using Hugging Face.

Instead of the summarization method, we now use chat completion. So we copy that example.

Back in our LLM client module, we replace the existing summarize implementation. We update the client reference and call the new method:

```ts
const chatCompletion = await inferenceClient.chat.completions.create({
  model: "meta-llama/Llama-3-8b-instruct",
  messages: [
    {
      role: "system",
      content: summarizePrompt,
    },
    {
      role: "user",
      content: reviews,
    },
  ],
});
```


## Running models locally with Ollama

Ollama is a free cross-platform tool that makes it incredibly easy to run language models locally. If you're familiar with Docker, it's kind of like Docker for LLMs.

🔗 [ollama.com](https://ollama.com) · [ollama.com/library](https://ollama.com/library)

Ollama has its own registry of models, which is different from Hugging Face, but 
>with Ollama, we can also run Hugging Face models locally.

Now let's search for Llama. This is a model that we used in the previous lesson, and it's also available here.

To run this model locally, all we have to do is run the command shown on the page in a terminal window, once we install Ollama. So first, go to the downloads page and install Ollama for your operating system.

Once you download and run it, open a terminal window and run:

```bash
ollama
```

This shows all the available commands. For example, we have commands for pulling models, pushing models, listing models, checking running models, and so on.

To see this in action, we go back to the Ollama website, copy the command for running Llama, and execute it.

```bash
ollama run llama3
```

If the model doesn't exist on your machine, Ollama will pull it from the registry. This can take some time depending on your internet connection.

Once it's ready, the model starts running locally, and we get a shell where we can interact with it. We can send prompts directly. For example:

```
What is the capital of France?
```

And the model responds:

```
The capital of France is Paris.
```

Now let's open another terminal window and check the models stored on the machine:

```bash
ollama list   # all local models
ollama ps     # currently running models
```

Here we can see active models, along with resource usage like memory and processor consumption.

> ⚠️ **Heads up:** These models can take a significant amount of space and resources. So when you're done with a model, it's a good idea to remove it to free up space.

```bash
ollama rm llama3
```

After that, if you run `ollama list` again, the model is no longer there.


## Running Hugging Face models via Ollama

All right, now let's see how we can use Ollama to run Hugging Face models.

To do that, first we have to go to our profile, then to the settings page, and on the left side go to Local Apps and Hardware. On this page, we enable Ollama.

Once we enable this, we go back to the models page and filter by the GGUF format. This is the model format that Ollama expects. So with Ollama, we can only run Hugging Face models that support the GGUF format.

> ℹ️ **GGUF format:** With Ollama, we can only run Hugging Face models published in GGUF format. Filter by this format on the HF models page before picking a model to run locally.

So we apply this filter, then search for "llama", and sort by downloads.

Here we find a version of the Llama model in GGUF format. Let's open it.

On the model page, under "Use this model", because we enabled Ollama, we now see it under local apps. Once we click this, we get the command we should run in the terminal.

We copy that command and run it. Ollama starts pulling the model from Hugging Face. This can take a bit depending on the connection.

Once it's ready, the model runs locally. We can interact with it directly. For example:

```
What is 2 + 2?
```

And we get:

```
4
```

Now let's open another terminal and check the models:

```bash
ollama list
```

We can see this model stored locally. Notice the size. In this case, it's around 2 GB.

If you compare it with the Llama model we pulled earlier from the Ollama registry, that one was larger, around 4 GB. This difference also shows up in memory usage.

| Model | Disk | RAM |
|---|---|---|
| llama3 (Ollama registry) | ~4 GB | ~6 GB |
| llama GGUF (Hugging Face) | ~2 GB | ~3 GB |
| tinyllama | — | ~1.4 GB |

We can verify that with `ollama ps`. Here we see the model is using around 3 GB of RAM, while the previous one was using around 6 GB.



## Using the Ollama JavaScript client

In this lesson, we're going to use the official JavaScript client for Ollama.

First, we go to ollama.com and search for TinyLlama. This is a smaller version of Llama that we'll use in our application. We copy the command and run it:

```bash
ollama run tinyllama
```

Once the model is running, we open another terminal and check with `ollama ps`. We can see that this model is using around 1.4 GB of RAM, which is smaller than the previous ones.

Now, when Ollama runs a model, it starts a local server on our machine. We can send HTTP requests to that server to interact with the model. Instead of doing that manually, we use the official JavaScript client, which wraps this communication.

So we install it:

```bash
bun add ollama
```

Now, back in our LLM client module, we import it and create a client:

```ts
import Ollama from "ollama";

const ollamaClient = new Ollama();
```

Now we go to our `summarizeReviews` method and replace the inference client with the Ollama client. Instead of calling `chat.completions.create`, we call `chat`:

```ts
const response = await ollamaClient.chat({
  model: "tinyllama",
  messages: [
    {
      role: "system",
      content: summarizePrompt,
    },
    {
      role: "user",
      content: reviews,
    },
  ],
});

return response.message.content || "";
```

We remove the provider property, because it's not needed here. This method returns a response object. Inside that, we have a `message` object, and inside that we have `content`.

Now let's test the application. Back in the browser, we trigger summarization. This time, the summary is generated locally by the model running on our machine. The output reads like a proper summary of customer reviews.

> ✅ **Key point:** We are not going over the network. We are not sending prompts to a remote API. Everything happens locally.

