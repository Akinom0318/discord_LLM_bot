const {REST, Routes} = require('discord.js');
const {token, clientid, guildid} = require('./config.json');
const fs = require('fs');
const path = require('path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command){
            commands.push(command.data.toJSON());
        } else {
            console.log(`Error: ${filePath} is missing data or execute`);
        }
    }
}


const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);


        const data = await rest.put(
            Routes.applicationCommands(clientid),
            {body: commands}
        );


        console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();