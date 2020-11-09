

module.exports.run = async (bot, message, args) => {
    if (!bot.config.devs.includes(message.author.id)) return console.log(`${message.author.username} (ID: ${message.author.id}) tried to use "addtoken"`)
    const commandName = args[0].toLowerCase();
		const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) {
			return message.channel.createMessage(`There is no command with name or alias \`${commandName}\`!`);
		}

		delete require.cache[require.resolve(`../${command.info.category}/${command.info.name}`)];

		try {
            const newCommand = require(`../${command.info.category}/${command.info.name}`);
			bot.commands.set(newCommand.info.name, newCommand);
			message.channel.createMessage(`Command \`${command.info.name}\` was reloaded!`);
		} catch (error) {
			console.error(error);
			message.channel.createMessage(`There was an error while reloading a command \`${command.info.name}\`:\n\`${error.message}\``);
		}
}

module.exports.info = {
    name: "reload",
    description: "Reload a command",
    category: "Developer",
}