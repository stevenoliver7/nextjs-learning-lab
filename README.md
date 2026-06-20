# Next.js Learning Lab

An interactive, audio-first companion for Daniel's Next.js learning journey.

The site turns the existing voice lessons into a small technical memory palace: each lesson has an audio player, a summary, a mental model, concept lenses, no-screen rehearsal prompts, and listening checkpoints.

## What is included

- Lesson 1: The Big Picture
- Lesson 2: React Components Deep Dive
- Lesson 2B: Hooks + Data Passing Re-dive
- Lesson 3: TypeScript Interfaces & Types
- Lesson 4: Promises & Async JavaScript
- Lesson 4.5: Re-entry Review
- Lesson 5: App Router & File Structure landing zone

## Local development

```bash
npm ci
npm run lint
npm run build
npm run dev
```

## Content model

- `src/content/lessons.ts` is the source of truth for lesson metadata, mental models, concept lenses, rehearsal prompts, and checkpoints.
- `public/audio/` stores static MP3 files.
- `public/scripts/` stores long-form source scripts for the lessons where canonical scripts are available.

## Deployment

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that builds the Vite app and deploys `dist/` to GitHub Pages.
