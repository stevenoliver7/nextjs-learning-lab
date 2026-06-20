# Lesson 4: Promises and Async in JavaScript

[warm, conversational]

Alright Daniel, welcome back to lesson four. This is the one I've been looking forward to, and also the one I almost got completely wrong. My original plan was to lean on Python's asyncio library as a bridge into JavaScript promises. And then you told me, very honestly, that you haven't actually written asyncio code. Which means my planned bridge was a bridge from a place you don't live to a place you're trying to get to. Useless.

So we're rebuilding this lesson from scratch. We're starting from synchronous Python, which you do know, and we're going to build up the whole story of asynchronous code — what it is, why it exists, why JavaScript in particular is obsessed with it, and how the syntax actually reads — entirely from first principles. No asyncio knowledge assumed. By the end of this lesson, when you open a Next.js file and see the word `async` in front of a function, or you see `await fetch` in the middle of a line, you'll know exactly what's happening under the hood. You'll see the event loop in your mind's eye. You'll understand why the code is written that way and not another way.

[thoughtful]

Let me set the stage. The biggest single conceptual shift when you go from Python to JavaScript is this: in JavaScript, asynchronous code is not an optional library you import when you need it. It's woven into the language itself, into the runtime, into the way the browser and Node.js are built. You can write synchronous Python code for an entire career and barely touch async. You cannot write non-trivial JavaScript without bumping into promises and async within the first hour. It's everywhere. Every Next.js data fetch, every API call, every file read, every database query, every timer, every user interaction — async, async, async. If you don't have a mental model for it, you will be lost in every real codebase you open.

So let's build the mental model. And to do that, I want to start somewhere familiar — a plain, boring, synchronous Python script — and then I want to break it, carefully, in a way that forces us to reinvent async code ourselves.

[conversational]

Imagine you're writing a tiny Python program. It does three things. First, it reads a file from disk — let's say a config file. Second, it takes the data from that config and uses it to make a web request, maybe hitting some API to check the weather. Third, it prints the result to the screen. Three steps. Read the file, call the API, print the result.

Now, picture how Python executes this. Python has something called a call stack. When your program starts, Python enters the main function and starts executing line by line, top to bottom, exactly one line at a time. When it hits the first line — the one that reads the file — Python calls the built-in `open` and `read` functions, and it waits. It literally stops. Your program is frozen on that line. Frozen. The CPU is not doing anything useful. The hard drive is spinning, the operating system is seeking to the right sector, data is being copied into memory, and your program just sits there, thumbs twiddled, staring at the wall, waiting for that read to finish. When the data finally comes back, Python takes that data and moves to the next line. Line two. The weather API call. And again — Python freezes. It sends a request over the network, maybe the request crosses an ocean, hits a server in some data center in Virginia, the server looks up the weather, formats a JSON response, sends it back across that same ocean — and during every single millisecond of that journey, which could easily be two hundred, three hundred, five hundred milliseconds, your Python program is frozen. Doing nothing. Then finally the data arrives and Python moves to line three and prints.

This is what synchronous code means. One thing at a time. When a line is slow, the whole program is slow. When a line is waiting, the whole program is waiting. And for a little script running on your laptop that's doing one user's request, this is completely fine. Nobody cares. It finishes in half a second and you move on.

But now I want you to change the scenario. Same three steps — read file, call API, print — but imagine this is not a little script. Imagine this is a web server. Imagine it's Django or Flask, and you've deployed it, and now ten thousand people are hitting it simultaneously. Each person triggers those three steps. If the code is synchronous, and each request takes half a second because of that API call, and every request blocks the server while it waits — you have a problem. A big one. Because while you're waiting on the weather API for user number one, users two through ten thousand are in a queue. They can't even start. The server is single-threaded by default. It can only do one thing at a time.

[thoughtful]

Now, Python has solutions to this. Threads. Processes. Gunicorn workers. Asyncio. But all of those are things you add on top of the language, things you reach for when you notice the problem. In Python, synchronous is the default, and asynchronous is an escape hatch you pull when you have to.

JavaScript is the exact opposite. In JavaScript, asynchronous is the default. It's not an escape hatch. It's how the language was designed from day one. And the reason is historical, and it's worth understanding because it explains everything that follows.

JavaScript was born in the browser. Nineteen ninety-five. Brendan Eich, ten days, the whole famous story. And the browser has this absolutely brutal constraint. The browser has one thread — one single thread — that does everything. It runs your JavaScript. It lays out the HTML. It paints the pixels. It responds to your clicks. It animates the scrolling. All of it. One thread. If that thread gets stuck on something — say, a slow network request — everything freezes. The page stops scrolling. Your clicks do nothing. The animation stutters. The browser looks broken.

So JavaScript could not afford the Python approach. If JavaScript let you write "fetch the weather, wait for it, now continue" in a blocking way, every web page that made a network call would freeze the entire browser while it waited. Unacceptable. So from the very beginning, JavaScript was designed so that anything slow — network, timers, user input, file access in Node.js, everything — is non-blocking by default. You literally cannot write a blocking network call in JavaScript. The language doesn't provide one. It doesn't exist. The API simply isn't there. If you want to wait for data, you have to do it asynchronously. There is no other door.

[conversational]

This is the single most important thing to internalize about JavaScript coming from Python. In Python, you ask: "do I need async here?" In JavaScript, the language already answered that question for you: "yes, always, forever, for anything that takes time." The only question left is how you write the syntax.

Let me repeat that because it really is the pivot point of this whole lesson. In Python, blocking is the default and non-blocking is the escape hatch. In JavaScript, non-blocking is the default and blocking doesn't really exist. Every slow operation in JavaScript — every single one — returns something called a promise, and the code that comes after it runs later, once the slow thing is done. This is not an optional pattern. This is how the runtime is built.

Okay. So now we need a mental model for how this actually works. How can a single thread do many slow things at once, if it doesn't have other threads to farm the work out to? The answer is the event loop. And I want to spend real time on this because once you see the event loop clearly, promises and async make complete intuitive sense. Before you see the event loop, they look like arbitrary syntax. After you see it, they look inevitable.

[thoughtful]

Here's the event loop, built from scratch, verbally, the way I want you to visualize it.

Picture a desk. On that desk there are three things. A list, a box, and a clerk. The clerk is the one worker — that's the single JavaScript thread. The list is called the call stack. And the box is called the task queue, sometimes called the callback queue. That's it. One clerk, one list, one box.

When your JavaScript program starts running, the clerk takes a function from your code and puts it on the list, the call stack. The clerk executes that function line by line, top to bottom, exactly like Python would. Synchronous code runs on the call stack, one thing at a time, no magic, no surprises. If you write "let x equal two, let y equal three, print x plus y," the clerk just does it. Done. Boring. Same as Python. Good.

Now here's where it gets interesting. Your code contains a line that says, in effect, "go fetch the weather from this URL." In JavaScript, you do not call a function that blocks. Instead, you hand off the work to something outside the clerk's desk. The browser itself, or Node.js, has background machinery — separate from your JavaScript thread — that can talk to the network. So the clerk says, "Hey, browser, please fetch this URL. When you're done, put a note in my box telling me what to do next." And then — and this is the crucial part — the clerk immediately moves on. The clerk does not wait. The fetch is now happening somewhere else, in some other part of the browser, in C++ code, in the operating system's networking stack, in the actual network card. Not in JavaScript. Not on the call stack. The clerk is free.

The clerk keeps running down your code. More synchronous stuff executes. Maybe you set up event listeners, maybe you render some UI, maybe you do whatever. The clerk is busy with those. Meanwhile, in the background, the weather fetch is traveling across the internet.

[conversational]

Eventually — maybe three hundred milliseconds later — the weather data comes back. The browser's networking code receives the response. But the browser does not barge in and interrupt the clerk. That would be dangerous. JavaScript is single-threaded precisely because concurrent access to shared data causes horrible bugs. So instead, the browser puts a little note in the box — the task queue. That note says, "Hey, the weather fetch you asked about is done. Here's the data. You wanted to run this function when it finished. Please run it at some point."

And now the event loop kicks in. The event loop is a very simple rule. It says: whenever the call stack is empty — whenever the clerk has no synchronous work to do — check the box. If there's a note in the box, take one out and put it on the stack. The clerk then runs that note's function to completion. When that's done, the stack is empty again, and the event loop checks the box again. If the box is empty, the event loop just waits, idle. If a new note appears, it goes on the stack.

That's it. That's the whole event loop. One clerk. One list. One box. Synchronous code runs on the list. Slow things get handed off to the background. When the background finishes, it drops a note in the box. When the list is empty, the event loop pulls notes from the box onto the list and runs them. Forever. That loop is what makes JavaScript able to handle many slow things at once with only one thread. The thread is never blocked waiting on any single slow thing, because the slow thing is always happening somewhere else.

Let me say that whole picture one more time in different words, because it's the foundation of everything else and I want it to really settle in.

[thoughtful]

JavaScript has exactly one thread for running your code. That thread is the only thing that touches your variables and your objects and your DOM. But the browser, or Node.js, has lots of other machinery around that thread — networking, timers, disk access, user input handling — and those things run in their own threads, not yours. When your code needs something slow, your thread asks the machinery to do it and immediately moves on. Your thread never waits. When the machinery finishes, it drops a completion message into a queue. Your thread, after it finishes whatever synchronous work it was doing, checks that queue, grabs the next message, and runs the associated function. The loop that keeps checking the queue is called the event loop. The slow operations, the background things that aren't your thread — they're where the actual waiting happens, and they're the reason your code doesn't freeze.

Okay. I want to pause here and check in. That picture — the clerk, the stack, the queue, the event loop — is genuinely the whole model. Once you have that, promises are just a particular way of writing down "and when the slow thing is done, here's what to do next." If that picture feels shaky, go back and replay the last couple of minutes. If it feels okay, we'll continue and I'll show you what the syntax actually looks like.

[conversational]

Now. Here's where the language design gets interesting. If the browser is going to call you back when a slow thing finishes, you need some way, in code, to say "here's what I want you to do when it finishes." The oldest and simplest way to do this is called a callback. You pass a function as an argument. Literally, you give the fetch machinery a function, and you say, "when you're done, call this function with the result."

This worked. It still works. But it has a famous problem. When you need to chain several slow things — fetch A, then with A's result fetch B, then with B's result fetch C, and then do something with C — you end up passing callbacks inside callbacks inside callbacks. The code indents further and further to the right. It becomes a pyramid. People called it callback hell. I'll describe the shape of it verbally so you can picture it without seeing code.

Imagine you write a line that calls `fetch` and passes it a function. Inside that function, you write another call to `fetch`, and you pass that one another function. Inside that function, a third `fetch`, with a third function. Each function is nested inside the previous one. To read the logic, your eye has to scan rightward, down, rightward, down, rightward, down — a staircase going into the southeast corner of your screen. Now imagine error handling. If any of those fetches fails, you want to handle the error. In callback-style code, error handling has to be threaded through every single level of the nesting. It gets ugly. Really ugly. People wrote entire blog posts in two thousand and twelve about how callback hell was going to kill JavaScript as a serious language.

[thoughtful]

So, starting around two thousand and fifteen, JavaScript introduced a better abstraction. The promise. A promise is, in one sentence, an object that represents a value that isn't here yet but will arrive eventually — or will fail to arrive and give you an error instead. That's the whole concept. A placeholder for a future result. When the `fetch` machinery is doing its work, what it hands back to your code, right now, immediately, is a promise object. The promise is not the data. The promise is a little box that says, "there will be data in here later, or there will be an error in here later, one or the other, eventually." Your code can hold on to that box. Your code can attach instructions to the box — "when the data arrives, do this thing with it." And your code can keep moving. The event loop does the rest.

A promise has three states, and you should just memorize these three words because they come up everywhere. Pending. Fulfilled. Rejected. When you create a promise or receive one from `fetch`, it starts out pending. Pending means the answer isn't here yet. Eventually, one of two things happens. Either the underlying operation succeeds — the data arrives, the response comes back — and the promise transitions into the fulfilled state, carrying the result value inside it. Or the underlying operation fails — network error, server returned a five hundred, whatever — and the promise transitions into the rejected state, carrying an error object inside it. Once it transitions, it's settled. It never changes again. A fulfilled promise stays fulfilled forever. A rejected promise stays rejected forever. Pending, fulfilled, rejected. Three states. One transition. Settled is permanent.

Now, how do you attach instructions to a promise? With a method called `.then`. You take your promise object, and you call `.then` on it, and you pass a function. That function will be called later, with the result value, once the promise fulfills. You can also chain — `.then` itself returns a new promise. So you can say, "when this fetch is done, call this function with the data, and whatever that function returns becomes the next promise, and then do something with that." You keep chaining `.then` calls, each one receiving the output of the previous one. The code flattens out. Instead of a pyramid going into the southeast corner, you get a vertical list of `.then` calls, each line representing a step in the pipeline. It reads top to bottom, like a recipe.

And for errors, instead of handling them at every level, you tack a `.catch` on the end. Any rejection, anywhere in the chain, falls all the way through and gets caught by the `.catch` at the bottom. One place to handle errors for the whole pipeline. Much, much better than callback hell.

[conversational]

Let me make that concrete by describing what a promise chain actually looks like in code, step by step, without asking you to picture curly braces.

You have a variable that holds the result of calling `fetch` with some URL. The call to `fetch` returns a promise right away — immediately, synchronously — not the data, just the promise. You then call `.then` on that variable, and you pass `.then` a function that takes one argument, let's call that argument `response`. Inside that function, you call `response.json()`, which, by the way, is also asynchronous and returns another promise. So you return that promise from the function. Now the outer `.then` call itself returns a new promise — a promise for the parsed JSON. On that new promise, you call `.then` again, and you pass it a function that takes an argument called `data`. Inside that function, you do whatever you want with the data — print it, update the UI, store it in state. Finally, on the end of the whole chain, you call `.catch`, and you pass it a function that takes an argument called `error`. Inside that function, you handle the error however you want to.

So structurally, you have: the initial `fetch` call, then a `.then` that turns the response into parsed JSON, then a `.then` that uses the data, then a `.catch` that handles any failure along the way. Four pieces, stacked vertically, each one operating on the output of the previous one. That's the promise chain idiom. You see this pattern constantly in older JavaScript code and in tutorials from five or six years ago.

[thoughtful]

It's better than callbacks. But it's still not great. Because look at what's happening — we're writing our program, this sequence of steps, as a chain of functions passed to `.then`. The natural way to read a program is top to bottom: do this, then do this, then do this. But with promises, every step is wrapped inside a function argument to `.then`. You're not writing a sequence, you're building a pipeline declaratively. It works, but it doesn't look like normal code. It looks like chained method calls.

So in two thousand and seventeen, JavaScript added one more layer on top of promises. The `async` and `await` keywords. This is the thing you will see ninety percent of the time in modern Next.js code. And here's what it does. It lets you write code that *uses* promises, but looks completely synchronous. Like top-to-bottom, line-by-line, boring old synchronous code. The keywords are just syntactic sugar — the promises are still underneath, the event loop is still running, nothing has changed in the runtime — but the syntax is dramatically more readable.

Here's the rule. If you put the word `async` in front of a function declaration, two things happen. First, that function is now automatically a promise-returning function. Whatever it returns gets wrapped in a promise. If it throws, the promise rejects. If it returns a value, the promise fulfills with that value. Second — and this is the useful part — inside that function, you are allowed to use the word `await` in front of any expression that produces a promise. When you write `await` followed by a promise, the function pauses at that line until the promise settles, and then resumes with the resolved value.

Let me describe that last part more carefully because it's the magic. When you write `await fetch(some URL)`, here's what actually happens under the hood. The `fetch` runs, returns a promise. Your function hits the `await`. And your function's execution is suspended. The function itself pauses, right there, on that line. But — and this is critical — the thread is not blocked. The clerk at the desk is not waiting. Your function's state gets saved, put aside, and the clerk goes back to the event loop, picks up other work, runs other functions, handles other events. Your function is effectively taken off the stack. Later, when the promise from `fetch` fulfills, the event loop finds the saved state of your function and puts it back on the stack, resumed at the line after the `await`, with the resolved value now available as the value of that `await` expression.

From the inside of your function, it looks exactly like synchronous code. Line one: `await fetch`. Line two: do something with the response. Line three: `await response.json()`. Line four: do something with the data. Top to bottom, no indentation pyramid, no `.then` chains, just lines of code. It reads like Python. But underneath, your function is being paused and resumed by the event loop, and the thread is free the whole time to handle other things.

[conversational]

This is what you will see in almost every Next.js file that does data fetching. The word `async` in front of the function declaration, and the word `await` scattered throughout the body of the function, wherever a promise is involved. When you open a Next.js page component or a server function and you see `async function GetUserData` or `async function Page`, what you're looking at is a function that returns a promise, that can internally use `await` to pause on other promises, that will be called by the Next.js runtime, and whose return value — wrapped in a promise — will be handled by the framework when it's ready.

Let me repeat that whole mechanism one more time with different words, because it's subtle and worth hammering on. When you write `async` in front of a function, you are telling JavaScript two things. One, this function's return value will automatically be wrapped in a promise. Callers will receive a promise, not a raw value. Two, inside this function, you may use `await`. When you use `await` on a promise, the function pauses at that point, without blocking the thread. The thread keeps doing other work. When the promise settles, your function resumes from right after the `await` with the resolved value. If the promise rejects, `await` throws — and you can catch that throw with a normal `try`/`catch` block. Which, by the way, is another huge win over the `.then` / `.catch` style — you get to use regular old `try`/`catch` for error handling, just like in Python.

[thoughtful]

There's one more detail I want to burn into your brain before we connect this back to Next.js, because it's a sneaky little gotcha that trips up almost every Python programmer when they first meet `async`. Calling an async function does not execute its body synchronously. It starts the body, runs until the first `await`, and hands you back a promise. That's all you get. If you forget to `await` the result — if you just call the function and move on — your code will keep running, the async function will keep running in the background, and the two will be completely out of sync. You'll print results before they've arrived. You'll return from a function before it's actually done. Every JavaScript developer has made this mistake. It's the number-one async bug. So when you call an async function, you almost always want to `await` its result, or you want to capture its promise and do something intentional with that promise. Unawaited promises are a smell. TypeScript will even warn you about them with the right linting rules on.

Okay. Deep breath. Let me step back and connect all of this to Next.js, because that's the whole point of this journey.

[conversational]

In Next.js, you will see `async` and `await` in three main places, and I want to name each one so you recognize them in the wild.

First place. Data fetching in server components. Next.js lets you write React components that run on the server. When a component runs on the server, it can be declared `async`, and inside it, you can `await` a database query or `await` a `fetch` call to an external API. Next.js will wait for your async component to settle before it sends the rendered HTML to the browser. This is very different from old-school React, where components had to be synchronous and all data fetching happened in special hooks. In Next.js with the app router, async components at the top of the tree are completely normal, even encouraged. When you see `async function Page` in a file called `page.tsx`, this is what's happening — the page is allowed to take its time, do some awaits, fetch some data, and then render.

Second place. Route handlers and server actions. When you write a server endpoint — an API route, a form handler — you write it as an async function. It receives the request, awaits whatever it needs to await, returns a response. This is the server-side Next.js that looks most like a traditional web framework, but with `async` and `await` baked in as the default style.

Third place. Client-side data fetching, usually inside hooks like `useEffect`. When you need to fetch something from the browser after the component mounts, you typically write an async function inside the hook and call it. This is where the "forgot to await" gotcha bites people hardest, because the hook itself isn't async, and you have to structure things carefully. But you'll see the `async`/`await` pattern inside the hook body constantly.

In all three cases, the syntactic shape is the same. The word `async` in front of a function. The word `await` in front of any call that returns a promise — and in Next.js, most interesting things return promises: `fetch`, database clients, cookies, headers, session lookups, anything that touches I/O. If you see `await` in front of it, that operation is slow, and the function is politely stepping aside until it's ready.

[thoughtful]

Let me also give you one survival heuristic for reading Next.js code quickly. When you open a file and see `async` in front of a function declaration, mentally tag that function as "this returns a promise, this might do slow work, this is allowed to pause." When you see `await` in front of an expression, mentally tag that line as "this is a checkpoint — execution stops here until the promise underneath settles." That pair of tags — async marks a function's contract, await marks a pause point inside the body — will let you skim almost any modern JavaScript file and know, within seconds, where the slow stuff is happening.

And one more survival tip. In Next.js code, you will sometimes see functions that don't use the word `async` but still return promises. For example, functions that just return the result of a `fetch` call, or that pass a promise through. Those are perfectly valid. `async` is not the only way to make a promise — it's just the most common way to make one where you want to use `await` inside the body. A function that returns a promise without using `async` is fine, and sometimes even preferred for simple passthroughs. So "returns a promise" is a broader category than "declared async." Every async function returns a promise, but not every function that returns a promise is declared async.

[conversational]

Alright. Let me take stock of where we are in this lesson.

We started from synchronous Python — read file, call API, print result — and we noticed that synchronous code blocks the thread while it waits for slow things. We noticed that in a server context, with many concurrent users, that blocking becomes a big problem. We contrasted that with JavaScript, which was born in the browser where blocking is catastrophic because there's only one thread. We said that JavaScript's answer is to make non-blocking the default — slow operations never block the thread, they happen in background machinery provided by the browser or Node.js, and your code gets notified when they finish.

We built a mental model of the event loop. One thread, called the clerk. One call stack, where synchronous code runs. One task queue, where completion notes accumulate from the background. The event loop rule: when the stack is empty, pull a note from the queue and run it. That's the whole mechanism.

We said that when your code needs to wait for something slow, the slow operation returns a promise — an object representing a future value. Promises have three states: pending, fulfilled, rejected. They settle exactly once. You attach continuations with `.then`, and you handle errors with `.catch`. Chains of `.then` calls flatten out what used to be callback hell, but they still don't read like regular synchronous code.

We said that the `async`/`await` syntax, added in two thousand and seventeen, is syntactic sugar on top of promises. Marking a function `async` means it returns a promise automatically and allows `await` inside its body. Writing `await` in front of a promise pauses the function at that line, frees the thread, and resumes the function when the promise settles. From the reader's perspective, the code looks synchronous, line by line. Underneath, the event loop is doing all the same work it did with `.then` chains.

And we said this matters in Next.js because `async` functions are everywhere — in page components, in server actions, in API routes, in client hooks — and they're the standard way to do any operation that touches the outside world.

[thoughtful]

Before I wrap up with questions I want you to think about, let me give you one more thing. A tiny comparison table, in prose, between Python and JavaScript on the async front. Just so the mapping is clean in your head.

In Python, the default way to make a function is a regular def. That function runs synchronously on the calling thread. If you want async, you write `async def`, you use `await`, and you need an event loop — which asyncio provides, but you have to start it, run it, manage it. Most Python code bases don't use asyncio at all.

In JavaScript, the default way to make a function is `function` or arrow-function syntax. That function also runs synchronously on the calling thread. If you want async, you write `async function`, you use `await`, and you need an event loop — which the JavaScript runtime always provides, automatically, whether you're in the browser or in Node.js or in Next.js. There's no "starting the event loop." It's always on. It's the runtime itself.

So the main practical difference is that in Python, opting into async is a deliberate choice — you import asyncio, you structure your code around it, you run an event loop explicitly. In JavaScript, opting into async is the normal path — the event loop is always running, and promises are the standard return type for almost every interesting operation. You don't opt in. The question is really whether a given function needs to `await` anything. If yes, mark it `async`. If no, don't.

[warm]

Okay, Daniel. Questions to sit with before lesson five. Don't feel like you have to answer them on the spot. These are just to help me tune the next step.

One. Does the mental model of the clerk, the stack, and the task queue feel stable in your head? Could you re-explain it to me in your own words? If not, what part slipped? Was it the handoff from your code to the background machinery? Was it the event loop rule about pulling notes when the stack is empty? Was it how the function resumes after `await`? Any of those I can go deeper on next time.

Two. When I said "marking a function async means it returns a promise automatically, and await inside it pauses without blocking the thread" — did that click? Or did it feel like I was waving my hands a bit? Because that claim is the heart of modern JavaScript, and if it didn't quite land, it's worth spending another pass on.

Three. Are you ready to pivot from concepts into the Next.js project structure — the app directory, the file conventions, pages and layouts and route groups — or would you rather see more hands-on examples of async in action first, maybe a full walk-through of a page component that fetches data and renders it?

Let me know what you want. And if at any point in this lesson I went too fast, too slow, too abstract, too concrete — tell me. The whole point of these is that they're tuned to how you actually learn, not to some generic curriculum.

That's lesson four. Promises, async, await, the event loop, and why JavaScript is built the way it is. Next up, if you give me the green light, we start walking through real Next.js code and the app router itself.

[warm]

Catch you in the next one, Daniel. 🦀
