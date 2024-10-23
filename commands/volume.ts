import { CommandInteraction, SlashCommandBuilder, GuildMember } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

export const volumeCommand = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Sets the volume of the currently playing song.')
        .addIntegerOption(option => 
            option.setName('level')
                .setDescription('The volume level to set (0-100)')
                .setRequired(true)),
    async execute(interaction: CommandInteraction) {
        const volumeLevel = interaction.options.get('level')?.value as number;

        if (volumeLevel < 0 || volumeLevel > 100) {
            return interaction.reply('Volume level must be between 0 and 100.');
        }

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

        player.state.resource.volume.setVolume(volumeLevel / 100);
        interaction.reply(`Volume set to ${volumeLevel}%.`);
    },
};
