const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("list_song")
        .setDescription("List the current song queue"),
        async execute(interaction) {

            const client = interaction.client;
            if(client.moonlink.players.cache.length === 0){
                return interaction.reply({
                    content: `Error: The queue is empty.`,
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

            let reply = "Queue:\n";
            if(player.current !== null){
                const current_song = player.current;
                reply += `1. **${current_song.title}**\n`;
            }else{
                return interaction.reply({
                    content: `Error: There is no audio playing.`,
                    ephemeral: true
                });
            }
            const queue = player.queue.tracks;
            //console.log(player);
            //console.log(queue);
            for(let i = 0; i < queue.length; i++){
                reply += `${i+1}. **${queue[i].title}**\n`;
            }
            return interaction.reply(reply);
        },
};