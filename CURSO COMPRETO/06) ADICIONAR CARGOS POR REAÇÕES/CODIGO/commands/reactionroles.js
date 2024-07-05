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
