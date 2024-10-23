import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

export const leaveCommand = {
    name: 'leave',
    description: 'Leaves the voice channel.',
    async execute(interaction: CommandInteraction) {
        const connection = getVoiceConnection(interaction.guildId!);
        if (connection) {
            connection.destroy();
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Left Voice Channel')
                .setDescription('Disconnected from the voice channel.');

            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply('I am not in a voice channel!');
        }
    },
};