import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';

// Define the slash command using SlashCommandBuilder
export const joinCommand = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Joins the voice channel you are in.'),
    async execute(interaction: CommandInteraction) {
        if (!interaction.guild) {
            return interaction.reply('This command can only be used in a server.');
        }
        const member = await interaction.guild.members.fetch(interaction.user.id);
        const voiceChannel = member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply('You need to be in a voice channel to use this command!');
        }

        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guildId!,
            adapterCreator: interaction.guild!.voiceAdapterCreator as any,
        });

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Joined Voice Channel')
            .setDescription(`Joined ${voiceChannel.name}`);

        await interaction.reply({ embeds: [embed] });
    },
};
