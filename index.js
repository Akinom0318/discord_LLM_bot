const {Client, Events, GatewayIntentBits, Collection} = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const token = process.env.TOKEN;
const API_port = process.env.PORT;


const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]});


client.commands = new Collection(); // a better map to store commands

client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);
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
    console.log(interaction);
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.log(`Error: ${interaction.commandName} not found`);
    };

    try {
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



// message receving
// targetChannelId need to turn on developer mode in discord
client.on('messageCreate', async (message) => {
    const targetChannelId = '1261652284866035733';

    if (message.author.bot) return;
    if (message.channelId !== targetChannelId) return;

    const targetChannel = await client.channels.fetch(targetChannelId);

    targetChannel.send(message.content);
});