import { CommandInteraction, SlashCommandBuilder, GuildMember } from 'discord.js';
import { getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';

export const skipCommand = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the currently playing song.'),
    async execute(interaction: CommandInteraction) {
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

        player.stop(true);
        interaction.reply('Skipped the current song.');
    },
};
