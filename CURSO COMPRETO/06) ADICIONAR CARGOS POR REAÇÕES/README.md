# ADICIONAR CARGOS POR REAÇÕES
Adicionar cargos (ou roles) por meio de reações é um recurso popular nos bots do Discord. Vamos criar um comando que configura uma mensagem de atribuição de cargo e reage automaticamente a essa mensagem com emojis. Quando os usuários clicarem nesses emojis, eles receberão ou perderão o cargo correspondente.

## Estrutura do Projeto
A estrutura do projeto não mudará, apenas adicionaremos o comando de atribuição de cargos por reação.

## Passos
1. **Instalar a biblioteca `discord.js-reaction-role` (opcional):**
   Esta biblioteca facilita a criação de sistemas de cargos por reações, mas para ilustrar, faremos isso manualmente. Se desejar, você pode usá-la:
   ```sh
   npm install discord.js-reaction-role
   ```

2. **Criar o comando `reactionroles.js`:**
   Na pasta `commands`, crie um arquivo chamado `reactionroles.js`:
   ```sh
   touch commands/reactionroles.js
   ```

3. **Adicionar código ao `reactionroles.js`:**
   Abra o `reactionroles.js` e adicione o seguinte código para configurar os cargos por reação:

   ```javascript
   module.exports = {
       name: 'reactionroles',
       description: 'Configura a mensagem de atribuição de cargos por reação',
       async execute(message, args) {
           // IDs de cargos e emojis correspondentes
           const roles = {
               '🟩': 'ID_DO_CARGO_1',  // Substitua pelo ID do cargo real
               '🟦': 'ID_DO_CARGO_2',  // Substitua pelo ID do cargo real
           };

           const embed = {
               color: 0x0099ff,
               title: 'Escolha seu cargo!',
               description: 'Reaja com um emoji para receber um cargo:\n\n🟩 - Cargo 1\n🟦 - Cargo 2',
           };

           const reactionMessage = await message.channel.send({ embeds: [embed] });

           // Adicionar reações à mensagem
           for (const emoji of Object.keys(roles)) {
               await reactionMessage.react(emoji);
           }

           // Filtrar reações válidas
           const filter = (reaction, user) => !user.bot && Object.keys(roles).includes(reaction.emoji.name);

           const collector = reactionMessage.createReactionCollector({ filter, dispose: true });

           collector.on('collect', async (reaction, user) => {
               const role = message.guild.roles.cache.get(roles[reaction.emoji.name]);
               if (role) {
                   const member = message.guild.members.cache.get(user.id);
                   await member.roles.add(role);
                   user.send(`Você recebeu o cargo: ${role.name}`);
               }
           });

           collector.on('remove', async (reaction, user) => {
               const role = message.guild.roles.cache.get(roles[reaction.emoji.name]);
               if (role) {
                   const member = message.guild.members.cache.get(user.id);
                   await member.roles.remove(role);
                   user.send(`Você perdeu o cargo: ${role.name}`);
               }
           });
       },
   };
   ```

4. **Atualizar o `index.js` para incluir o novo comando:**
   Certifique-se de que o `index.js` está carregando o novo comando `reactionroles`.

## Atualização do `index.js`
Aqui está o conteúdo atualizado do `index.js` para carregar todos os comandos, incluindo o `reactionroles.js`:

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
```

## Rodar o Bot
Após garantir que todos os arquivos estão configurados corretamente, salve-os e volte ao terminal. No diretório do seu projeto, execute o bot com:

```sh
node index.js
```

## Configuração de Cargos
Para que o comando funcione, você precisa substituir `'ID_DO_CARGO_1'` e `'ID_DO_CARGO_2'` pelos IDs reais dos cargos do seu servidor. Você pode obter o ID de um cargo clicando com o botão direito sobre o cargo no Discord (com o modo de desenvolvedor ativado) e selecionando "Copiar ID".

Quando alguém com permissões adequadas digitar `!reactionroles` no chat, o bot enviará uma mensagem com os emojis configurados para atribuição de cargos. Os usuários poderão clicar nos emojis para receber ou remover os cargos correspondentes.

