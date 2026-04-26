# AI Code Reviewer

A React + Node.js + Express app that sends pasted code to the Hugging Face Inference API using Qwen/Qwen2.5-Coder-7B-Instruct and shows the review in the browser.

## Features

- React textarea for pasting code
- `Review Code` button
- Express backend route at `POST /api/review`
- Hugging Face API call from the server only
- Results rendered in the frontend

## Setup

1. Install dependencies in the project root and client app.
2. Copy `.env.example` to `.env` and set `HUGGINGFACE_API_KEY`.
3. Start the app in development mode.

## Scripts

- `npm run dev` starts the Express server and Vite frontend together.
- `npm run build` builds the React app for production.
- `npm run start` starts the Express server.

## Environment

- `HUGGINGFACE_API_KEY` is required on the backend.
- `PORT` is optional and defaults to `5000`.
