const path = require('path');

module.exports = {
    name: 'sendapng',
    description: 'Envia um APNG',
    async execute(message, args) {
        const filePath = path.join(__dirname, '../images/emoji.apng');
        const attachment = { files: [{ attachment: filePath, name: 'emoji.apng' }] };
        message.channel.send({ content: 'Aqui está seu APNG!', ...attachment });
    },
};
