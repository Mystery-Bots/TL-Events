module.exports.run = async (bot, message, args) => {
	let chance = Math.floor(Math.random() * (100 - 1 + 1) + 1)
	let collection = bot.database.collection('players')
	let statsCollection = bot.database.collection('stats')
	let user = await collection.findOne({"userID":message.author.id})
	if (!user)return message.channel.createMessage(`${message.author.mention} please run \`tlclaim\` to create an account`)
	if (chance <= 70){
		let eggs = Math.floor(Math.random() * (30 - 10 + 1) + 10);
		if (user.passive){
			await collection.updateOne({"userID":message.author.id},{$inc:{"collectedEggs":(Math.floor(eggs/2))}})
			await collection.updateOne({"userID":message.author.id},{$inc:{"totalEggs":(Math.floor(eggs/2))}})
			await statsCollection.updateOne({"_id":"600608c92fe331ec1a128a1f"}, {$inc:{"collectedEggs":Math.floor(eggs/2), "timesCollected":1}})
			return message.channel.createMessage({content:`Congrats, you managed to find ${Math.floor(eggs/2)} eggs`,messageReferenceID:message.id})
		}else{
			await collection.updateOne({"userID":message.author.id},{$inc:{"collectedEggs":(eggs)}})
			await collection.updateOne({"userID":message.author.id},{$inc:{"totalEggs":(eggs)}})
			await statsCollection.updateOne({"_id":"600608c92fe331ec1a128a1f"}, {$inc:{"collectedEggs":eggs, "timesCollected":1}})
			return message.channel.createMessage({content:`Congrats, you managed to find ${eggs} eggs`,messageReferenceID:message.id})
		}
	}else{
		await statsCollection.updateOne({"_id":"600608c92fe331ec1a128a1f"}, {$inc:{"timesCollected":1}})
		return message.channel.createMessage({content:`Sadly, you weren't able to find any eggs`,messageReferenceID:message.id})
	}
}

module.exports.info = {
    name: "search",
    description: "Search for some random eggs",
    category: "Game",
    cooldown: "2h"
}