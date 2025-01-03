const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("List all the commands and their description"),
        async execute(interaction) {
            const commands = interaction.commands;
            let reply = "The commands of Devourer:\n";
            for(const [commandName, description] of commands){
                reply += `**${commandName}**: ${description.data.description}\n`;
            }
            await interaction.reply(reply);
        },
};