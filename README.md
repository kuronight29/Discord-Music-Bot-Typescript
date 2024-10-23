# Discord-Music-Bot-Typescript

## Introduction
This is a Discord Music Bot written in TypeScript. It supports playing music from YouTube, Spotify, and SoundCloud. The bot uses the Discord.js library and the @discordjs/voice package to interact with the Discord API and handle voice connections.

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- A Discord account and a server where you have permission to add a bot
- YouTube, Spotify, and SoundCloud API credentials

## Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/kuronight29/Discord-Music-Bot-Typescript.git
   cd discord-music-bot-typescript
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Create a `.env` file in the root directory and add your credentials:**
   ```
   DISCORD_BOT_TOKEN=YOUR_BOT_TOKEN
   BOT_PREFIX=!
   CLIENT_ID=YOUR_CLIENT_ID
   GUILD_ID=YOUR_GUILD_ID
   SOUNDCLOUD_CLIENT_ID=YOUR_SOUNDCLOUD_CLIENT_ID
   SPOTIFY_CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID
   SPOTIFY_CLIENT_SECRET=YOUR_SPOTIFY_CLIENT_SECRET
   ```

4. **Run the bot:**
   ```sh
   npm start
   ```

## Commands 🎵

### /help ❓
Displays a list of available commands and their descriptions. Use this command to get an overview of what the bot can do and how to use each command.

### /play ▶️
Plays a song from a given URL. Provide a YouTube, Spotify, or SoundCloud link to start playing music in your voice channel. Make sure you are in a voice channel before using this command!

### /leave 🚶‍♂️
Leaves the voice channel. Use this command to stop the bot and clear the queue.

### /join 🚶‍♂️
Joins the voice channel you are in. Use this command to have the bot join your voice channel.

### /volume 🔊
Sets the volume of the currently playing song. Use this command to adjust the volume level.

### /queue 📜
Displays the current music queue. Use this command to see what songs are in the queue.

## Notes
- The bot supports YouTube, Spotify, and SoundCloud links.
- The bot will only play music in voice channels.
- The bot will automatically leave the voice channel after the queue is empty.
- The bot will not play music in text channels.
