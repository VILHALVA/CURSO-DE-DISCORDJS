const Jimp = require('jimp');

module.exports = {
    name: 'bemvindo',
    description: 'Envia uma mensagem de boas-vindas com imagem',
    async execute(message, args) {
        const user = message.mentions.users.first() || message.author;
        const username = user.username;

        const image = await Jimp.read('./images/background.png');
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

        image.print(font, 10, 10, `Bem-vindo, ${username}!`);

        const buffer = await image.getBufferAsync(Jimp.MIME_PNG);

        const attachment = { files: [{ attachment: buffer, name: 'bemvindo.png' }] };
        message.channel.send({ content: `Bem-vindo, ${username}!`, ...attachment });
    },
};
