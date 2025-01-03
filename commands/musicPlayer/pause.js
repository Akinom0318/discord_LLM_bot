const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause the current audio"),
        async execute(interaction) {
            if (!interaction.member.voice.channel) {
                return interaction.reply({
                    content: `Error: You must be in a voice channel to execute this command.`,
                    ephemeral: true
                });
            }

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

            if (player.paused) {
                return interaction.reply({
                    content: `Error: The player is paused.`,
                    ephemeral: true
                });
            }

            player.pause();
            return interaction.reply("Pause the audio");
        },
};