const {Client, Events, GatewayIntentBits, Collection} = require('discord.js');
const { Manager } = require('moonlink.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const token = process.env.TOKEN;
const API_port = process.env.PORT;
const moonlink_password = process.env.MOONLINK_PASSWORD;

const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
]});


client.commands = new Collection(); // a better map to store commands

client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});

// Moonlink
client.moonlink = new Manager({
    nodes: [{
        identifier: "node_1",
        host: "localhost",
        password: moonlink_password,
        port: 2333,
        secure: false,
    }],
    options: {},
    sendPayload: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(JSON.parse(payload));
    }
});

// Event: When a node is successfully created and connected
client.moonlink.on("nodeCreate", node => {
    console.log(`${node.host} was connected`);
});

// Event: When a track starts playing
client.moonlink.on("trackStart", async (player, track) => {
    client.channels.cache
        .get(player.textChannelId)
        .send(`Now playing: ${track.title}`);
});

// Event: When a track finishes playing
client.moonlink.on("trackEnd", async (player, track) => {
    client.channels.cache
        .get(player.textChannelId)
        .send(`Track ended: ${track.title}`);
});

// Event: When the bot is ready to start working
client.on("ready", () => {
    client.moonlink.init(client.user.id); // Initializing Moonlink.js with the bot's ID
    console.log(`${client.user.tag} is ready!!!!`);
});

// Event: Handling raw WebSocket events
client.on("raw", data => {
    client.moonlink.packetUpdate(data); // Passing raw data to Moonlink.js for handling
});

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ("data" in command && "execute" in command){
            client.commands.set(command.data.name, command);
        } else {
            console.log(`Error: ${file} is missing data or execute`);
        }
    }
}



client.login(token);


client.on(Events.InteractionCreate, async interaction => {
    const targetChannelId = '1261652284866035733';
    if(interaction.channelId !== targetChannelId) return;
    console.log(interaction);
    if (!interaction.isCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.log(`Error: ${interaction.commandName} not found`);
    };

    try {
        if(interaction.commandName === "play"){
            interaction.client = client;
        }
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}    
    }
});

async function sendPrompt(prompt) {
    try {
        const response = await axios.post(`http://127.0.0.1:${API_port}/chat`, { prompt });
        return response.data.response;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

// message receving
// targetChannelId need to turn on developer mode in discord
// client.on('messageCreate', async (message) => {
//     const targetChannelId = '1261652284866035733';
//     const onlyreceiver = "678204112197910540"

//     if (message.author.bot) return;
//     if (message.author.id !== onlyreceiver) return;
//     if (message.channelId !== targetChannelId) return;

//     const targetChannel = await client.channels.fetch(targetChannelId);


//     let response = await sendPrompt(message.content);

//     targetChannel.send(response);
// });