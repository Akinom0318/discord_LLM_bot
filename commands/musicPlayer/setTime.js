const {SlashCommandBuilder} = require('@discordjs/builders');

function timeToMiliSeconds(time){
    const time_array = time.split(":");
    let result = 0;
    for(let i = 0; i < time_array.length; i++){
        result += parseInt(time_array[i]) * Math.pow(60, time_array.length - i - 1);
    }
    return result * 1000;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set_time")
        .setDescription("Set the time stamp of the current audio")
        .addStringOption(option => 
            option
                .setName("time_stamp")
                .setDescription("input the as hh:mm:ss")
                .setRequired(true)),
        async execute(interaction) {
            if(!interaction.member.voice.channel){
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

            if(player.queue.length === 0){
                return interaction.reply({
                    content: `Error: The queue is empty.`,
                    ephemeral: true
                });
            }

            let query = interaction.options.getString("time_stamp");
            const time = query;
            query = timeToMiliSeconds(query);
            const current_song = player.current;
            if(query < 0 || query > current_song.duration){
                return interaction.reply({
                    content: `Error: The input is out of range`,
                    ephemeral: true
                });
            }
            player.seek(query);
            return interaction.reply(`The audio is set to **${time}**`);
        },
};