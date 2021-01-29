module.exports.run = async (bot, message, args) => {
	let collection = bot.database.collection('players')
	let user = await collection.findOne({"userID":message.author.id})
	if (!user)return message.channel.createMessage(`${message.author.mention} please run \`tlclaim\` to create an account`)
	if(user.passive){
		await collection.updateOne({"userID":message.author.id},{$set:{"passive":false}})
		return message.channel.createMessage({content:"Passive mode deactivated",messageReferenceID:message.id})
	}else{
		await collection.updateOne({"userID":message.author.id},{$set:{"passive":true}})
		return message.channel.createMessage({content:"Passive mode active",messageReferenceID:message.id})
	}
}

module.exports.info = {
    name: "passive",
    description: "Sets your profile to passive mode",
    category: "Game",
    cooldown: "20s"
}