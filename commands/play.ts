import { CommandInteraction, SlashCommandBuilder, GuildMember } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import ytdl from 'ytdl-core'; // For YouTube

export const playCommand = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from a given URL')
        .addStringOption(option => 
            option.setName('url')
                .setDescription('The URL of the song to play')
                .setRequired(true)),
    async execute(interaction: CommandInteraction) {
        const url = interaction.options.get('url')?.value as string;
        
        if (!interaction.member || !(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
            return interaction.reply('You need to be in a voice channel to play music!');
        }

        if (!interaction.guild) {
            return interaction.reply('This command can only be used in a guild.');
        }

        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator as any,
        });

        const player = createAudioPlayer();
        let resource;
        try {
            if (ytdl.validateURL(url)) {
                const stream = ytdl(url, { filter: 'audioonly' });
                resource = createAudioResource(stream);
            } else {
                // Handle other platforms like Spotify and SoundCloud
                return interaction.reply('Currently, only YouTube URLs are supported.');
            }
        } catch (error) {
            console.error('Error creating audio resource:', error);
            return interaction.reply('There was an error with the provided URL.');
        }

        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Playing, () => {
            interaction.reply(`Now playing: ${url}`).catch(console.error);
        });

        player.on('error', error => {
            console.error('Audio player error:', error);
            interaction.followUp('There was an error playing the song.').catch(console.error);
        });

        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });
    },
};