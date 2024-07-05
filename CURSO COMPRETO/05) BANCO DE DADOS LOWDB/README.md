# BANCO DE DADOS LOWDB
O LowDB é uma biblioteca de banco de dados local de pequeno porte que permite que você armazene dados em arquivos JSON. Vamos adicionar o LowDB ao nosso projeto para armazenar informações, como comandos e dados do usuário.

## Estrutura do Projeto
Vamos atualizar a estrutura do projeto para incluir o LowDB:

```
CODIGO/
│
├── node_modules/
├── config.json
├── index.js
├── db.json
├── commands/
│   ├── oi.js
│   ├── bemvindo.js
│   └── sendapng.js
└── utils/
    └── convert.js
```

## Passos
1. **Instalar LowDB:**
   No diretório do seu projeto, instale a biblioteca LowDB:
   ```sh
   npm install lowdb
   ```

2. **Configurar o LowDB:**
   Vamos criar um arquivo `db.json` no diretório do projeto para armazenar os dados.

3. **Atualizar o `index.js` para usar o LowDB:**
   Atualize o `index.js` para incluir o LowDB e armazenar alguns dados básicos, como um contador de comandos.

## Configurar o `index.js`
Aqui está o conteúdo atualizado do `index.js`:

```javascript
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

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

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
```

## Exemplo de Comando usando LowDB
Vamos criar um comando `contador.js` para verificar quantos comandos foram executados até agora.

1. **Criar o comando `contador.js`:**
   Na pasta `commands`, crie um arquivo chamado `contador.js`:
   ```sh
   touch commands/contador.js
   ```

2. **Adicionar código ao `contador.js`:**
   Abra o `contador.js` e adicione o seguinte código:

   ```javascript
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
   ```

## Rodar o Bot
Após garantir que todos os arquivos estão configurados corretamente, salve-os e volte ao terminal. No diretório do seu projeto, execute o bot com:

```sh
node index.js
```

Agora, quando alguém digitar `!contador` no chat, o bot responderá com o número de comandos executados até o momento, utilizando o banco de dados LowDB para armazenar e recuperar essa informação.

