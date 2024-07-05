const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');
const { Low, JSONFile } = require('lowdb');

// Configurar LowDB
const adapter = new JSONFile(path.join(__dirname, 'db.json'));
const db = new Low(adapter);

async function initializeDatabase() {
    await db.read();
    db.data ||= { commandCount: 0 };
    await db.write();
}

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageReactions,
    ] 
});

client.commands = new Collection();

// Carregar todos os comandos na pasta commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.name, command);
}

client.once('ready', async () => {
    await initializeDatabase();
    console.log('Bot está online!');
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        await command.execute(message, args);

        // Incrementar contador de comandos
        db.data.commandCount++;
        await db.write();
        console.log(`Comandos executados: ${db.data.commandCount}`);
    } catch (error) {
        console.error(error);
        message.reply('Houve um erro ao tentar executar esse comando!');
    }
});

client.login(token);
