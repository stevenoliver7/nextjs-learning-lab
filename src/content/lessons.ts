export type LessonStatus = "complete" | "planned";

export type ConceptLens = {
  label: string;
  explanation: string;
};

export type Lesson = {
  id: string;
  number: string;
  status: LessonStatus;
  title: string;
  subtitle: string;
  duration: string;
  audio: string | null;
  scriptPath?: string;
  source: string;
  summary: string;
  mentalModel: string;
  room: string;
  motion: string;
  visualAnchor: string;
  concepts: ConceptLens[];
  prompt: string;
  audioBrief: string;
  rehearsalSteps: string[];
  checkpoints: string[];
};

export const lessons: Lesson[] = [
  {
    id: "lesson-1",
    number: "01",
    status: "complete",
    title: "The Big Picture",
    subtitle: "Next.js as the full vehicle around the React engine, with the browser as the stage.",
    duration: "~10 min",
    audio: "/audio/lesson1-big-picture.mp3",
    source: "original Lesson 1 audio archive",
    summary: "A first-principles orientation to the web stack: the browser runs the app, the DOM is the living page tree, React describes UI, and Next.js adds routing, rendering, and project conventions around React.",
    mentalModel: "Next.js is the car; React is the engine; the browser is the road and dashboard where the result actually appears.",
    room: "Browser foyer",
    motion: "Open the browser, see a DOM tree grow, then watch React hand it better blueprints.",
    visualAnchor: "A theatre stage: browser lights, DOM scenery, React script pages, Next.js stage manager.",
    concepts: [
      { label: "Browser runtime", explanation: "The browser is not just a viewer. It parses HTML, applies CSS, runs JavaScript, receives events, and maintains the living page." },
      { label: "DOM tree", explanation: "The DOM is the page as an object tree. If you can imagine nested boxes, you can imagine the tree React eventually changes." },
      { label: "React", explanation: "React lets you describe what the UI should look like from state, instead of manually mutating DOM nodes one at a time." },
      { label: "Next.js", explanation: "Next.js wraps React with file conventions, routing, server rendering, build tooling, and deployment assumptions." },
      { label: "Python bridge", explanation: "Treat package.json like requirements.txt, components like template-producing functions, and framework conventions like Django or Flask project structure." },
    ],
    prompt: "When you open a Next.js project, first ask: what runs in the browser, what does React describe, and what convention does Next.js provide?",
    audioBrief: "This lesson builds the map before the territory: browser, DOM, React, Next.js, and the Python-to-JavaScript analogies that make the stack less alien.",
    rehearsalSteps: [
      "Say the stack from outside to inside: user, browser, DOM, JavaScript, React, Next.js.",
      "Picture React producing a description before the browser changes the real page.",
      "Name one thing Next.js adds that plain React does not give you by itself.",
    ],
    checkpoints: [
      "I can explain the difference between React and Next.js.",
      "I can picture the DOM as a tree the browser maintains.",
      "I know why React describes UI instead of manually mutating every node.",
    ],
  },
  {
    id: "lesson-2",
    number: "02",
    status: "complete",
    title: "React Components Deep Dive",
    subtitle: "Components as functions, JSX as UI description, reconciliation as careful patching.",
    duration: "~15 min",
    audio: "/audio/lesson2-react-components.mp3",
    source: "original Lesson 2 audio archive",
    summary: "A deeper walk through components, props, JSX, the virtual DOM, and the render loop so React code reads like a component tree instead of a top-to-bottom script.",
    mentalModel: "A component is a little workshop: props enter through the front door, JSX comes out as a blueprint, and React decides what has to change in the real DOM.",
    room: "React workshop",
    motion: "Feed props into component machines, stack their output into a tree, then let React patch only the changed parts.",
    visualAnchor: "Nested workshops on a factory floor, each one producing one piece of UI blueprint paper.",
    concepts: [
      { label: "Components", explanation: "Components are functions with a UI job. They receive inputs and return a description of what should appear." },
      { label: "JSX", explanation: "JSX looks like HTML, but it is JavaScript syntax that becomes React objects. It is a description, not the DOM itself." },
      { label: "Props", explanation: "Props are read-only inputs from a parent. They make components reusable and keep information flowing downward." },
      { label: "Virtual DOM", explanation: "The virtual DOM is React's remembered description of the UI, used to compare old and new trees before touching the browser." },
      { label: "Reconciliation", explanation: "Reconciliation is the comparison step: React decides what stayed the same, what changed, and what real DOM patch is needed." },
    ],
    prompt: "Pick any component and read it left-to-right: inputs, transformation, returned UI description, children.",
    audioBrief: "This lesson makes React legible: component functions, JSX output, props coming down, and the render comparison that keeps UI updates efficient.",
    rehearsalSteps: [
      "Choose a component name and ask what props it expects.",
      "Imagine the JSX as a paper blueprint, not as the real wall in the building.",
      "Picture React comparing yesterday's blueprint with today's before it sends workers to the DOM.",
    ],
    checkpoints: [
      "I can distinguish JSX from HTML.",
      "I can explain why rerunning a component function is cheap.",
      "I can read a page as a tree of nested components.",
    ],
  },
  {
    id: "lesson-2b",
    number: "02B",
    status: "complete",
    title: "Hooks + Data Passing Re-dive",
    subtitle: "State lockers, hook ordering, props down, events up, and lifting state.",
    duration: "~22 min",
    audio: "/audio/lesson2b-hooks-data-flow.mp3",
    source: "Hermes audio cache + learning journey notes",
    summary: "A deliberately repeated audio-first pass over hooks and data flow: functions are stateless, React owns the memory lockers, and state moves through the component tree by ownership.",
    mentalModel: "Hooks are lockers on React's wall. The first hook call opens the first locker, the second opens the second; change the order and every key opens the wrong door.",
    room: "Hook memory room",
    motion: "Store memory in numbered lockers, pass values down as props, send events back up as intent.",
    visualAnchor: "A corridor of lockers labelled by order, not by variable name, with arrows down for data and arrows up for events.",
    concepts: [
      { label: "useState pair", explanation: "useState gives you a current value and a setter. Reading is immediate; setting asks React to render again with new memory." },
      { label: "Hook order", explanation: "Hooks must run in the same order because React matches calls by position. Conditional hooks shift the lockers." },
      { label: "Props down", explanation: "Parents own values and hand snapshots to children as props. Children should not secretly mutate those inputs." },
      { label: "Events up", explanation: "Children communicate intent by calling callbacks. The parent decides whether state changes." },
      { label: "Lift state", explanation: "When siblings need the same value, move ownership up to their nearest common parent and pass it back down." },
    ],
    prompt: "When debugging React state, ask: who owns this value, who receives it as props, and who sends intent back upward?",
    audioBrief: "The repeated pass is intentional: state is not inside ordinary function memory; React keeps it between renders and reconnects it by hook order.",
    rehearsalSteps: [
      "Say: value and setter. One reads; one requests a new render.",
      "Trace a click from child button to parent handler to setter to rerender.",
      "Find the owner of a value before deciding where a bug lives.",
    ],
    checkpoints: [
      "I can explain why hooks cannot be conditional.",
      "I can trace a click from child event to parent setter to rerender.",
      "I can decide when state should be lifted up.",
    ],
  },
  {
    id: "lesson-3",
    number: "03",
    status: "complete",
    title: "TypeScript Interfaces & Types",
    subtitle: "Compile-time shapes, structural typing, generics, unions, and reading types as maps.",
    duration: "~31 min",
    audio: "/audio/lesson3-typescript.mp3",
    scriptPath: "/scripts/lesson-3.md",
    source: "nextjs-lessons/lesson3-script.txt",
    summary: "TypeScript as a strict compile-time layer on JavaScript: annotations are checked before the app runs, erased at runtime, and used as living documentation for large React/Next.js projects.",
    mentalModel: "Python type hints are helpful notes; TypeScript is a hard preflight gate. But at runtime both disappear.",
    room: "Blueprint table",
    motion: "Lay object shapes on the table, check pieces against them, then erase the pencil marks before runtime.",
    visualAnchor: "Architectural blueprints for props, API responses, and config objects, stamped before the building opens.",
    concepts: [
      { label: "Interfaces", explanation: "Interfaces name reusable object shapes. They are especially common for props and API-like records." },
      { label: "Type aliases", explanation: "Type aliases can name primitives, unions, function shapes, tuples, and object shapes. They are more general than interfaces." },
      { label: "Structural typing", explanation: "Compatibility is based on shape. If an object has the needed properties, it fits, even if it was not declared with that exact name." },
      { label: "Generics", explanation: "Generics are type placeholders. They let one function or component preserve the relationship between input and output types." },
      { label: "Unions + narrowing", explanation: "A union says a value can be one of several shapes. Narrowing is the runtime check that proves which shape you have." },
      { label: "Utility types", explanation: "Partial, Pick, and Omit reshape existing types so projects avoid repeating almost-identical blueprints." },
    ],
    prompt: "When reading a component, treat its props interface as the component contract: what shape does it need to render correctly?",
    audioBrief: "The TypeScript lesson bridges Python type hints into a stricter world: object shapes, structural compatibility, reusable aliases, generics, unions, narrowing, and utility types.",
    rehearsalSteps: [
      "Read a props type as a contract before reading the component body.",
      "Ask whether a type exists at runtime. Usually, it does not.",
      "For a generic, name the thing that must stay connected from input to output.",
    ],
    checkpoints: [
      "I can explain structural typing as shape-based compatibility.",
      "I can choose interface vs type alias for common cases.",
      "I can read generic and union-heavy props without panic.",
    ],
  },
  {
    id: "lesson-4",
    number: "04",
    status: "complete",
    title: "Promises & Async JavaScript",
    subtitle: "Why JavaScript does not block, how the event loop works, and what async/await really means.",
    duration: "~34 min",
    audio: "/audio/lesson4-promises-async.mp3",
    scriptPath: "/scripts/lesson-4.md",
    source: "nextjs-lessons/lesson4/script.md",
    summary: "A from-scratch explanation of async built from synchronous Python, browser constraints, the event loop, promises, and async/await — with no asyncio knowledge assumed.",
    mentalModel: "One clerk, one call stack, one queue: slow work leaves the desk, completes elsewhere, and returns as a queued continuation.",
    room: "Event-loop clock room",
    motion: "Put fast work on the stack, send slow work out to the runtime, then resume from the queue when the promise settles.",
    visualAnchor: "A clerk at one desk, a wall clock, an outbox for network requests, and an inbox queue for completed work.",
    concepts: [
      { label: "Blocking", explanation: "Blocking code keeps the one JavaScript thread busy. In a browser, that can freeze clicks, typing, painting, and network responsiveness." },
      { label: "Runtime", explanation: "The browser or Node runtime handles timers, network, and file-like slow work outside the call stack." },
      { label: "Event loop", explanation: "The event loop checks whether the stack is clear, then moves queued continuations back onto the stack." },
      { label: "Promise", explanation: "A promise is a placeholder for a future result: pending now, fulfilled or rejected later." },
      { label: "async/await", explanation: "async/await is readable syntax over promises. Await pauses that function's continuation, not the entire JavaScript world." },
      { label: "fetch", explanation: "fetch starts network work and gives back a promise. Awaiting it means resume when the response arrives." },
    ],
    prompt: "Every time you see await fetch, picture the JavaScript thread handing slow network work to the runtime and coming back when the promise resolves.",
    audioBrief: "This lesson rebuilds async from synchronous Python intuition: why browser JavaScript must stay responsive, why promises exist, and how await reads without pretending the whole thread is asleep.",
    rehearsalSteps: [
      "Say what is on the call stack right now.",
      "Move the slow operation to the runtime outbox.",
      "Bring the continuation back only after the stack is clear and the promise has settled.",
    ],
    checkpoints: [
      "I can explain why browser JavaScript cannot block on network calls.",
      "I can describe the call stack and task queue.",
      "I can read async/await as syntax over promises.",
    ],
  },
  {
    id: "lesson-4-5",
    number: "04.5",
    status: "complete",
    title: "Re-entry Review",
    subtitle: "Five rooms, five motions: browser, React, hooks, TypeScript, async — rebuilt for audio memory.",
    duration: "~33 min",
    audio: "/audio/lesson4-5-reentry-review.mp3",
    scriptPath: "/scripts/lesson-4-5.md",
    source: "nextjs-lessons/reentry-review/lesson4_5_reentry_review_script.txt",
    summary: "A review lecture after a long gap, designed for listening: five rooms stitch the whole mental stack back together before the App Router lesson.",
    mentalModel: "The learning building has five rooms: browser DOM, React workshop, hook memory room, TypeScript blueprint table, and event-loop clock room.",
    room: "Five-room memory palace",
    motion: "Walk the building in order, place every vocabulary word in a room, then connect rooms into one machine.",
    visualAnchor: "A small technical museum where each room contains one physical metaphor from the previous lessons.",
    concepts: [
      { label: "Browser + DOM", explanation: "The real page exists in the browser's living tree. Everything else eventually explains how that tree changes." },
      { label: "React components", explanation: "Components manufacture UI descriptions. React arranges them into a tree and reconciles changes." },
      { label: "Hooks + data flow", explanation: "Hooks preserve memory between renders. Data moves down as props; intent moves up as events." },
      { label: "TypeScript", explanation: "Types are blueprints checked before runtime. They make contracts visible while you read unfamiliar code." },
      { label: "Async", explanation: "Async keeps the single JavaScript thread responsive by moving slow work outside the stack and resuming later." },
    ],
    prompt: "Before moving to App Router, walk the five rooms and make sure every vocabulary word has a place in the machine.",
    audioBrief: "The re-entry lecture is the audio-first reset: less new material, more spatial memory, repeated bridges, and enough reconstruction to make the next new topic land cleanly.",
    rehearsalSteps: [
      "Walk the five rooms without notes: browser, React, hooks, TypeScript, async.",
      "For each room, name the object, the motion, and one bug it helps diagnose.",
      "Connect the full loop: event, state, render, type contract, async work, DOM update.",
    ],
    checkpoints: [
      "I can connect all prior lessons into one machine.",
      "I can explain props, state, types, and async as connected motions.",
      "I am ready to learn the App Router file structure.",
    ],
  },
  {
    id: "lesson-5",
    number: "05",
    status: "planned",
    title: "Next.js App Router & File Structure",
    subtitle: "app/ directory, pages, layouts, loading states, and project navigation.",
    duration: "planned",
    audio: null,
    source: "planned in learning journey skill",
    summary: "The next new topic: how Next.js turns folders and files into routes, layouts, loading UI, error UI, and navigable application structure.",
    mentalModel: "The app/ directory is a map: folders become route segments, layouts wrap children, pages are leaf destinations, and special files describe behavior around the route.",
    room: "Route map room",
    motion: "Draw the app folder as a building directory: each folder is a hallway, each page is a destination, each layout is a wrapper around rooms below it.",
    visualAnchor: "A floor plan with nested corridors labelled app, dashboard, settings, page.tsx, layout.tsx, loading.tsx, and error.tsx.",
    concepts: [
      { label: "app/ directory", explanation: "The app folder is the route map in modern Next.js. Its nested folders describe URL segments." },
      { label: "page.tsx", explanation: "A page file is the leaf component that makes a route publicly reachable." },
      { label: "layout.tsx", explanation: "A layout wraps a route segment and all of its children, preserving shared UI across navigation." },
      { label: "route segments", explanation: "Folders become route segments, but special syntax can group, hide, or parameterize those segments." },
      { label: "loading/error", explanation: "Special files like loading.tsx and error.tsx define what users see while data loads or when a segment fails." },
    ],
    prompt: "When opening a project, start by drawing the app/ tree and marking which files are pages, wrappers, and special states.",
    audioBrief: "This is the runway for the next lecture: turn folder structure into a mental map before adding server/client boundaries.",
    rehearsalSteps: [
      "Sketch the app folder as a route tree.",
      "Mark pages as destinations and layouts as wrappers.",
      "Predict the URL before reading the component body.",
    ],
    checkpoints: [
      "I can predict a URL from folders in app/.",
      "I can identify which layout wraps which page.",
      "I can navigate a project by route segment.",
    ],
  },
];

export const curriculumPrinciples = [
  "Audio-first mental models",
  "Python-to-JavaScript bridges",
  "Rooms, objects, and motions",
  "One source of truth per lesson",
  "Ready for App Router",
];
