module.exports.run = async (bot, message, args) => {
	if (!bot.config.devs.includes(message.author.id))
		return console.log(
			`${message.author.username} (ID: ${message.author.id}) tried to use "passiveoff"`
		);
	let collection = bot.database.collection("players");
	let result = await collection.find({"passive":true}).toArray();
	result.forEach(async user => {
		await collection.updateOne({"userID":user.userID}, {$set:{"passive":false}})
	})
	message.channel.createMessage("Passive Mode Disabled")
};

module.exports.info = {
	name: "passiveoff",
	description: "Turns passive mode off",
	category: "Developer",
};
