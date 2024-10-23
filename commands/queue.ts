import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getVoiceConnection, VoiceConnection } from '@discordjs/voice';

export const queueCommand = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the current music queue.'),
    async execute(interaction: CommandInteraction) {
        const connection: VoiceConnection | undefined = getVoiceConnection(interaction.guildId!);
        if (!connection) {
            return interaction.reply('I am not in a voice channel!');
        }

        const subscription = connection.state as any;
        const player = subscription?.subscription?.player;
        if (!player) {
            return interaction.reply('There is no music playing currently.');
        }

        const queue = player.state.resource?.metadata?.queue || [];
        if (queue.length === 0) {
            return interaction.reply('The queue is currently empty.');
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Music Queue')
            .setDescription(queue.map((song: any, index: number) => `${index + 1}. ${song.title}`).join('\n'));

        await interaction.reply({ embeds: [embed] });
    },
};
