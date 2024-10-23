import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Displays the currently playing song with controls.');

export async function execute(interaction: CommandInteraction) {
    // Create an embed message
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Now Playing')
        .setDescription('Song Title - Artist Name')
        .setThumbnail('https://example.com/album-cover.jpg')
        .addFields(
            { name: 'Duration', value: '3:45', inline: true },
            { name: 'Requested by', value: interaction.user.username, inline: true }
        );

    // Create buttons
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('pause')
                .setLabel('Pause')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('skip')
                .setLabel('Skip')
                .setStyle(ButtonStyle.Secondary),
        );

    // Send the embed with buttons
    await interaction.reply({ embeds: [embed], components: [row] });
}