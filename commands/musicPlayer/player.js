const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play the audio from YouTube")
        .addStringOption(option => 
            option
                .setName("query")
                .setDescription("The search the audio from youtube")
                .setRequired(true)),
        async execute(interaction) {
            await interaction.reply(`Searching from YouTube...`);
        }
};