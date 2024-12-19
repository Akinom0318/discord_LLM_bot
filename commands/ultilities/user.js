const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Replies with user info"),
        async execute(interaction) {
            await interaction.reply(`Your are: ${interaction.user.username}\nYour id: ${interaction.user.id}`);
        },
};