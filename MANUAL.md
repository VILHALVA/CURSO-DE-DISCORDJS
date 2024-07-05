# MANUAL 
## 1. INSTALAÇÃO:
### REQUISITOS:
- **Node.js**: Certifique-se de ter o Node.js instalado. Você pode baixá-lo de [nodejs.org](https://nodejs.org/).

### PASSOS DE INSTALAÇÃO:
1. **Criar um projeto Node.js**:
   Abra o terminal e crie uma nova pasta para o seu projeto, depois navegue até ela e inicialize um projeto Node.js:

   ```bash
   mkdir discord-bot
   cd discord-bot
   npm init -y
   ```

2. **Instalar Discord.js**:
   Instale a biblioteca Discord.js usando npm:

   ```bash
   npm install discord.js
   ```

## 2. CONFIGURAÇÃO:
### CRIAR UM BOT NO DISCORD:
1. **Acesse o Discord Developer Portal**:
   Vá para [Discord Developer Portal](https://discord.com/developers/applications) e faça login.

2. **Criar uma Nova Aplicação**:
   - Clique em "New Application".
   - Dê um nome à sua aplicação e clique em "Create".

3. **Criar um Bot**:
   - Vá para a aba "Bot" e clique em "Add Bot".
   - Confirme clicando em "Yes, do it!".

4. **Copiar o Token do Bot**:
   - Na aba "Bot", clique em "Copy" ao lado do token. Este token será usado para autenticar seu bot.

### CONFIGURAÇÃO DO BOT:
1. **Criar um Arquivo de Configuração**:
   Na raiz do seu projeto, crie um arquivo `config.json` para armazenar o token do bot:

   ```json
   {
     "token": "SEU_TOKEN_DO_BOT_AQUI"
   }
   ```

## 3. CRIANDO O PRIMEIRO BOT:
1. **Criar o Arquivo Principal**:
   Na raiz do seu projeto, crie um arquivo `index.js` e adicione o seguinte código:

   ```javascript
   const { Client, GatewayIntentBits } = require('discord.js');
   const { token } = require('./config.json');

   // Cria uma nova instância do cliente do Discord
   const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

   // Evento disparado quando o bot é inicializado
   client.once('ready', () => {
     console.log('Bot está online!');
   });

   // Evento disparado quando uma mensagem é enviada em um servidor que o bot está presente
   client.on('messageCreate', message => {
     // Evita que o bot responda a si mesmo
     if (message.author.bot) return;

     // Responde com "Olá!" quando alguém digitar "!oi"
     if (message.content === '!oi') {
       message.channel.send('Olá!');
     }
   });

   // Faz login no bot usando o token
   client.login(token);
   ```

2. **Executar o Bot**:
   No terminal, execute o seguinte comando para iniciar o bot:

   ```bash
   node index.js
   ```

3. **Adicionar o Bot ao Seu Servidor**:
   - No Discord Developer Portal, vá para a aba "OAuth2" e clique em "URL Generator".
   - Em "OAuth2 URL Generator", marque as opções `bot` em "SCOPES" e `Administrator` em "BOT PERMISSIONS".
   - Copie a URL gerada e abra-a no seu navegador para adicionar o bot ao seu servidor.

## RESUMO:
Você configurou um projeto Node.js, instalou o Discord.js, criou e configurou um bot no Discord Developer Portal, escreveu o código do bot e o adicionou ao seu servidor. Agora, ao digitar `!oi` em um canal onde o bot está presente, ele responderá com "Olá!".

