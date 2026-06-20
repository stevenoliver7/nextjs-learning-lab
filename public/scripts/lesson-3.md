Lesson Three. TypeScript. Interfaces. Types. What they are, why they exist, and how they actually work under the hood. This is the lesson where we bridge your Python brain into the TypeScript world.

So let me start with the fundamental question. You already know JavaScript. It's dynamically typed. Variables can hold anything. You can call any method on any object, and you only find out it was wrong when the code actually runs and throws an error at three in the morning in production. JavaScript is the wild west. And for years, that was fine. People wrote JavaScript, things broke, they debugged, life went on.

But then applications got big. Really big. Facebook's codebase was famously millions of lines of JavaScript. And at that scale, the dynamic typing problem becomes genuinely painful. Someone renames a property on an object, and there's no way to know which of the three hundred files that read that property are now broken, until each one executes. You can't run static analysis. You can't safely refactor. You're flying blind.

So Microsoft, who had a long history with strongly-typed languages like C-sharp, created TypeScript. And the key insight was this: TypeScript is not a new language. It is JavaScript with a type annotation layer on top. Every valid JavaScript file is already a valid TypeScript file. TypeScript adds syntax for saying "this variable is a string" or "this function takes a number and returns a boolean," and then it checks, at compile time, before the code ever runs, whether all of those annotations are consistent. And then it strips all the annotations away and outputs plain JavaScript.

Think of it like this. You know how in Python, you can add type hints to your function signatures, like def process_data(items: list[dict]) -> dict? Those hints are optional. Python will happily run your code with or without them. They exist for linters and IDEs to help you catch mistakes. But at runtime, Python completely ignores them. A function annotated to take a string will accept an integer without complaining.

TypeScript is the same idea, but turned up to eleven. In TypeScript, the type annotations are not just suggestions. The TypeScript compiler, which is called TSC, will refuse to compile your code if the types don't line up. It's a hard gate. The annotations are still stripped before the code runs, just like Python type hints are ignored at runtime. But the TypeScript compiler enforces them rigorously before they ever get stripped.

Now here's where it gets interesting, and where your Python intuition might actually lead you slightly astray. In Python, type hints are essentially comments that your IDE understands. The type system is gradual and optional. You can have some files with type hints and some without, and mypy might catch some issues, but it's all very loose. In TypeScript, the type system is much, much richer and much more deeply integrated into how you write code.

Let me walk through the basics, and then we'll get into the really fascinating stuff.

The simplest type annotations look like this. You write let name colon string equals "Daniel". Or let age colon number equals thirty. Or let is_active colon boolean equals true. That's straightforward. string, number, and boolean are the three primitive types. Notice there's no int versus float distinction. JavaScript only has one number type, a sixty-four-bit floating point, so TypeScript only has number. This is different from Python, where you have int and float as separate types.

Arrays work the way you'd expect. You write let items colon string array, using square brackets after the type name, or the alternative syntax, which is string inside angle brackets with square brackets after. Both mean the same thing: an array where every element is a string.

Objects are where things start to get more interesting. In TypeScript, you describe the shape of an object using what's called an object type. You write something like: let user colon, and then inside curly braces, name colon string, age colon number, email colon string. This says: the variable user must be an object with exactly these three properties, with these specific types.

But here's the thing. Writing out object types inline every time gets tedious fast. And that's where interfaces come in. An interface is a named, reusable description of an object's shape. You write interface User, and then inside curly braces, name colon string, age colon number, email colon string. And then you can use it anywhere: let myUser colon User equals, and then the object literal. It's like defining a dataclass in Python, or a Pydantic model, but purely for type checking. The interface doesn't exist at runtime. It has no runtime behavior. It's a compile-time construct only.

Now, there's another way to do this in TypeScript, called a type alias. You write type User equals, and then the object shape inside curly braces. On the surface, interface User and type User look almost identical. They both describe an object shape. And for simple cases, you can use them interchangeably. But there are important differences, and this is something that trips up a lot of people coming from Python.

Interfaces are open for extension. This means if you declare interface User in one part of your code, and then later, in a different file, you write interface User again with an additional property, TypeScript merges them. The second declaration adds to the first. This is called declaration merging, and it's a feature, not a bug. It's useful for things like augmenting types from third-party libraries.

Type aliases, on the other hand, are closed. You can't redeclare them. If you write type User equals some shape, and then later write type User equals a different shape, TypeScript throws an error. The second declaration conflicts with the first.

Another difference: type aliases can describe things that interfaces can't. You can write type ID equals string or number, creating what's called a union type. You can write type Status equals "active" or "inactive" or "pending", creating what's called a string literal union, which is like an enum but better. You can use type aliases with tuples, with function signatures, with all sorts of compound types. Interfaces are specifically for describing object shapes. Type aliases can describe anything.

So the convention in the TypeScript world is: use interfaces for object shapes, especially public APIs that might be extended. Use type aliases for everything else, unions, intersections, utility types, and complex type compositions. And honestly, a lot of teams just pick one and stick with it for consistency. But now you know the difference.

Now let's talk about the single most important concept in TypeScript, the one that will really make everything click for you, and it's the concept of structural typing.

Python uses what's called nominal typing. Or more precisely, Python's type hint system uses nominal typing. Nominal means "based on names." If you define class Dog and class Cat, and they both have a method called speak, a function that accepts type Dog will not accept a Cat instance, even though they have the same structure. The type checker looks at the name of the class, not the shape of the object. Two classes are different types even if they have identical methods and properties.

TypeScript uses structural typing. This is fundamentally different, and it's the thing that will either confuse you or delight you, depending on how you think about it. In structural typing, the type checker doesn't care about the name of the type. It cares about the shape. If an object has the right properties with the right types, it matches, regardless of what it was declared as.

Here's what I mean. Imagine you write interface Printable, and it says it needs a method called toString that returns a string. And you have a class User that has a toString method that returns a string. In TypeScript, User automatically satisfies Printable. You don't have to explicitly declare that User implements Printable. You don't have to write "implements Printable" anywhere. The type checker just looks at User, sees that it has a toString method returning a string, and says "yeah, that works."

In Python, you'd need to either inherit from Printable, or explicitly register User as a virtual subclass, or use a Protocol which is Python's version of structural typing. TypeScript has structural typing everywhere, built in, by default. It's not an opt-in feature. It's how the entire type system works.

This has profound implications for how you read TypeScript code. When you see a function that accepts a parameter of type Config, you don't need to find where Config is defined to understand what the function needs. You can pass any object that has the right shape. And when you see an object literal that looks like it has the right properties, you can pass it directly. No explicit casting, no adapter pattern, no wrapper classes.

Think of it like this. In Python with nominal typing, types are like membership cards. You need to show your card to get in. In TypeScript with structural typing, types are like dress codes. If you're wearing the right clothes, you get in, regardless of who you are.

Now let's talk about generics. This is another area where your Python experience gives you a huge advantage, because Python's generic syntax and TypeScript's generic syntax are remarkably similar.

A generic is a type that takes another type as a parameter. In Python, you'd write something like def first(items: list[T]) -> T, using a type variable T. In TypeScript, you write the exact same thing: function first<T>(items: T[]): T. The angle brackets after the function name declare the type parameter, and then you use T throughout the signature. The TypeScript compiler infers T from the arguments you pass. If you call first with an array of strings, T is inferred as string, and the return type is string. If you call it with an array of numbers, T is number.

Generics are everywhere in TypeScript. The built-in Array type is generic. Array<string> is an array of strings, Array<number> is an array of numbers. Promise is generic. Promise<string> is a promise that resolves to a string. Map and Set are generic. And most importantly for your Next.js journey, React's component types are heavily generic.

Now let's talk about a few more patterns you'll see constantly in Next.js and React code.

First, union types. In Python, you'd use the pipe operator or Union from typing. You'd write something like status: str | None. TypeScript uses the exact same syntax. You write status colon string or null. Or status colon string or undefined. These are different in TypeScript. Null means "explicitly set to nothing." Undefined means "never set at all." In Python, you'd typically just use None for both, but TypeScript distinguishes them.

Second, optional properties. In an interface, you can mark a property as optional by adding a question mark after its name. interface User { name: string, email?: string }. The question mark means email might be there, it might not. Its type becomes string or undefined. This is extremely common in API response types, where not every field is always present.

Third, the readonly modifier. You write readonly id: string in an interface, and TypeScript will prevent you from reassigning that property after the object is created. It's like making a property read-only in a Python dataclass with a field descriptor.

Fourth, and this is a big one for React: type narrowing. When TypeScript sees a union type, it doesn't let you use properties that only exist on one of the union members. But as your code runs checks, TypeScript narrows the type. If you have a variable that could be string or number, and you write if typeof x === "string", then inside that if block, TypeScript knows x is a string, and it'll let you call string methods on it. This is called type narrowing, and it happens automatically based on control flow. You'll see this pattern constantly in React event handlers, where event.target could be many things, and you narrow it down to the specific element type you need.

So now let's bring this all back to why this matters for you, reading Next.js code. When you open a vibe-coded Next.js project, here's what you'll see. Every component will have its props defined as an interface. Something like interface CardProps { title: string, description: string, image_url: string, on_click?: () => void }. And the component function will be typed as function Card({ title, description, image_url, on_click }: CardProps). The destructured parameters directly reference the interface.

You'll see generic types in API responses. Something like const data: ApiResponse<User[]> equals await fetch. That ApiResponse is a generic type that wraps the actual data, adding fields like status and message, while the User array is the generic parameter telling you what's inside the data field.

You'll see utility types everywhere. TypeScript has built-in utility types like Partial, which makes all properties optional, and Pick, which selects specific properties from a type, and Omit, which removes specific properties. These are incredibly powerful for composing types without repetition. In Python, you'd need to create a whole new dataclass or TypedDict. In TypeScript, you just write Partial<User> and you're done.

And you'll see type guards, which are functions that perform runtime checks and help TypeScript narrow types. Something like function is_user(value: unknown): value is User. That "value is User" return type is a type predicate, and it tells TypeScript: if this function returns true, you can treat value as a User. This is unique to TypeScript and incredibly useful.

Let me wrap up with the mental model that I want you to take away. TypeScript is not about memorizing syntax. It's about understanding that TypeScript adds a compile-time type layer on top of JavaScript. The types are checked before the code runs, and then they disappear. The type system is structural, meaning it cares about shape, not names. Interfaces describe object shapes, type aliases describe anything. Generics let you write code that works across types, just like in Python. And union types, optional properties, and type narrowing are the bread and butter of everyday TypeScript code.

When you're reading a Next.js project, the type annotations are your map. They tell you what data flows where, what shape each object has, what a function expects and returns. You don't need to memorize every syntax detail. You need to be able to read the annotations and understand the shapes they describe. That's the skill. That's what lets you navigate vibe-coded code with confidence.

And here's the beautiful thing. Because TypeScript is structurally typed, and because it's so expressive with unions, intersections, and utility types, the type annotations in well-written Next.js code actually tell you more about the data model than the runtime code does. The types are the documentation. They're always up to date, because the compiler enforces them. And they're always there, because every file is a TypeScript file.

So that's TypeScript. Types, interfaces, structural typing, generics, and how to read them in the wild. Next lesson, we're going to tackle promises and async in JavaScript, which will feel very familiar after your Python asyncio experience, but with some important differences that matter for how Next.js handles data fetching. See you then.