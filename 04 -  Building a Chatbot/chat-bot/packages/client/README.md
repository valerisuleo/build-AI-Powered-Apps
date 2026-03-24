# Building the frontend

In this section, we’re going to build the input area of our chatbot.

Visually, it looks like this button is part of our text box or text area, but actually it’s not.

Here’s how we’ll structure it. We’ll start with a container with a border and rounded corners. Inside this container, we’ll add a text area without borders. And right below that, we’ll add this round button.

## Creating the Chatbot component

So here in our client application, inside the `components` directory, we add a new file called `Chatbot.tsx`.

To quickly create a React component, we’re going to use a very popular extension.

On the Extensions panel, search for:

* **ES7+ React/Redux/React-Native snippets**

With this extension installed, we can quickly create a React component by typing:

```txt
rafce
```

That is short for **React Arrow Function Export Component**.

It gives us a basic component skeleton with multi-cursor editing. To jump out of it, we press the `Escape` button twice.

Then we can remove the `React` import from the top. We don’t need it.

### Basic component structure

In this component, we want:

* a container
* a text area inside the container
* a button right below the text area

So we start with this:

```tsx
const Chatbot = () => {
  return (
    <div>
      <textarea />
      <button>Send</button>
    </div>
  );
};

export default Chatbot;
```

Here I’m using the native `textarea` element instead of the ShadCN `Textarea` component, because the ShadCN component comes with styling that we would have to override or disable to achieve the look I showed you earlier.

So there is no point in installing it and stripping styles away. It’s easier and more efficient to use the native `textarea`.

### Rendering the component in App.tsx

Now let’s go to our `App` component and add our new `Chatbot` component inside the container.

We can also remove the old code there. We no longer need the state variable and the `useEffect` hook. We added those earlier just for connecting the client to the backend.

So `App.tsx` becomes something like this:

```tsx
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div className="p-4">
      <Chatbot />
    </div>
  );
}

export default App;
```

### Laying the elements out vertically

Back in the browser, at this point we get a text area and a button sitting next to each other.

The first thing we want to do is lay them out vertically.

To do that, we use Flex.

So back in `Chatbot.tsx`, we give the container a few classes:

```tsx
const Chatbot = () => {
  return (
    <div className="flex flex-col">
      <textarea />
      <button>Send</button>
    </div>
  );
};

export default Chatbot;
```

That is better.

But now the two elements are too close to each other, so let’s apply a gap of `2`:

```tsx
<div className="flex flex-col gap-2">
```

Now we have a bit of spacing between them.

### Pushing the button to the right

Next, I want to push the button to the right side.

To do that, we use:

```tsx
items-end
```

So the container becomes:

```tsx
<div className="flex flex-col gap-2 items-end">
```

Now let me explain what is happening here.

With flex containers, we have two axes:

* the main axis
* the cross axis

Here we have a vertical flex container, so the main axis is vertical and the cross axis is horizontal.

Classes that start with `items-` control layout along the cross axis.

So `items-end` means the items should be pushed to the end of the horizontal axis, which in this case is the right side.

### Stretching the textarea

Now the text area is a little too small.

To make it stretch and take up all the available width, we give it:

```tsx
w-full
```

So now we have:

```tsx
const Chatbot = () => {
  return (
    <div className="flex flex-col gap-2 items-end">
      <textarea className="w-full" />
      <button>Send</button>
    </div>
  );
};

export default Chatbot;
```

At this point, the layout is good.

### Styling the textarea

Now let’s work on styling.

First, I want to remove the border from the text area.

So here we apply:

```tsx
border-0
```

But even after removing the border, it still looks like it has one when focused. That is because most modern browsers add an outline by default.

So to remove that outline in focus mode, we use:

```tsx
focus:outline-0
```

I also want to remove the resize handle, because that looks awkward here.

So we add:

```tsx
resize-none
```

Now the `textarea` becomes:

```tsx
<textarea className="w-full border-0 focus:outline-0 resize-none" />
```

### Styling the container

Now let’s add a border to the container.

We give it:

```tsx
border-2
```

Then we add some padding so the text area and the button are not glued to the edges:

```tsx
p-4
```

And finally we round the corners:

```tsx
rounded-3xl
```

So the container becomes:

```tsx
<div className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl">
```

That already looks much better.

### Adding an icon to the button

Next, I want to improve the look and feel of the button by adding an icon.

For that, we’re going to use **react-icons**.

It’s a very popular icon library.

So we open a terminal window pointing to our client application and install it:

```bash
bun add react-icons
```

Now, on the React Icons website, we search for an icon like **up arrow**.

I’m going to use `FaArrowUp` from the Font Awesome collection.

So back in our component, we import it:

```tsx
import { FaArrowUp } from 'react-icons/fa';
```

and replace the button label with the icon:

```tsx
<button>
  <FaArrowUp />
</button>
```

### Making the button perfectly round

Now let’s make the button fully round.

We add:

```tsx
rounded-full
```

But if you look closely, the button is still not perfectly round. That is because `rounded-full` only makes an element truly round if the element is a square.

By default, buttons are rectangles.

So to make it a square, we give it a fixed width and height.

Here I’m using:

* `w-9`
* `h-9`

So the button becomes:

```tsx
<button className="rounded-full w-9 h-9">
  <FaArrowUp />
</button>
```

Now it is perfectly round.

I love it.

### Adding a placeholder and max length

The next thing I want to add is a placeholder.

So on the `textarea`, we set:

```tsx
placeholder="Ask anything"
```

I also want to set a `maxLength` of `1000`, because when building our API we added a validation rule that enforces a maximum prompt length of 1000 characters.

So we add:

```tsx
maxLength={1000}
```


So at this point, `Chatbot.tsx` looks like this:

```tsx
import { FaArrowUp } from 'react-icons/fa';

const Chatbot = () => {
  return (
    <div className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl">
      <textarea
        className="w-full border-0 focus:outline-0 resize-none"
        placeholder="Ask anything"
        maxLength={1000}
      />
      <button className="rounded-full w-9 h-9">
        <FaArrowUp />
      </button>
    </div>
  );
};

export default Chatbot;
```

### Handling form submission with React Hook Form

All right, now that we have built our form, we’re going to make it functional by handling form submission, and for that we’re going to use a popular library called **React Hook Form**.


#### Installing React Hook Form

So let’s go back to our project, open a terminal window pointing to the `client` directory, and install React Hook Form.

```bash
bun add react-hook-form
```

#### Setting up useForm

Now back to our component.

We start by importing the `useForm` hook from `react-hook-form`.

```tsx
import { useForm } from 'react-hook-form';
```

Next, we define a type that represents our form data.

In this form, we have an input field called `prompt`, which is a string.

```tsx
type FormData = {
  prompt: string;
};
```

Now in this component, we call `useForm`.

As a generic type argument, we provide the type that represents our form data, that is `FormData`.

This returns an object, and we destructure it to grab a few functions.

At a minimum, we grab:

* `register`
* `handleSubmit`

So we start with:

```tsx
const { register, handleSubmit } = useForm<FormData>();
```

#### Registering the textarea

Now with this `register` function, we can register our input fields.

So here’s our `textarea`.

We call `register('prompt')`, and because we passed `FormData` to `useForm`, `prompt` is suggested automatically.

We can also provide an options object for defining validation rules.

So here we’re going to say this field is required.

The important detail is that `register()` returns an object with a bunch of props that we should add to the `textarea`.

So we spread that object into the element.

```tsx
<textarea
  {...register('prompt', {
    required: true,
  })}
  className="w-full border-0 focus:outline-0 resize-none"
  placeholder="Ask anything"
  maxLength={1000}
/>
```

#### Converting the container into a form

Now for handling form submission, we’re going to convert the container from a `div` to a `form`.

So instead of this:

```tsx
<div className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl">
```

we use:

```tsx
<form className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl">
```

and of course the closing tag becomes `</form>` too.

For handling form submission, we add `onSubmit`.

I like to order props in a particular way:

* first behavioral props like `onSubmit`
* then styling props like `className`

So here we set:

```tsx
onSubmit={handleSubmit((data) => {
  console.log(data);
})}
```

The function we pass to `handleSubmit` gets called if the form is valid.

That function receives our form data, and `data` is of type `FormData`.

So now the component looks like this:

```tsx
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

type FormData = {
  prompt: string;
};

const Chatbot = () => {
  const { register, handleSubmit } = useForm<FormData>();

  return (
    <form
      onSubmit={handleSubmit(data => {
        console.log(data);
      })}
      className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
    >
      <textarea
        {...register('prompt', {
          required: true,
        })}
        className="w-full border-0 focus:outline-0 resize-none"
        placeholder="Ask anything"
        maxLength={1000}
      />
      <button className="rounded-full w-9 h-9">
        <FaArrowUp />
      </button>
    </form>
  );
};

export default Chatbot;
```

#### Extracting onSubmit into a separate function

Now because the code for submitting the form is going to be multiple lines, I prefer to take it out of the JSX and implement it as a separate function.

So we define a function called `onSubmit`, which takes `data` of type `FormData`.

For now, we just log the data on the console.

```tsx
const onSubmit = (data: FormData) => {
  console.log(data);
};
```

Then we replace the inline arrow function with a reference to `onSubmit`.

Note that I’m just passing a function reference, I’m not calling the function.

```tsx
<form onSubmit={handleSubmit(onSubmit)} className="...">
```

#### Resetting the form after submit

Now in chatbots, once the user types something and submits, the input field is cleared.

So let’s implement that.

We grab another function from `useForm`, which is `reset`.

```tsx
const { register, handleSubmit, reset } = useForm<FormData>();
```

Then inside `onSubmit`, after logging the data, we reset the form.

```tsx
const onSubmit = (data: FormData) => {
  console.log(data);
  reset();
};
```

So now when we submit, the form is cleared.

#### Submitting on Enter

Now, in chatbots, the form should also be submitted if the user presses **Enter**.

That way, they don’t have to explicitly click the submit button.

So on the `textarea`, we handle another event: `onKeyDown`.

We check whether the key is `Enter`.

We only want to submit the form if the user is **not** holding `Shift`, because `Shift + Enter` should insert a new line.

So the logic is:

```tsx
onKeyDown={e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    handleSubmit(onSubmit)();
  }
}}
```

There is one subtle detail here.

`handleSubmit(onSubmit)` returns a function, so in this case we have to explicitly call it with `()`.

That is different from `onSubmit={handleSubmit(onSubmit)}`, where we are just passing a function reference.

#### Preventing the default line break

If we test this now, pressing Enter submits the form, but it also inserts a line break, because that is the default behavior of pressing Enter in a `textarea`.

To prevent that, before submitting the form, we call:

```tsx
e.preventDefault();
```

So now the logic becomes:

```tsx
onKeyDown={e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit(onSubmit)();
  }
}}
```

Now pressing Enter submits the form cleanly, while `Shift + Enter` still inserts a new line.

#### Extracting onKeyDown into a separate function

Just like with `onSubmit`, if we have multiple lines of code here, it’s better to move that logic into a separate function.

So we define another function called `onKeyDown`.

In this case, the type is not inferred automatically, so we annotate it properly.

The type here is:

```tsx
KeyboardEvent<HTMLTextAreaElement>
```

So we import `KeyboardEvent` as a type from React:

```tsx
import { type KeyboardEvent } from 'react';
```

and define:

```tsx
const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit(onSubmit)();
  }
};
```

Then on the `textarea`, we simply pass:

```tsx
onKeyDown={onKeyDown}
```

#### Disabling the button when the form is invalid

Now I want to disable the button and enable it only if the form is valid.

For that, we also grab `formState` from `useForm`.

```tsx
const { register, handleSubmit, reset, formState } = useForm<FormData>();
```

Then on the button, we add the `disabled` prop.

Again, I like to add props about behavior first, then styling props.

So:

```tsx
<button
  disabled={!formState.isValid}
  className="rounded-full w-9 h-9"
>
  <FaArrowUp />
</button>
```

Now initially the button is disabled.

If we type something valid, it becomes enabled.

If we delete the text, it becomes disabled again.

#### Why required is not enough

But there is a problem.

If we type only whitespace, the button becomes enabled, because technically that is still a non-empty string.

So we cannot rely only on `required: true`.

We also need a custom validation rule.

Inside `register`, we add `validate`.

This function takes the field value, trims it, and checks that its length is greater than zero.

```tsx
{...register('prompt', {
  required: true,
  validate: data => data.trim().length > 0,
})}
```

Now if we type only spaces, the form is still invalid.

As soon as we type a real character, the form becomes valid.


So at this point, the component looks like this:

```tsx
import { type KeyboardEvent } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

type FormData = {
  prompt: string;
};

const Chatbot = () => {
  const { register, handleSubmit, reset, formState } = useForm<FormData>({
    mode: 'onChange',
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    reset();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
    >
      <textarea
        {...register('prompt', {
          required: true,
          validate: data => data.trim().length > 0,
        })}
        onKeyDown={onKeyDown}
        className="w-full border-0 focus:outline-0 resize-none"
        placeholder="Ask anything"
        maxLength={1000}
      />
      <button
        disabled={!formState.isValid}
        className="rounded-full w-9 h-9"
      >
        <FaArrowUp />
      </button>
    </form>
  );
};

export default Chatbot;
```





## Posting the data to the server

Now, to post the data to the server, we have to make an HTTP call.

For that, we can either use the `fetch` function or **Axios**.

I prefer Axios because it handles things like:

* JSON parsing
* request cancellation
* error handling

out of the box.

It also has a cleaner and more readable syntax.

### Installing Axios

So let’s go back to the terminal, here in the `client` directory, and add Axios.

```bash
bun add axios
```

Great.

### Importing Axios


So instead of:

```tsx

import axios from 'axios';

const onSubmit = (data: FormData) => {
  console.log(data);
  reset();
};
```

we move toward this structure:

```tsx
const onSubmit = async (data: FormData) => {
  reset();

  const response = await axios.post('/api/chat', {
    prompt: data.prompt,
  });

  console.log(response.data);
};
```

### Destructuring the prompt

Now we can simplify this a bit.

`data` only has one property, and that is `prompt`.

So we can destructure it directly in the function parameter.

That means this:

```tsx
const onSubmit = async (data: FormData) => {
```

becomes:

```tsx
const onSubmit = async ({ prompt }: FormData) => {
```

and then we don’t need to write `data.prompt` anymore.

So now we can write:

```tsx
const onSubmit = async ({ prompt }: FormData) => {
  reset();

  const response = await axios.post('/api/chat', {
    prompt,
  });

  console.log(response.data);
};
```

### Adding the conversation ID

We should also send `conversationId`.

Now where do we get this from?

We should create it the first time the form is loaded, and for that we use the `useRef` hook.

Inside this component, we call `useRef` and initialize it with `crypto.randomUUID()`.

`crypto` is available in all modern browsers, and it gives us a method for creating a new UUID.

So we do this:

```tsx
const conversationId = useRef(crypto.randomUUID());
```

Now, why am I using `useRef` here?

We could also use `useState`, but the `conversationId` should be created once and should not change.

It is not supposed to trigger a re-render.

That is the difference between `useRef` and `useState`.

With `useRef`, we can store values that should persist across renders without causing re-renders.

It’s good for things like:

* timers
* DOM references
* IDs like this one

So now that we have the conversation ID, we pass it to the server with:

```tsx
conversationId: conversationId.current
```

### Awaiting the response

Next, we await the call, get the response, destructure it to grab the `data` property, and finally log it on the console to make sure everything is working.

So this:

```tsx
const response = await axios.post('/api/chat', {
  prompt,
  conversationId: conversationId.current,
});

console.log(response.data);
```

can be simplified to:

```tsx
const { data } = await axios.post('/api/chat', {
  prompt,
  conversationId: conversationId.current,
});

console.log(data);
```

