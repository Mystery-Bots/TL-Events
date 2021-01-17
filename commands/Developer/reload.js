module.exports.run = async (bot, message, args) => {
    if (!bot.config.devs.includes(message.author.id)) return console.log(`${message.author.username} (ID: ${message.author.id}) tried to use "reload"`)
    const commandName = args[0].toLowerCase();
		const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) {
			try {
				commandPath = commandName.split('/')
				const newCommand = require(`../${commandPath[0]}/${commandPath[1]}`)
				if (!newCommand.info.name || !newCommand.info.category ){
					return message.channel.createMessage(`Error loading command in \`${commandPath[0]}/${commandPath[1]}\` you have a missing \`info.name\` or \`info.name\` is not a string. or you have a missing \`info.category\` or \`info.category\` is not a string`)
				}
				bot.commands.set(newCommand.info.name, newCommand);
				return message.channel.createMessage(`Command \`${newCommand.info.name}\` was reloaded!`);
			} catch (error) {
				if (error.code == 'MODULE_NOT_FOUND') {
					return message.channel.createMessage(`There is no command with path of \`${commandPath[0]}/${commandPath[1]}\`!`);
				}
				console.error(error);
				return message.channel.createMessage(`There was an error while reloading a command \`${commandPath[0]}/${commandPath[1]}\`:\n\`${error.message}\``);
			}
			
		}

		delete require.cache[require.resolve(`../${command.info.category}/${command.info.name}`)];

		try {
			const newCommand = require(`../${command.info.category}/${command.info.name}`);
			if (!newCommand.info.name || !newCommand.info.category ){
				return message.channel.createMessage(`Error loading command in \`${command.info.category}/${command.info.name}\` you have a missing \`info.name\` or \`info.name\` is not a string. or you have a missing \`info.category\` or \`info.category\` is not a string`)
			}
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