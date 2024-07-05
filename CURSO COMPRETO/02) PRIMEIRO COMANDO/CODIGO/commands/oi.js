module.exports = {
    name: 'oi',
    description: 'Responde com Olá!',
    execute(message, args) {
        message.channel.send('Olá!');
    },
};
