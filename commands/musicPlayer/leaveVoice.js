const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leave the voice channel"),
        async execute(interaction) {
            if (!interaction.member.voice.channel) {
                return interaction.reply({
                    content: `Error: You must be in a voice channel to execute this command.`,
                    ephemeral: true
                });
            }
            let player = null;
            const client = interaction.client;
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
            player.disconnect();
            player.destroy();
            return interaction.reply("Left the voice channel :)");
        },
};