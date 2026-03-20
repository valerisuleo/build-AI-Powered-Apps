# Setting Up a Modern Full-Stack Project

### In this section...

We’ll set everything up from scratch using tools like **Bun**, **Vite**, and **Express**.

This gives us:

* full control
* no hidden magic
* a setup that’s easier to understand
* a setup that’s easy to scale

Along the way, we’ll also:

* add **Tailwind** for styling
* set up **ShadCN UI** for components
* automate our workflow with **Husky**

By the end of this section, we’ll have a solid full-stack foundation that’s:

* lightweight
* clean
* fully ours

Now let’s jump in and get started.

## Bun introduction

Before we start creating our project, there is a tool I want to introduce that we'll use throughout the course, and that's **Bun**.

If you haven't heard of it before, Bun is a modern JavaScript runtime, kind of like **Node.js**, but faster and more integrated.

With Node, we typically rely on multiple tools:

* **npm** to install packages
* **ts-node** to run TypeScript
* **nodemon** to restart the server when we make changes

With Bun, we get all of that in one tool.

It is:

* a runtime
* a package manager
* a task runner
* a TypeScript transpiler

So we can run TypeScript files out of the box, and we don't need to install a bunch of extra tools just to get started.

If you're more comfortable using Node, that's totally fine. Everything I'm going to show you can be done with Node as well.

But if you follow along with Bun, you will probably find the experience:

* cleaner
* honestly, a lot more enjoyable

### Installing Bun

Head over to **Bun.sh**, and on the homepage, find the installation instruction for your operating system.

Then:

* copy the command
* run it in a terminal window
* follow the instructions in the terminal

Here on Mac, we have to execute:

`exec /bin/zsh`

To verify that Bun is installed properly, run:

`bun --version`

On this machine, I'm running **Bun version 1.2.17**.

## Creating the project structure

In the next lesson, we'll talk about our project structure.

To create our project structure:

* open a terminal window
* go somewhere on your machine
* create a directory
* cd into that directory
* run `bun init`

I'm going to go to my desktop.

Next, we create a directory. Let's call it `my-app`, or whatever you want.

Then we `cd` into this directory and run:

`bun init`

This is the same as `npm init`, so it creates:

* a `package.json` file
* some additional files

### Selecting the project template

First, we answer the question to select a project template.

We have:

* `blank`
* `react`
* `library`

Let's select **blank**.

This creates a few files:

* a `.gitignore` file
* a rule file for the Cursor editor
* an `index` file
* a TypeScript configuration file
* a `README` file

It also installs **TypeScript**.

### Initial project files

Now let's open this with **VS Code**.

Here's what we get:

* a directory for the Cursor editor
* a `node_modules` directory
* a `.gitignore` file
* a `bun.lock` file
* an `index` file, which is just a console log statement
* a `package.json` file, just like a Node project
* a `README` file
* a TypeScript configuration file

I'm not using Cursor, so it's safe to delete the Cursor directory.

### Setting up a workspace

To set up a full-stack project, we're going to use something called a **workspace**.

A workspace is a feature built into Bun that lets us manage multiple sub-projects, like:

* a client application
* a server application

We manage them from a single place.

This is also available in Node projects.

By convention, we put our sub-projects inside a directory called `packages`.

So here we create:

* `packages/client`
* `packages/server`

### Declaring workspaces in package.json

Next, we go to our `package.json` file and declare our workspaces.

We add a new property called `workspaces` and set it to an array of strings.

Here we type the paths to our sub-packages:

* `packages/client`
* `packages/server`

There is also a shorthand syntax.

Instead of listing each directory explicitly, we can use:

* `packages/*`

That means all directories under `packages` should be treated as workspaces.

So we can replace the explicit entries with the wildcard version.

At this point, our project structure is ready.

Over the next few lessons, we'll create the client and server applications independently.

### Initializing Git

I also want to initialize a Git repository here.

So let's open the terminal window and run:

`git init`

Then we make our first commit:

`Initial commit`

### Wrap-up

At this point, we have:

* installed Bun
* initialized a new project with `bun init`
* selected the `blank` template
* reviewed the generated files
* set up a workspace-based full-stack structure
* created `client` and `server` sub-project folders
* initialized a Git repository
* made the first commit


## Creating the Backed

Now to create our server application, here in the terminal, we go to the `packages/server` directory and run `bun init` one more time to create the subproject in this directory.

```bash
cd packages/server
bun init
```

We select `blank`.

Back in the project, here in the server directory, we have the same files you saw in the previous lesson. We don’t need the Cursor directory, so let’s get rid of it and clean up our project.

### Installing Express

Now back to the terminal.

Next, we should install **Express** as our web server.

In Node projects, we run `npm install` or `npm i`. In Bun projects, we run `bun add`.

With Node projects, we have two different tools: **Node** for running our code, and **npm** for installing dependencies. But in Bun projects, all these features are integrated into **Bun**.

So we run:

```bash
bun add express
```

We should also install Express types for TypeScript as a development dependency. To do that, we run:

```bash
bun add -d @types/express
```

### package.json files in the workspace

Now, back to our project.

Here in the server directory, we have this `package.json` file. In this file, we have `express` as a dependency and also `@types/express` as a development dependency.

So in this project, so far, we have two separate `package.json` files:

* one in the root directory
* one inside the server directory

Later, when we create the client project, we’ll also have a `package.json` file in our client directory.

What is interesting about this structure is that in this setup, we don’t have different `node_modules` directories in our server and client applications. So we don’t have a `node_modules` directory inside the server directory.

We only have one at the top level, where we have all the client and server dependencies.

So right now, we have **Express**, as well as all its dependencies, installed in this top-level directory.

### Creating a basic web server

So we have installed Express.

Now, let’s create a basic web server.

We go to the server directory and open `index.ts`.

Here on the top, first we import the `express` function from the `express` module. We call this function and get an object which we call `app`.

Next, we declare a constant called `port`. We can initialize it from an environment variable. To do that, we use `process.env.PORT`.

This is useful in production environments. But if this environment variable is not defined, we can give this a default value of `3000`.

Then we define a route. Here we call `app.get` and give it two arguments:

* a path, like `/`, which represents the root of our web server
* a function that gets executed when we receive a request at this endpoint

This function should have two arguments:

* a request
* a response

Here we use a lambda function, and in this function we just want to send the **Hello World** message to the client.

So we call `response.send()` and pass `"Hello World!"`.

So far, we have been writing plain JavaScript code. There is no TypeScript here, but we can annotate these arguments with types.

So on the top, we can import the `Request` and `Response` types from the `express` module, and then annotate these parameters with `Request` and `Response`.

After that, we should start our web server. So we call `app.listen` and give it two arguments:

* the port
* a callback function that gets executed when the web server is up and running

Again, we use a lambda function, and here we can log a message with `console.log()`.

We replace single quotes with backticks so we can use a template literal and insert the port dynamically.

The full file looks like this:

```ts
import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (request: Request, response: Response) => {
  response.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

### Running the server

Now to run this, we go back to the terminal, and here in the server directory, we run:

```bash
bun run index.ts
```

Our server is running.

If you hold down `Command` on Mac or `Control` on Windows and click the URL in the terminal, it opens the web browser. So our web server is set up properly.

### Adding custom scripts

Now, instead of running this command every time, we can define a custom command like `bun start`, just like we do with Node projects.

So first, we stop the running process by pressing:

```bash
Ctrl + C
```

Now we should go to our `package.json` file.

Here in VS Code, we can hold down `Command` on Mac or `Control` on Windows and press `P` to quickly find files.

If we type `package.json`, we can see we have two files:

* one in the root directory
* one in the server directory

So here in the **server** `package.json`, we define our custom scripts.

We add a `scripts` property and define a `start` script that runs `bun run index.ts`.

We also define a custom script called `dev` for running our application in watch mode. So anytime we make changes to our files, Bun will automatically restart our web server.

Important detail: we add the `--watch` option right after `bun` and before `run`.

```json
{
  "scripts": {
    "start": "bun run index.ts",
    "dev": "bun --watch run index.ts"
  }
}
```

### Testing the scripts

Now back in the terminal, let’s test our commands.

First we run:

```bash
bun start
```

Because `start` is a built-in command, this works directly.

The web server starts, and again we can verify it in the browser.

Then we stop it and try the other command.

Now `dev` is a custom command, so we cannot run `bun dev`. Instead, we should run:

```bash
bun run dev
```

Now Bun is watching our files.

So if we go to `index.ts` in the server directory and make a small change, for example remove the exclamation mark from `"Hello World!"`, Bun should restart our web server automatically.

```ts
response.send('Hello World');
```

If we go back to the browser and refresh, the exclamation mark is gone.

### Wrap-up

At this point, we have:

* created the `server` subproject with `bun init`
* cleaned up the generated files
* installed `express`
* installed `@types/express`
* confirmed that dependencies are stored in the shared top-level `node_modules`
* created a basic Express server in `index.ts`
* used `process.env.PORT` with a fallback to `3000`
* defined a route with `app.get()`
* annotated request and response with TypeScript types
* started the server with `app.listen()`
* added `start` and `dev` scripts to `server/package.json`
* enabled watch mode with Bun

## Managing API keys with environment variables

Earlier in the course, I told you that we shouldn’t store API keys in the source code.

For example, we don’t want to declare a constant like this:

```ts
const API_KEY = '1234';
```

because with this, anyone who has access to our source code can use this API key, and we’ll be the one paying for it.

So the right way to manage API keys is by using **environment variables**. That’s what I’m going to show you in this lesson.

### Setting an environment variable manually

First, let’s go back to the terminal window and stop the running process.

If you’re on **Mac or Linux**, you can use the `export` command.

If you’re on **Windows**, you should use the `set` command.

With these commands, we can set an environment variable, which is a variable stored at the operating system level.

By convention, environment variables use **capital letters**.

For example:

```bash
export OPENAI_API_KEY=1234
```

On Windows:

```bash
set OPENAI_API_KEY=1234
```

### Reading the variable in the app

Now back to `index.ts`.

We remove the hardcoded API key from the source code, and inside our route handler we temporarily return the API key by reading it from `process.env`.

```ts
response.send(process.env.OPENAI_API_KEY);
```

Now back to the terminal, we restart the application and go to the homepage.

If everything is set up properly, we should see the value of the environment variable in the browser.

This verifies that we could successfully read the environment variable in our application.

### The problem with manual environment variables

But there’s a problem with this approach.

Every time we want to start our application, first we have to set our environment variables manually, and this is very tedious.

So this is where we use a library called **dotenv** to streamline this process.

### Installing dotenv

First, we stop the running process.

Next, here in the server package, we install `dotenv`.

```bash
bun add dotenv
```

### Creating a .env file

Now we go back to the project, and here in the server directory we add a new file called `.env`.

Inside this file, we can define our environment variable like this:

```env
OPENAI_API_KEY=ABCD
```

I’m using `ABCD` here just to differentiate it from the value we set earlier in the terminal.

Now, if you look at the `.gitignore` file, you can see that `.env` files are excluded from the Git repository by default.

So in the future, when we push this repository to GitHub, the variables that appear here will not be exposed publicly.

This file is for our private use.

### Loading .env with dotenv

To load this in our code, we go to `index.ts`.

At the very top, we import `dotenv` and call `dotenv.config()`.

This should be the **first line in the module**.

```ts
import dotenv from 'dotenv';
dotenv.config();
```

What this does is:

* it reads the variables declared in `.env`
* it stores them as environment variables
* it does this before the rest of the application runs

Then we can keep reading the variable the same way as before:

```ts
response.send(process.env.OPENAI_API_KEY);
```

So at this point, the file looks like this:

```ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (request: Request, response: Response) => {
  response.send(process.env.OPENAI_API_KEY);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

> ### Why the value may not change?

Now back to the terminal, we restart the application.

dotenv tells us it is injecting environment variables from our `.env` file.

But if we go back to the browser and refresh, the value may still not change.

What’s going on?

The variable we declared earlier in the terminal window overrides the variable declared in our `.env` file.

So if `OPENAI_API_KEY` already exists in the shell, that value takes precedence over the one in `.env`.

### Removing the old terminal variable

To fix this, we have to remove the environment variable we set earlier.

If you’re on **Mac or Linux**, use:

```bash
unset OPENAI_API_KEY
```

If you’re on **Windows**, use `set` and assign an empty value:

```bash
set OPENAI_API_KEY=
```

Now we restart the application again and refresh the homepage.

At this point, we should see the updated value from the `.env` file.

Beautiful.

### Replacing the placeholder with the real API key

Now that everything works, we can go back to the `.env` file and replace the placeholder value with the real API key.

```env
OPENAI_API_KEY=your_real_api_key_here
```

### Adding .env.example

There is still one problem here.

If we commit our code to a Git repository, someone else cloning the project has no idea what environment variables they are supposed to define.

So to help them, we duplicate the `.env` file and rename it to `.env.example`.

This file is **not** excluded from the Git repository, so others can see what variables they should set.

In this file, we keep the variable names, but we remove the actual values.

```env
OPENAI_API_KEY=
```

This gives other developers a template without exposing any secrets.

### Reverting the route handler

Now back to `index.ts`, we revert the temporary test code and return **Hello World** to the client again.

So instead of returning the API key, we go back to this:

```ts
app.get('/', (request: Request, response: Response) => {
  response.send('Hello World!');
});
```

At this point, we’re done setting up our API key.

### Final commit

Now the final step is to make a commit:

```bash
git add .
git commit -m "manage OpenAI API key"
```

> ### Important note about .env changes
One more thing before we finish this lesson.
If we make any changes in the `.env` file, we have to restart the application.
Bun will not detect changes in this file automatically, which means we have to:

> * stop the running process
> * restart the application

> so the new values are injected into the environment variables.

### Wrap-up

At this point, we have:

* removed the API key from source code
* learned how to set environment variables manually
* read environment variables with `process.env`
* installed and configured `dotenv`
* moved the API key into a `.env` file
* understood that shell variables override `.env` variables
* created a `.env.example` file for other developers
* restored the route handler after testing
* committed the setup to Git



## Creating the frontend application

Now to create our frontend application, we’re gonna use **Vite**.

Vite is a very popular build tool for frontend applications. You have probably seen it before.

So here on `vite.dev`, let’s go to **Get started**.

On this page, you can see the command for creating a new Vite project. With NPM, we run:

```bash
npm create vite@latest
```

You also have support for **Bun**. Let’s copy that command.

## Setting up the client terminal

Now, back to VS Code, let’s open a new terminal window.

In this application, we’re going to have two terminal windows open:

* one for the server
* one for the client

For clarity, we can rename them:

* `server`
* `client`

We can also color code them if we want. For example:

* make the server green
* use another color for the client

## Creating the Vite app in the current directory

Now let’s go to the `packages/client` directory, paste that command, but don’t execute it yet.

If we run it as-is, Vite will create a subdirectory here, which is not what we want.

So instead, we use a `.` to tell Vite to create the final application in the **current directory**.

```bash
cd packages/client
bun create vite .
```

Now we can go ahead.

First, we select our framework, which is going to be **React**.

Next, we select a variant.

We’re going to go with **TypeScript**.

### Project structure

Now back to our project.

Here in the client directory, we have a typical React project created with Vite. There is nothing magical here.

In this directory, we also have a `package.json` file.

So currently, we have **three** `package.json` files:

* one at the root
* one for our server application
* one for the client application

### Installing dependencies with Bun

Now back to the terminal.

The next step is to install dependencies using **Bun**.

We can run:

```bash
bun install
```

or the shorter version:

```bash
bun i
```

This installs all the dependencies inside our **top-level `node_modules` directory**.

So once again, we’re not going to have different `node_modules` directories in the client and server applications.

### Running the client application

Now that the dependencies are installed, we can run our application by executing:

```bash
bun run dev
```

`dev` is a custom script defined in the client `package.json` file.

If we open that file, we can see the scripts Vite created for us:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

So now let’s run our client application:

```bash
bun run dev
```

If everything is set up properly, Vite starts the development server and we can open the app in the browser.

Here we should see the default React project.

Lovely.

### Wrap-up

At this point, we have created the frontend application with **Vite**, selected **React** with **TypeScript**, installed the dependencies with **Bun**, and confirmed that the client app runs correctly.

Now let’s wrap up this lesson by making a commit:

```bash
git add .
git commit -m "create the frontend"
```


## Connecting the frontend and backend

Now to connect our client and server applications, we go to our server application and define a new endpoint.

We press `Command + P` on Mac or `Control + P` on Windows and open `index.ts`, the one in the server directory.

Here, we grab the route handler we already have and duplicate it.

A useful shortcut here is **Copy Line Down**. On Mac, the shortcut is:

```text
Option + Shift + Down
```

So with the line selected, we can duplicate it quickly and reuse the existing route.

### Adding a new API endpoint

We change the path to:

```ts
'/api/hello'
```

And instead of returning plain text, we return a JSON object with a `message` property.

So the server code becomes:

```ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (request: Request, response: Response) => {
  response.send('Hello World!');
});

app.get('/api/hello', (request: Request, response: Response) => {
  response.json({ message: 'Hello World!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

Before going further, we test this in the browser by visiting:

```text
http://localhost:3000/api/hello
```

If everything is working, we should see the JSON response.

If the JSON is not pretty formatted on your machine, you can install a browser extension like **JSON Formatter**.

### Moving to the client

Now we move to the client side and open `App.tsx`.

This file is the container for our client application.

We delete the existing imports and remove the code inside the component function.

Instead of manually selecting lines, there is another useful shortcut: **Expand Selection**.

On Mac, that is:

```text
Control + Shift + Command + Right
```

With the cursor on a line, pressing the right arrow expands the selection step by step. Pressing the left arrow shrinks it.

That makes it easy to quickly select the body of the function and replace it without manually dragging across lines.

### Fetching data from the API

Now here we declare a state variable using the `useState` hook. We initialize it to an empty string and call it `message`.

Then we use the `useEffect` hook to make an API call to our backend.

This is just a quick demo. There are better ways to make API calls, and we’ll look at those later in the course.

The idea is simple:

* call `fetch('/api/hello')`
* convert the response to JSON
* take `data.message`
* store it in state

Then we render that message in a paragraph.

So `App.tsx` becomes:

```tsx
import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return <p>{message}</p>;
}

export default App;
```

A couple of important details here.

The second argument to `useEffect` is an empty dependency array:

```tsx
[]
```

That means this code runs only once when the component mounts.

This is basic React behavior, so you should already be familiar with the concept.

> ### Why this fails at first ?

At this point, if we run the client application, this is going to fail.

The reason is that `/api/hello` does not exist in the client application. That endpoint only exists in the server application.

So if the client tries to request:

```text
/api/hello
```

it looks for that route on the Vite dev server, not on Express.

That is why we need a proxy.

### Setting up a proxy in Vite

To solve this, we go to `vite.config.ts`.

Inside the config object, we add a `server` property, then a `proxy` object, and map all requests starting with `/api` to our backend running on port `3000`.

So the config looks like this:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
```

What this means is that a request like:

```text
/api/hello
```

will automatically be forwarded to:

```text
http://localhost:3000/api/hello
```

So the client can keep using relative API paths, and Vite handles the forwarding for us during development.

### Testing the connection

With that in place, we go back to the browser, open the client application, and refresh.

Now the frontend successfully talks to the backend, and we should see the **Hello World!** message rendered on the page.

At this point, the message may still appear in the center of the screen. That is just because of the default styling that Vite generated for us.

### Cleaning up the default styles

To fix that, we go to `index.css` and delete all the default styles.

We’ll come back and work on styling later.

So for now, `index.css` can simply be emptied out.

```css
/* empty for now */
```

After refreshing the page again, the layout looks much cleaner.

### wrap up

At this point, we have:

* added a new backend endpoint at `/api/hello`
* returned JSON from Express instead of plain text
* updated the React app to fetch data from the backend
* stored the response in state with `useState`
* triggered the API call with `useEffect`
* configured a Vite proxy for all `/api` requests
* removed the default Vite CSS so the UI is no longer centered


Now let’s wrap up this lesson by making a commit:

```bash
git add .
git commit -m "connect the frontend and backend"
```


## Running both apps with a single command

With our current setup, every time we want to start this application, we have to open two terminal windows:

* one to start the server using `bun run dev`
* the other to start the client using the same command

This is tedious, so in this lesson, I’m going to show you a simple way to start both applications using a single command.

First, we stop the client and the server.

Now we open a new terminal window. Make sure this is pointing to the **root of the project**.

### Installing concurrently

Here we install a dependency as a development dependency called `concurrently`.

Make sure to spell it properly.

```bash
bun add -d concurrently
```

With this library, we can start multiple applications using a single command.

### Updating the root `index.ts`

To do this, we go to `index.ts` in the root directory.

Currently, we have a `console.log` statement there, so let’s get rid of it.

Instead, we import the `concurrently` function from the `concurrently` module and call it with an array of commands.

Each command is responsible for starting one application.

So the root `index.ts` becomes:

```ts
import concurrently from 'concurrently';

concurrently([
  {
    name: 'server',
    command: 'bun run dev',
    cwd: 'packages/server',
    prefixColor: 'cyan',
  },
  {
    name: 'client',
    command: 'bun run dev',
    cwd: 'packages/client',
    prefixColor: 'green',
  },
]);
```

Here’s what each property does:

* `name` gives a label to the process
* `command` is the command we want to run
* `cwd` is the current working directory where that command should run
* `prefixColor` gives that process a color in the terminal output

So for the server, we run:

```bash
bun run dev
```

from:

```text
packages/server
```

And for the client, we run the same command from:

```text
packages/client
```

Because both processes are now sharing a single terminal window, assigning different colors makes it easier to distinguish their logs.

In this setup:

* the server is `cyan`
* the client is `green`

### Adding a root script

Now, to simplify things, we go to the `package.json` file in the root directory and define a custom script there.

```json
{
  "scripts": {
    "dev": "bun run index.ts"
  }
}
```

With this in place, starting both applications becomes much simpler.

### Running both apps

Now back to the terminal.

Since we are in the root directory, we can run:

```bash
bun run dev
```

This starts both applications at once.

In the terminal, we should see:

* server messages in cyan
* client messages in green

### Verifying the setup

Now we go back to the browser and refresh the application.

If everything is working properly, both the frontend and backend should be running exactly as before, but now they are being launched together from a single command.

Beautiful.

With this, we no longer need separate terminal windows for the server and client.

### wrap up

At this point, we have:

* installed `concurrently` as a dev dependency
* replaced the root `index.ts` with a concurrent runner
* configured one process for the server
* configured one process for the client
* added a root `dev` script
* made it possible to run the whole app with a single command


Let’s wrap up this lesson by making a commit:

```bash
git add .
git commit -m "run both apps together"
```


## Styling the application with Tailwind CSS

To style our application, we’re going to use **Tailwind CSS**.

If you haven’t used Tailwind before, it’s a **utility-first CSS framework**, which means it gives us a bunch of small, descriptive CSS classes like `flex`, `pt-4`, which is short for padding-top-4, `text-center`, and so on.

So we can use these classes directly in our markup to style our elements.

With this approach, all the styling lives right here in the markup, so we don’t have to go back and forth between a CSS file and a TSX file.

Some people love this, others not so much, but in this course our focus isn’t on styling, it’s on building AI-powered features.

So we’ll keep styling to a minimum, and we’ll use Tailwind because:

* it’s a very popular framework
* it shows up a lot in job descriptions
* it lets us move quickly without spending much time on CSS

If you’re not familiar with it, I highly recommend learning it.

### Installing Tailwind CSS

Head over to `tailwindcss.com`, go to the documentation, and follow the installation instructions.

Since we are using **Vite**, we follow the Vite setup.

The first step, creating the project, is already done.

Next, to install Tailwind, we need to install two libraries.

We’re not going to use NPM here, so from the client package we run:

```bash
cd packages/client
bun add tailwindcss @tailwindcss/vite
```

### Configuring the Vite plugin

The next step is configuring the Vite plugin.

We go to `vite.config.ts`, import Tailwind CSS on the top, and add it to the list of plugins.

So `vite.config.ts` becomes:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
```

The important part here is that `tailwindcss` is a function, so we need to call it:

```ts
tailwindcss()
```

### Importing Tailwind in the root CSS file

Next, we import Tailwind CSS in our root CSS file.

We go to `index.css` and add:

```css
@import "tailwindcss";
```

That’s it.

At this point, Tailwind is set up and we can start using its utility classes in our components.

### Styling the message

Now we go to `App.tsx` and style the message.

First, we can make the text bold:

```tsx
return <p className="font-bold">{message}</p>;
```

That already gives us a better result.

Next, we can add some padding:

```tsx
return <p className="font-bold p-4">{message}</p>;
```

Here, `p-4` means padding of `1rem`, which is `16px`.

So this utility class is basically a shorthand for applying padding without writing custom CSS.

We can also make the text larger:

```tsx
return <p className="font-bold p-4 text-3xl">{message}</p>;
```

So now the full component looks like this:

```tsx
import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return <p className="font-bold p-4 text-3xl">{message}</p>;
}

export default App;
```

### Tailwind VS Code extension

By the way, I highly recommend installing the Tailwind extension in VS Code so you get autocomplete while writing these classes.

In the Extensions panel, search for:

* **Tailwind CSS IntelliSense**

That’s the extension I’m using.

It makes writing Tailwind classes much easier because it gives you suggestions directly in `className`.

### wrap up

So that was the basics of Tailwind.

We installed it, configured the Vite plugin, imported it into our root CSS file, and used a few utility classes to style our message.

As we go through the course, I’m going to show you some additional features.


Let’s wrap up this lesson by making a commit:

```bash
git add .
git commit -m "set up Tailwind CSS"
```

## Setting up ShadCN UI

All right, we set up **Tailwind**. Now we’re gonna set up a UI component library to speed things up, and that’s **ShadCN**.

In case you haven’t used it before, it’s a collection of beautifully designed, accessible, and customizable components.

Here on their homepage at `ui.shadcn.com`, you can see various examples. They have all these beautiful, modern, customizable components that we can easily add to our projects.

So let’s follow the documentation.

### Updating the TypeScript configuration

First, we select our framework, which is **Vite**.

We have already created our project, so we can move on.

Next, the docs ask us to add Tailwind, because ShadCN is built with Tailwind. We already did that in the previous lesson, and we also imported Tailwind in our `index.css` file.

So now we should modify our TypeScript configuration files.

In the current version of Vite projects, we have **three** TypeScript configuration files:

* `tsconfig.json`
* `tsconfig.app.json`
* `tsconfig.node.json`

We only need to modify **two** of them.

First, we go to `tsconfig.json` and add `compilerOptions`.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Then we go to `tsconfig.app.json`.

In this file, `compilerOptions` already exists, so we only add `baseUrl` and `paths` inside it.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

So the goal here is to enable path aliases like:

```ts
@/components/ui/button
```

instead of long relative imports.

### Updating the Vite configuration

Next, we should update our Vite configuration file.

First, we install Node types.

```bash
bun add -d @types/node
```

Now we go to `vite.config.ts`.

First, we import `path` on the top.

Then, since we already set up Tailwind in the previous lesson, we keep the existing Tailwind import and plugin.

Next, we add a `resolve` property so Vite understands the `@` alias.

So `vite.config.ts` becomes:

```ts
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
```

At this point, both TypeScript and Vite understand that `@` should point to the `src` directory.

### Running the ShadCN CLI

Now we can run the **ShadCN CLI**.

With this CLI, we can easily add components to our project.

We use `bunx`, which is like `npx` for running packages.

So from the `client` directory, we run:

```bash
bunx shadcn@latest init
```

ShadCN asks us what base color we want to use.

We have a few options, like:

* `neutral`
* `gray`
* `zinc`
* `stone`
* `slate`

The difference is basically the color tone.

For example:

* `stone` has a warmer tone
* `zinc` has a cooler tone
* `neutral` is more balanced

I’m going to go with **neutral**.

### What the CLI generates

After running the CLI, a file called `components.json` is created.

This file keeps track of the components we install.

So if we open it, we’ll see internal configuration used by the CLI.

We’re not going to modify this manually. Later, when we add components, this file will keep track of them for us.

The CLI also modifies our `index.css` file.

In the previous lesson, `index.css` only imported Tailwind:

```css
@import "tailwindcss";
```

Now it also includes additional theme variables.

So inside `index.css`, we now have a bunch of extra CSS for things like:

* base theme variables
* colors
* radius
* spacing-related tokens

All of that is part of the ShadCN setup, and we can always customize it later if we want.

### Installing the Button component

Now we’re ready to install components.

If we go to the components page in the docs, we can see all the available components.

In this lesson, we’re going to add a **Button**.

To do that, we use `bunx` again:

```bash
bunx shadcn@latest add button
```

Now the Button component becomes part of our project.

What’s nice about this approach is that the component code is added directly into our codebase. So we fully own it.

If we inspect it, we’ll see the source code under something like:

```text
src/components/ui/button.tsx
```

and inside that file, the styling is built with Tailwind classes.

That means we can customize the component however we want.

### Using the Button in App.tsx

Now let’s see how we can use it.

We go to `App.tsx`.

First, we wrap the returned JSX in parentheses so we can format it across multiple lines.

Then, below the paragraph, we add a `Button` component and import it from `components/ui/button`.

So `App.tsx` becomes:

```tsx
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <>
      <p className="font-bold text-3xl">{message}</p>
      <Button>Click me</Button>
    </>
  );
}

export default App;
```

Because we now have multiple elements, we wrap them in a single root element.

Here I’m using a fragment:

```tsx
<>
  ...
</>
```

### Adding spacing around the content

Back in the browser, the button looks good, but it’s too close to the edge of the screen.

So instead of returning a fragment, we can return a `div` and give it some padding.

We move the padding to the wrapper and remove it from the paragraph.

So now the component becomes:

```tsx
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div className="p-4">
      <p className="font-bold text-3xl">{message}</p>
      <Button>Click me</Button>
    </div>
  );
}

export default App;
```

Now the padding applies to the whole block instead of just the text, and the result looks much better.

### wrap up

At this point, we have:

* configured TypeScript path aliases
* updated Vite to support the `@` alias
* installed `@types/node`
* initialized ShadCN
* generated `components.json`
* updated `index.css` with theme variables
* added the `Button` component
* imported and rendered it in `App.tsx`
* wrapped the UI in a padded container


So let’s wrap up this lesson by making a commit:

```bash
git add .
git commit -m "set up shadcn ui"
```


## Automating Git hooks with Husky

In the last lesson, I showed you how we can format our code before committing it to Git, and I told you that this is a good practice to follow before committing our code to Git and sharing it with others.

But there’s a problem.

What if we forget to run this command before we make a commit?

This is where **Husky** comes in.

With Husky, we can automate our Git workflow, so we can run certain commands, like formatting our code or running tests, before committing or pushing our code.

### Installing Husky

To get started, we go to `typecode.github.io/husky`, then to the GitHub page.

First, we install Husky as a development dependency.

```bash
bun add -d husky
```

Next, we initialize Husky:

```bash
bunx husky init
```

What this does is create a pre-commit script in the `.husky` directory.

### The pre-commit hook

Now back in the project, we have a `.husky` directory, and inside it we have a `pre-commit` script.

In this file, we can add any commands that should be executed before committing our code.

By default, it tries to run:

```sh
bun test
```

That makes sense in projects that have tests, but in this project we don’t have any tests yet.

So at first glance, we might think we should replace that with:

```sh
bun run format
```

But there’s a problem with that approach.

If we format the entire codebase before every commit:

* the operation gets slower as the project grows
* files unrelated to our current work may get reformatted
* those unrelated formatting changes may end up inside the commit

That makes the Git history noisy and misleading, because later we’ll see files modified just as a side effect of formatting.

So instead of formatting the entire codebase, we should format only the **staged files**.

### Using lint-staged

To do that, we use another library called **lint-staged**.

With this library, we can execute tasks only on staged files.

So back in the terminal, we install it as a development dependency:

```bash
bun add -d lint-staged
```

Then we go back to our pre-commit script and replace the default command with:

```sh
bunx lint-staged
```

So now our `.husky/pre-commit` file looks like this:

```sh
bunx lint-staged
```

### Configuring lint-staged

Next, we need to tell lint-staged what tasks to perform and on which files.

To do that, we add a new file in the root of the project called:

```text
.lintstagedrc
```

Make sure to spell it properly.

In this file, we define a pattern for the files we care about and the command we want to run on them.

For example:

```json
{
  "*.{js,jsx,ts,tsx,css}": "prettier --write"
}
```

This means:

* match any staged file
* if its extension is `js`, `jsx`, `ts`, `tsx`, or `css`
* run `prettier --write` on that file

The important detail here is that we do **not** run Prettier on the whole project.

We only run it on the staged files that match this pattern.

So to recap:

* Husky runs the `pre-commit` script
* the `pre-commit` script runs `lint-staged`
* `lint-staged` reads `.lintstagedrc`
* then it runs Prettier only on the staged files that match the configured pattern

### Testing the setup

Now to see this in action, we can go to `App.tsx` and make a few changes.

For example:

* add an exclamation mark
* mess up the formatting
* remove a semicolon

The idea is to leave the file intentionally messy and then make a commit.

If the hook is working properly, the file should be formatted automatically before the commit goes through.

### A VS Code issue with bunx

At the time of this recording, there is a problem.

When committing from the VS Code source control panel, we may get an error saying that the `bunx` command cannot be found.

This does **not** happen if we make the commit from the terminal.

So one way to solve this is simply to commit from the terminal:

```bash
git add .
git commit -m "set up husky"
```

If we do that, the commit works, and when we open `App.tsx` again, we can see that the file has been formatted automatically.

For example, the missing semicolon is back and the formatting is clean again.

### Workaround: use npx instead of bunx

If that VS Code issue happens on your machine and you really want to keep committing from the source control panel, the workaround is to replace `bunx` with `npx` in the pre-commit hook.

So instead of:

```sh
bunx lint-staged
```

we use:

```sh
npx lint-staged
```

This is not ideal, because we decided to use Bun throughout the project, but if you prefer committing from VS Code, this workaround fixes the issue.

### Verifying the workaround

To verify that this works, we can go back to `App.tsx`, mess up the formatting again, and make another test commit.

For example:

```bash
git commit -m "test husky"
```

If the commit succeeds and the file is formatted, then the workaround is working.

### Removing the test commit

I don’t want to keep that test commit in the history, so we remove it.

First, we can inspect the recent history:

```bash
git log --oneline
```

The `HEAD` pointer is now on the latest test commit, and we want to move it back by one commit.

So we run:

```bash
git reset --hard HEAD~1
```

Then if we check the log again:

```bash
git log --oneline
```

we can verify that the test commit is gone and `HEAD` is pointing to the previous commit again.

### Final result

At this point, we have:

* installed **Husky**
* initialized Git hooks with `bunx husky init`
* replaced the default test hook
* installed **lint-staged**
* configured lint-staged to run **Prettier** only on staged files
* avoided formatting the entire codebase on every commit
* handled the VS Code `bunx` issue
* learned a fallback using `npx`
* verified the hook works
* cleaned up the test commit from Git history


In the next section, we’ll start building our first project.
