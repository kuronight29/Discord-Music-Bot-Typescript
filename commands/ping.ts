// commands/ping.ts
import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const pingCommand = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction: CommandInteraction) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Pong!')
            .setDescription('🏓 Pong!');

        await interaction.reply({ embeds: [embed] });
    },
};