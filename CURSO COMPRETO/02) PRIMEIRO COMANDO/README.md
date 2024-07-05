# PRIMEIRO COMANDO
Vamos adicionar um comando adicional ao bot para tornar as interações mais interessantes. Primeiro, vamos fazer uma pequena organização do código para facilitar a adição de novos comandos.

## Estrutura do Projeto
Vamos organizar o projeto da seguinte forma:

```
CODIGO/
│
├── node_modules/
├── config.json
├── index.js
└── commands/
    └── oi.js
```

## 1. Configurar a Estrutura
1. **Criar a pasta de comandos:**
   No diretório do seu projeto, crie uma pasta chamada `commands`:
   ```sh
   mkdir commands
   ```

2. **Criar um arquivo de comando:**
   Na pasta `commands`, crie um arquivo chamado `oi.js`:
   ```sh
   touch commands/oi.js
   ```

## 2. Adicionar o Comando `!oi`
3. **Adicionar código ao arquivo `oi.js`:**
   Abra o `oi.js` e adicione o seguinte código:

   ```javascript
   module.exports = {
       name: 'oi',
       description: 'Responde com Olá!',
       execute(message, args) {
           message.channel.send('Olá!');
       },
   };
   ```

## 3. Atualizar o `index.js` para Gerenciar Comandos
4. **Adicionar código ao `index.js`:**
   Atualize o `index.js` para carregar dinamicamente os comandos da pasta `commands` e responder adequadamente:

   ```javascript
   const fs = require('fs');
   const path = require('path');
   const { Client, GatewayIntentBits, Collection } = require('discord.js');
   const { token } = require('./config.json');

   const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

   client.commands = new Collection();

   const commandsPath = path.join(__dirname, 'commands');
   const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

   for (const file of commandFiles) {
       const filePath = path.join(commandsPath, file);
       const command = require(filePath);
       client.commands.set(command.name, command);
   }

   client.once('ready', () => {
       console.log('Bot está online!');
   });

   client.on('messageCreate', message => {
       if (!message.content.startsWith('!') || message.author.bot) return;

       const args = message.content.slice(1).trim().split(/ +/);
       const commandName = args.shift().toLowerCase();

       if (!client.commands.has(commandName)) return;

       const command = client.commands.get(commandName);

       try {
           command.execute(message, args);
       } catch (error) {
           console.error(error);
           message.reply('Houve um erro ao tentar executar esse comando!');
       }
   });

   client.login(token);
   ```

## 4. Rodar o Bot
5. **Rodar o bot:**
   Salve todos os arquivos e volte ao terminal. No diretório do seu projeto, execute o bot com:
   ```sh
   node index.js
   ```

Agora, quando alguém digitar `!oi` no chat, o bot responderá com "Olá!".

## Adicionar Mais Comandos
Para adicionar mais comandos, você pode seguir os mesmos passos usados para criar o comando `!oi`. Simplesmente crie novos arquivos `.js` na pasta `commands`, cada um exportando um objeto com `name`, `description`, e uma função `execute` que define o comportamento do comando.

