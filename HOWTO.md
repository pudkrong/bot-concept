# Bottender

## Prerequisite
- Mock server to mock API for NLU service. We are using `mockoon`
- Telegram bot

## Configuration

### The `bottender.config.js` File
Bottender configuration file. You can use this file to provide settings for the session store and channels.

### The `.env` File
Bottender utilizes the [dotenv](https://www.npmjs.com/package/dotenv) package to load your environment variables when developing your app.

To make the bot work, you must put required environment variables into your `.env` file.

## Available Scripts
In the project directory, you can run:

### `npm run dev`

Runs the app in development mode.<br>
The bot will automatically reload if you make changes to the code.<br>
By default, server runs on [http://localhost:5000](http://localhost:5000) and ngrok runs on [http://localhost:4040](http://localhost:4040).

```sh
npm run dev
```

To run in [Console Mode](https://bottender.js.org/docs/en/the-basics-console-mode), provide the `--console` option:

```sh
npm run dev -- --console
yarn dev --console
```

### `npm run webhook`

To register webhook to ngrok link automatically

```sh
npm run webhook
```

### `npm run mock`

To run mock server

```sh
npm run mock
```

## Steps
1. Edit `bottender.config.js` to match your requirement
1. Edit `.env`
1. Open terminal #1, run `npm run mock`. The mock server will run on port 3001
1. Open terminal #2, run `npm run dev`. It will run webhook on port 5001 and ngrok
1. Open terminal #3, run `npm run webhook`. It will register telegram webhook to the ngrok.
1. Open telegram and chat to bot.
1. Try the following messages
  - reset: To reset all states
  - turn on
  - turn on light in bedroom
  - i am hungry