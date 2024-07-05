# INTRODUÇÃO
## Introdução
Discord.js é uma poderosa biblioteca JavaScript que permite interagir com a API do Discord de maneira muito fácil. Com ela, você pode criar bots para o Discord que respondem a comandos, gerenciam servidores e muito mais.

## Instalação
Para instalar o Discord.js, você precisará ter o Node.js instalado em seu sistema. Se ainda não tem, pode baixá-lo [aqui](https://nodejs.org/). Após instalar o Node.js, você pode instalar o Discord.js usando npm (o gerenciador de pacotes do Node.js).

## Passos para Instalação:
1. **Criar um novo projeto:**
   Abra seu terminal e crie um novo diretório para o seu projeto de bot, então navegue até esse diretório:
   ```sh
   mkdir CODIGO
   cd CODIGO
   ```

2. **Inicializar o projeto:**
   Inicialize um novo projeto Node.js dentro deste diretório:
   ```sh
   npm init -y
   ```
   Isso criará um arquivo `package.json` com as configurações padrão.

3. **Instalar o Discord.js:**
   Instale a biblioteca Discord.js:
   ```sh
   npm install discord.js
   ```

## Criando o Primeiro Projeto
Agora, vamos criar um bot que responde com "Olá!" quando alguém digita "!oi" no chat, armazenando o token em um arquivo `config.json`.

1. **Criar um arquivo de configuração:**
   No diretório do seu projeto, crie um arquivo chamado `config.json`:
   ```sh
   touch config.json
   ```

2. **Adicionar o token ao `config.json`:**
   Abra o `config.json` em seu editor de texto preferido e adicione o seguinte conteúdo:

   ```json
   {
     "token": "SEU_TOKEN_DO_BOT_AQUI"
   }
   ```

   Substitua `"SEU_TOKEN_DO_BOT_AQUI"` pelo token do seu bot.

3. **Criar um arquivo de bot:**
   No diretório do seu projeto, crie um arquivo chamado `index.js`:
   ```sh
   touch index.js
   ```

4. **Adicionar código ao arquivo `index.js`:**
   Abra o `index.js` em seu editor de texto preferido e adicione o seguinte código:

   ```javascript
   const { Client, GatewayIntentBits } = require('discord.js');
   const { token } = require('./config.json');

   const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

   client.once('ready', () => {
       console.log('Bot está online!');
   });

   client.on('messageCreate', message => {
       if (message.content === '!oi') {
           message.channel.send('Olá!');
       }
   });

   client.login(token);
   ```

5. **Rodar o bot:**
   Salve o arquivo `index.js` e volte ao terminal. No diretório do seu projeto, execute o bot com:
   ```sh
   node index.js
   ```

   Se tudo estiver configurado corretamente, você verá a mensagem "Bot está online!" no terminal.

## Criação do Bot no Discord Developer Portal
Para obter o token do bot:

1. Vá para o [Discord Developer Portal](https://discord.com/developers/applications).
2. Clique em "New Application" e dê um nome ao seu aplicativo.
3. Vá para a aba "Bot" e clique em "Add Bot".
4. Após criar o bot, você encontrará o token sob "Token". Clique em "Copy" para copiá-lo e cole-o no `config.json`.

## Adicionar o Bot ao seu Servidor
1. No Discord Developer Portal, na aba "OAuth2", selecione "URL Generator".
2. Em "OAuth2 URL Generator", selecione "bot" em "Scopes".
3. Em "Bot Permissions", selecione as permissões que você deseja dar ao seu bot. Para este exemplo, você pode selecionar "Send Messages".
4. Copie o URL gerado, cole no seu navegador e adicione o bot ao seu servidor.

Agora você deve ter seu bot Discord funcionando no seu servidor! Quando alguém digitar `!oi`, o bot responderá com "Olá!".


