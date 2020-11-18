const ms = require("ms")
const Discord = require("eris")

const cooldowns = new Discord.Collection()

module.exports.Run = async function(bot,message){
	let prefix = bot.config.prefix
	var args = message.content.slice(prefix.length).trim().split(/ +/g)
	const cmd = args.shift().toLowerCase()
	let command

	//Check if starts with prefix
	if (!message.content.startsWith(prefix) || message.author == bot.user) return

	if (cmd.length === 0) return
	if (bot.commands.has(cmd)) command = bot.commands.get(cmd)
	else if (bot.aliases.has(cmd)) command = bot.commands.get(bot.aliases.get(cmd))
	
	//Check if a command is being run.
	if (!command) return

	//Check to see if bot is offline and if owner not running command
	if (bot.presence.status == "invisible" && !bot.config.devs.includes(message.author.id)) return

	//Check dev mode and if owner not running command
	if (bot.presence.status == "dnd" && !bot.config.devs.includes(message.author.id)) return

	//For command info like command description.
	info = command.info

	//Check to see if command is disabled
	if(info.disabled){
		return message.channel.createMessage('This command is disabled currently.')
	}
	
	if (message.author.bot) return

	//Check if command is GuildOnly.
	if (!message.channel.guild) {
		return message.channel.createMessage('I can\'t execute that command inside DMs!')
	}

	//Check if args are required.
	if (info.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`

		if (info.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${info.name} ${info.usage}\``
		}
		return message.channel.createMessage(reply)
	}
	//Command cooldowns
	if (!cooldowns.has(info.name)) {
		cooldowns.set(info.name, new Discord.Collection())
	}

	const now = Date.now()
	const timestamps = cooldowns.get(info.name)
	const cooldownAmount = ms(info.cooldown || 0) //info.cooldown * 1000

	if (timestamps.has(message.channel.guild.id)) {
		const expirationTime = timestamps.get(message.channel.guild.id) + cooldownAmount

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now)
			return message.channel.createMessage(`You have already checked for gifts today. Please wait ${ms(timeLeft, {long:true})} before checking again. `)
		}
	}

	timestamps.set(message.channel.guild.id, now)
	setTimeout(() => timestamps.delete(message.channel.guild.id), cooldownAmount)
	try {
		//Run command.
		await command.run(bot, message, args)
		
	} catch (error) {
		console.log(error)
	}
}