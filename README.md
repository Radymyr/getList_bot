# GetList Bot

GetList Bot is a Telegram bot that collects user messages in a list, numbering each message. The bot can be activated or deactivated in any chat using specific commands. The bot supports group and private chats, and each user's messages are kept in separate lists.

## Features

- Collects and numbers user messages in a list.
- Supports multiple chats with independent lists for each user.
- Activate and deactivate the bot with commands (`/start_list`, `/stop_list`, `/new_list`).
- Automatically deletes previous lists when a new one is started.

## Technologies Used

- **Node.js**: JavaScript runtime for executing the bot's logic.
- **Telegraf**: A modern Telegram bot framework for Node.js.
- **dotenv**: For managing environment variables.

## Getting Started

### Prerequisites

- **Node.js**: Ensure that you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **Telegram Bot Token**: Create a new bot via [BotFather](https://t.me/BotFather) on Telegram and obtain the bot token.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/getlist_bot.git
   cd getlist_bot
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Telegram bot token:

   ```bash
   TOKEN=your-telegram-bot-token
   ```

### Running the Bot

To start the bot, use the following command:

```bash
npm run dev
```

The bot will now be running and listening for commands and messages.

### Deployment on Railway

1. Create an account on [Railway](https://railway.app/).

2. Create a new project and link your GitHub repository.

3. Set your environment variables on Railway, including your `TOKEN` for the Telegram bot.

4. Deploy the project directly from the Railway dashboard.

### Usage

Once the bot is added to a group or chat, use the following commands:

- `/start_list`: Activates the bot and starts collecting messages.
- `/stop_list`: Deactivates the bot and stops collecting messages.
- `/new_list [number]`: Clears the current list and starts a new one. Optionally, you can specify a maximum number of items in the list.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Working Bot

You can interact with the live version of the bot [here](https://t.me/getList_bot).
