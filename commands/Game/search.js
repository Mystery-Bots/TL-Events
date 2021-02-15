const { Collection } = require("eris")

module.exports.run = async (bot, message, args) => {
	let chance = Math.floor(Math.random() * (100 - 1 + 1) + 1)
	let collection = bot.database.collection('players')
	let user = await collection.findOne({"userID":message.author.id})
	if (!user)return message.channel.createMessage(`${message.author.mention} please run \`tlclaim\` to create an account`)
	if (chance <= 70){
		let eggs = Math.floor(Math.random() * (30 - 10 + 1) + 10);
		if (user.passive){
			await collection.updateOne({"userID":message.author.id},{$inc:{"collectedEggs":(Math.floor(eggs/2))}})
			await collection.updateOne({"userID":message.author.id},{$inc:{"totalEggs":(Math.floor(eggs/2))}})
			return message.channel.createMessage(`Congrats, you managed to find ${Math.floor(eggs/2)} eggs`)
		}else{
			await collection.updateOne({"userID":message.author.id},{$inc:{"collectedEggs":(eggs)}})
			await collection.updateOne({"userID":message.author.id},{$inc:{"totalEggs":(eggs)}})
			return message.channel.createMessage(`Congrats, you managed to find ${eggs} eggs`)
		}
	}else{
		return message.channel.createMessage(`Sadly, you weren't able to find any eggs`)
	}
}

module.exports.info = {
    name: "search",
    description: "Search for some random eggs",
    category: "Game",
    cooldown: "2h"
}