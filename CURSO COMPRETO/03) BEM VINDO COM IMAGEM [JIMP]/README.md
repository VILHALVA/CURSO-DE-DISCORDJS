# BEM VINDO COM IMAGEM [JIMP]
Para adicionar um comando que envia uma imagem personalizada, como uma mensagem de "Bem-vindo", você pode usar a biblioteca [Jimp](https://www.npmjs.com/package/jimp) para manipulação de imagens em conjunto com Discord.js.

Vamos atualizar o nosso projeto para incluir um comando de "Bem-vindo" que gera uma imagem personalizada.

## Estrutura do Projeto
A estrutura do projeto será:

```
CODIGO/
│
├── node_modules/
├── config.json
├── index.js
├── commands/
│   ├── oi.js
│   └── bemvindo.js
└── images/
    └── background.png
```

## Passos
1. **Instalar Jimp:**
   No diretório do seu projeto, instale a biblioteca Jimp:
   ```sh
   npm install jimp
   ```

2. **Adicionar uma imagem de fundo:**
   Crie uma pasta chamada `images` no diretório do seu projeto e coloque uma imagem de fundo nela. Vamos chamar essa imagem de `background.png`.

3. **Criar um arquivo de comando `bemvindo.js`:**
   Na pasta `commands`, crie um arquivo chamado `bemvindo.js`:
   ```sh
   touch commands/bemvindo.js
   ```

4. **Adicionar código ao `bemvindo.js`:**
   Abra o `bemvindo.js` e adicione o seguinte código:

   ```javascript
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
   ```

5. **Atualizar o `index.js` para incluir o novo comando:**
   Certifique-se de que o `index.js` está carregando o novo comando da pasta `commands`. Se você já seguiu os passos anteriores, ele deve estar configurado corretamente para carregar todos os arquivos na pasta `commands`.

## Rodar o Bot
6. **Rodar o bot:**
   Salve todos os arquivos e volte ao terminal. No diretório do seu projeto, execute o bot com:
   ```sh
   node index.js
   ```

Agora, quando alguém digitar `!bemvindo @usuário` no chat, o bot responderá com uma imagem personalizada dizendo "Bem-vindo, [nome do usuário]!".

