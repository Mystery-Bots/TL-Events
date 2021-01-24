module.exports.run = async (bot, message, args) => {
	if (!bot.config.devs.includes(message.author.id))
		return console.log(
			`${message.author.username} (ID: ${message.author.id}) tried to use "eventstats"`
		);
	let collection = bot.database.collection("stats");
	let result = await collection.findOne({ _id: "600608c92fe331ec1a128a1f" });
	let embed = {
		title: "Easter Event Stats",
		fields: [
			{
				name: "Total Staff Eggs",
				value: `${result.staffEggs.toLocaleString()}`,
				inline: true,
			},
			{
				name: "Total Found Eggs",
				value: `${result.foundEggs.toLocaleString()}`,
				inline: true,
			},
			{
				name: "\u200B",
				value: "\u200B",
				inline: true,
			},
			{
				name: "Times Collected",
				value: `${result.timesCollected.toLocaleString()}`,
				inline: true,
			},
			{
				name: "Total Collected Eggs",
				value: `${result.collectedEggs.toLocaleString()}`,
				inline: true,
			},
			{
				name: "\u200B",
				value: "\u200B",
				inline: true,
			},
		],
		color:0x42b3f5
	};
	await message.channel.createMessage({ embed: embed });
};

module.exports.info = {
	name: "eventstats",
	description: "Get all the stats about the event.",
	category: "Developer",
	aliases: ["es"],
};
