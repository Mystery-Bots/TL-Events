const { MessageEmbed } = require("eris")
const { readdirSync } = require("fs")
const ms = require("ms")

module.exports.run = (bot, message, args) => {
	timestring = new Date
	embedObject = {embed: {
		fields: [],
		author: {
			name: `${bot.user.username} Help`,
		},
		color: 0x2C2F33,
		footer: {
			text: `Requested by ${message.author.username}`,
			icon_url: message.author.staticAvatarURL
		},
		timestamp: timestring.toISOString()
	}}
	if (args[0]) {
		let command = args[0]
		let cmd
		if (bot.commands.has(command)) {
			cmd = bot.commands.get(command)
		}
		else if (bot.aliases.has(command)) {
			cmd = bot.commands.get(bot.aliases.get(command))
		}
		if(!cmd || cmd.info.category == "Developer" || cmd.info.category == "Hidden") {
			embedObject.embed.title = "Invalid Command."
			embedObject.embed.description =`Do \`${bot.config.prefix}help\` for the list of the commands.`
			return message.channel.createMessage(embedObject)
		}
		command = cmd.info
		try{
			cooldown = ms(ms(command.cooldown), {long:true})
		}catch(error){cooldown = "No Cooldown"}
		embedObject.embed.title = (`${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)} command help`)
		embedObject.embed.description = ([
			`❯ **Command:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}`,
			`❯ **Description:** ${command.description || "No Description provided."}`,
			`❯ **Usage:** ${command.usage ? `\`${bot.config.prefix}${command.name} ${command.usage}\`` : "No Usage"} `,
			`❯ **Aliases:** ${command.aliases ? command.aliases.join(", ") : "None"}`,
			`❯ **Category:** ${command.category}`,
			`❯ **Cooldown:** ${command.cooldown ? command.cooldown : "No Cooldown"}`
		].join("\n"))

		return message.channel.createMessage(embedObject).catch((error) => {
			if (error.message == "Missing Permissions"){
				message.channel.createMessage("I need `Embed Links` permissions to be able to send this message.")
			}
		})
	}
	const categories = readdirSync("./commands/")
	embedObject.embed.description = [
		`Available commands for ${bot.user.username}.`,
		`The bot prefix is **${bot.config.prefix}**`,
		"`<>`means needed and `()` it is optional but don't include those",
	].join("\n")
	categories.forEach(category => {
		const dir = bot.commands.filter(c => c.info.category.toLowerCase() === category.toLowerCase())
		const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1)

		try {
			if (dir.size === 0) return
			else if (category == "Hidden") {
				return
			}
			else {
				embedObject.embed.fields.push({name:`❯ ${capitalise}`, value: dir.map(c => `\`${c.info.name}\``).join(", ")})
			}
		}
		catch (e) {
			console.log(e)
		}
	})
	return message.channel.createMessage(embedObject).catch((error) => {
		if (error.message == "Missing Permissions"){
			message.channel.createMessage("I need `Embed Links` permissions to be able to send this message.")
		}
	})
}

module.exports.info = {
	name: "help",
	aliases: ["h"],
	description: "Help command to show the commands",
	usage: "(command name)",
	category: "About",
}