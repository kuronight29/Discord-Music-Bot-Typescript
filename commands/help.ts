import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const helpCommand = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of available commands and their descriptions.'),
    async execute(interaction: CommandInteraction) {
        const commands = [
            { name: 'play', description: 'Plays a song from a given URL' },
            { name: 'leave', description: 'Leaves the voice channel.' },
            { name: 'join', description: 'Joins the voice channel you are in.' },
            { name: 'volume', description: 'Sets the volume of the currently playing song.' },
            { name: 'queue', description: 'Displays the current music queue.' },
        ];

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Available Commands')
            .setDescription(commands.map(cmd => `**/${cmd.name}** - ${cmd.description}`).join('\n'));

        await interaction.reply({ embeds: [embed] });
    },
};
