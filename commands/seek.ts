import { CommandInteraction, SlashCommandBuilder, GuildMember } from 'discord.js';
import { getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';

export const seekCommand = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seeks to a specific time in the currently playing song')
        .addIntegerOption(option => 
            option.setName('seconds')
                .setDescription('The number of seconds to seek to')
                .setRequired(true)),
    async execute(interaction: CommandInteraction) {
        const seconds = interaction.options.get('seconds')?.value as number;

        if (!interaction.member || !(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
            return interaction.reply('You need to be in a voice channel to use this command!');
        }

        if (!interaction.guild) {
            return interaction.reply('This command can only be used in a guild.');
        }

        const connection = getVoiceConnection(interaction.guildId!);
        if (!connection) {
            return interaction.reply('I am not in a voice channel!');
        }

        const subscription = connection.state as any;
        const player = subscription?.subscription?.player;
        if (!player) {
            return interaction.reply('There is no music playing currently.');
        }

        const resource = player.state.resource;
        if (!resource) {
            return interaction.reply('There is no music playing currently.');
        }

        try {
            resource.playStream.seek(seconds);
            interaction.reply(`Seeked to ${seconds} seconds.`);
        } catch (error) {
            console.error('Error seeking:', error);
            interaction.reply('There was an error seeking to the specified time.');
        }
    },
};
