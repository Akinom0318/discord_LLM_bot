const {SlashCommandBuilder} = require('@discordjs/builders');

function miliSecondsToTime(ms){
    let seconds = Math.floor(ms/1000);
    let minutes = Math.floor(seconds/60);
    let hours = Math.floor(minutes/60);
    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = "0" + hours < 10 ? "0" + hours : hours;
    minutes = "0" + minutes < 10 ? "0" + minutes : minutes;
    seconds = "0" + seconds < 10 ? "0" + seconds : seconds;
    return `${hours}:${minutes}:${seconds}`;
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName("time_stamp")
        .setDescription("Show the current time of the audio"),
        async execute(interaction) {
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

            const current_song = player.current;
            const duration = miliSecondsToTime(current_song.duration);
            const currentTime = miliSecondsToTime(current_song.position);
            return interaction.reply(`Time stamp of ${current_song.title}: **${currentTime} / ${duration}**`);
        },
};