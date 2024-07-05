const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('Bot está online!');
});

client.on('messageCreate', message => {
    if (message.content === '!oi') {
        message.channel.send('Olá!');
    }
});

client.login(token);
