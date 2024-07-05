# ANTI INVITE NO STATUS PERSONALIZADO
Para implementar um sistema de "anti-invite" que detecta links de convite no status personalizado dos usuários em um servidor do Discord, podemos usar a biblioteca `discord.js`. O bot monitorará as mudanças de status dos membros e verificará se o status personalizado contém links de convite. Se encontrar, o bot poderá enviar um aviso ao usuário e/ou a um canal de log.

## Estrutura do Projeto
A estrutura do projeto permanecerá a mesma, mas adicionaremos um evento para monitorar mudanças de presença (status) dos membros.

## Passos
1. **Instalar a biblioteca `discord.js`:**
   Certifique-se de que a biblioteca `discord.js` está instalada:
   ```sh
   npm install discord.js
   ```

2. **Atualizar o `index.js` para monitorar mudanças de presença:**
   Abra o `index.js` e adicione o código para monitorar mudanças de presença e verificar status personalizados.

## Atualização do `index.js`
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

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences, // Adicionado para monitorar mudanças de presença
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

// Evento para monitorar mudanças de presença
client.on('presenceUpdate', (oldPresence, newPresence) => {
    const member = newPresence.member;
    const customStatus = newPresence.activities.find(activity => activity.type === 'CUSTOM');

    if (customStatus && customStatus.state) {
        const inviteRegex = /discord\.gg\/\w+/;
        if (inviteRegex.test(customStatus.state)) {
            const warningMessage = `Olá, ${member.displayName}, links de convite no status personalizado não são permitidos.`;
            member.send(warningMessage).catch(console.error);
            
            const logChannel = member.guild.channels.cache.find(channel => channel.name === 'logs'); // Altere para o nome do seu canal de logs
            if (logChannel) {
                logChannel.send(`Usuário ${member.displayName} foi detectado com um link de convite no status: ${customStatus.state}`);
            }
        }
    }
});

client.login(token);
```

## Explicação do Código
1. **Intents de Presença:** Adicionamos `GatewayIntentBits.GuildPresences` para que o bot possa monitorar mudanças de presença (status) dos membros.

2. **Evento `presenceUpdate`:** O evento `presenceUpdate` é acionado sempre que um membro atualiza sua presença (status). Verificamos se o membro tem um status personalizado e, em caso afirmativo, verificamos se o status contém um link de convite usando uma expressão regular.

3. **Aviso ao Usuário:** Se um link de convite for encontrado no status personalizado, o bot enviará uma mensagem direta ao usuário para avisá-lo.

4. **Canal de Logs:** Se um canal chamado `logs` existir no servidor, o bot enviará uma mensagem para esse canal, informando sobre o usuário que foi detectado com um link de convite no status.

## Rodar o Bot
Após garantir que todos os arquivos estão configurados corretamente, salve-os e volte ao terminal. No diretório do seu projeto, execute o bot com:

```sh
node index.js
```

Agora, o bot monitorará mudanças de status personalizados dos membros e tomará ações adequadas se encontrar links de convite.

