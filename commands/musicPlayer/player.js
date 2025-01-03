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
            if (!interaction.member.voice.channel) {
                return interaction.reply({
                    content: `Error: You must be in a voice channel to execute this command.`,
                    ephemeral: true
                });
            }
    
            const client = interaction.client;
            const query = interaction.options.getString("query");
            let player = null;
            if(client.moonlink.players.cache.size > 0){
                const [key, _] = client.moonlink.players.cache;
                player = key[1];
            }else{
                player = client.moonlink.createPlayer({
                    guildId: interaction.guild.id,
                    voiceChannelId: interaction.member.voice.channel.id,
                    textChannelId: interaction.channel.id,
                    autoPlay: false,
                    volumn: 60
                });
            }


    
            if (!player.connected) {
                player.connect({
                    setDeaf: true, // Deafens the bot upon joining
                    setMute: false // Ensures the bot isn't muted
                });
            }
    
            const res = await client.moonlink.search({
                query,
                source: "youtube",
                requester: interaction.user.id
            });
    
            if (res.loadType === "loadfailed") {
                return interaction.reply({
                    content: `Error: Failed to load the requested track.`,
                    ephemeral: true
                });
            } else if (res.loadType === "empty") {
                return interaction.reply({
                    content: `Error: No results found for the query.`,
                    ephemeral: true
                });
            }
    
            if (res.loadType === "playlist") {
                interaction.reply({
                    content: `Playlist ${res.playlistInfo.name} has been added to the queue.`
                });
    
                for (const track of res.tracks) {
                    player.queue.add(track); // Add all tracks from the playlist to the queue
                }
            } else {
                player.queue.add(res.tracks[0]); // Add the first track from the search results
                interaction.reply({
                    content: `Track added to the queue: ${res.tracks[0].title}`
                });
            }
    
            if (!player.playing) {
                player.play(); 
            }
        }
};