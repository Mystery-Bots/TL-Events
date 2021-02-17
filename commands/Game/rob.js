const { Collection } = require("eris")

module.exports.run = async (bot, message, args) => {
	let chance = Math.floor(Math.random() * (100 - 1 + 1) + 1)
	let userMention = message.mentions[0]
	let collection = bot.database.collection('players')
	let targetUser = await collection.findOne({"userID":userMention.id})
	let user = await collection.findOne({"userID":message.author.id})
	if (!user) {
		message.channel.createMessage(`${message.author.mention} please run \`tlclaim\` to create an account`)
		throw Error("no account exits")

	}
	if (!targetUser){
		message.channel.createMessage(`${userMention.username} doesn't have an account`)
		throw Error("no account exits")
	}
	if (targetUser.passive) {
		message.channel.createMessage(`${userMention.username} is set to passive mode and can't be robbed.`)
		throw Error("passive mode was active")
	}
	if (user.passive) {
		message.channel.createMessage(`You are set to passive mode and can't rob people.`)
		throw Error("passive mode was active")
	}
	if (chance <= 10){
		let eggs = Math.floor(targetUser.collectedEggs*.1)
		await collection.updateOne({"userID":userMention.id},{$inc:{"collectedEggs":-eggs}})
		await collection.updateOne({"userID":userMention.id},{$inc:{"totalEggs":-eggs}})
		await collection.updateOne({"userID":message.author.id},{$inc:{"collectedEggs":eggs}})
		await collection.updateOne({"userID":message.author.id},{$inc:{"totalEggs":eggs}})
		return message.channel.createMessage(`Congrats you managed to steal ${eggs} eggs from ${userMention.username}`)

	}else if (chance > 10 && chance < 41){
		let eggs = Math.floor(user.collectedEggs*.05)
		await collection.updateOne({"userID":userMention.id},{$inc:{"collectedEggs":eggs}})
		await collection.updateOne({"userID":userMention.id},{$inc:{"totalEggs":eggs}})
		await collection.updateOne({"userID":message.author.id},{$inc:{"collectedEggs":-eggs}})
		await collection.updateOne({"userID":message.author.id},{$inc:{"totalEggs":-eggs}})
		return message.channel.createMessage(`Oops you got caught and had to give ${eggs} eggs to ${userMention.username}`)
	}else{
		return message.channel.createMessage(`Sadly you weren't able to rob ${userMention.username}`)
	}
}

module.exports.info = {
    name: "rob",
    description: "Rob a player of their eggs",
    category: "Game",
    cooldown: "3h"
}