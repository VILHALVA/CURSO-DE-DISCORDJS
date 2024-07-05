const { Low, JSONFile } = require('lowdb');
const path = require('path');

const adapter = new JSONFile(path.join(__dirname, '../db.json'));
const db = new Low(adapter);

module.exports = {
    name: 'contador',
    description: 'Mostra o número de comandos executados',
    async execute(message, args) {
        await db.read();
        const commandCount = db.data.commandCount;
        message.channel.send(`Comandos executados até agora: ${commandCount}`);
    },
};
