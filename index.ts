import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core'; // For YouTube
import SpotifyWebApi from 'spotify-web-api-node'; // For Spotify
import SoundCloudAPI from 'soundcloud-api-client'; // For SoundCloud
import { createAudioResource, AudioPlayer, AudioPlayerStatus, VoiceConnection, joinVoiceChannel } from '@discordjs/voice';

dotenv.config();

interface Command {
    name: string;
    execute: (interaction: any) => Promise<void>;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] }) as Client & { commands: Collection<string, Command> };
client.commands = new Collection<string, Command>();

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON() as never);
    client.commands.set(command.data.name, command);
}

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
    throw new Error('DISCORD_BOT_TOKEN is not defined');
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        const clientId = process.env.CLIENT_ID;
        const guildId = process.env.GUILD_ID;

        if (!clientId || !guildId) {
            throw new Error('CLIENT_ID or GUILD_ID is not defined');
        }

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

// Spotify and SoundCloud API setup
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:8888/callback' // Adjust as necessary
});

// Initialize SoundCloud API
const soundCloudClient = new SoundCloudAPI({
    clientId: process.env.SOUNDCLOUD_CLIENT_ID,
});

// Function to play music from different sources
async function playMusic(url: string) {
    if (ytdl.validateURL(url)) {
        const stream = ytdl(url, { filter: 'audioonly' });
        return createAudioResource(stream);
    } else if (url.includes('spotify.com')) {
        // Handle Spotify URL
        const trackId = extractSpotifyTrackId(url);
        const track = await spotifyApi.getTrack(trackId);
        const stream = await getSpotifyStream(track.body.preview_url);
        return createAudioResource(stream);
    } else if (url.includes('soundcloud.com')) {
        // Handle SoundCloud URL
        const track = await soundCloudClient.get('/resolve', { url });
        const stream = await getSoundCloudStream(track.id);
        return createAudioResource(stream);
    } else {
        throw new Error('Currently, only YouTube, Spotify, and SoundCloud URLs are supported.');
    }
}

// Helper functions to extract track IDs and get streams
function extractSpotifyTrackId(url: string): string {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : '';
}

async function getSpotifyStream(previewUrl: string) {
    // Logic to get a stream from Spotify preview URL
    return previewUrl; // Placeholder return
}

async function getSoundCloudStream(trackId: string) {
    // Logic to get a stream from SoundCloud track ID
    return `https://api.soundcloud.com/tracks/${trackId}/stream`; // Placeholder return
}

client.login(token);