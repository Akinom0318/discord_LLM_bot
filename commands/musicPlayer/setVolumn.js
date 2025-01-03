const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set_volumn")
        .setDescription("Set the volumn of the bot")
        .addStringOption(option => 
            option
                .setName("volumn")
                .setDescription("input the number from 0 to 100")
                .setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.voice.channel) {
                return interaction.reply({
                    content: `Error: You must be in a voice channel to execute this command.`,
                    ephemeral: true
                });
            }
    
            const client = interaction.client;
            const query = interaction.options.getString("volumn");

            if(isNaN(query)){
                return interaction.reply({
                    content: `Error: The input is not a number`,
                    ephemeral: true
                });
            }

            if(client.moonlink.players.cache.size > 0){
                const [key, _] = client.moonlink.players.cache;
                player = key[1];
            }else{
                return interaction.reply({
                    content: `Error: There is no audio playing.`,
                    ephemeral: true
                });
            }

            if (!player.connected) {
                return interaction.reply({
                    content: `Error: The bot is not in a voice channel.`,
                    ephemeral: true
                });
            }

            player.volumn = parseInt(query);
            
            return interaction.reply(`Set the volumn to ${query} ~~Currently not working~~`);
        }
};