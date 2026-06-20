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
