const moment = require("moment")

medals = {
	1: "🥇",
	2: "🥈",
	3: "🥉",
};

module.exports.run = async (bot, message, args) => {
	let collection = bot.database.collection("players");
	if (!args[0]) {
		user = message.member;
	} else {
		userArray = await message.channel.guild.fetchMembers({
			userIDs: [args[0]],
		});
		user = userArray[0];
	}
	let userResult = await collection.findOne({ userID: `${user.id}` });
	if (!userResult) {
        if (!args[0]){
            return message.channel.createMessage("Run `tlclaim` to claim your first batch of eggs")
        }else {
            return message.channel.createMessage("No player profile found")
        }
    }
	let allResult = await collection.find().sort({ totalEggs: -1 }).toArray();
	placing =
		allResult
			.map((e) => {
				return e.userID;
			})
			.indexOf(user.id) + 1;
	embed = {
		title: `${user.username}'s Stats`,
		color: user.color,
		description: `ID: ${user.id}\n**Ranking:** ${placing}${
			medals[placing] ? medals[placing] : ""
        }\n\n**Total Eggs:** ${userResult.totalEggs.toLocaleString()}\nCollected Eggs: ${userResult.collectedEggs.toLocaleString()}\nFound Eggs: ${userResult.foundEggs.toLocaleString()}\nStaff Eggs: ${userResult.staffEggs.toLocaleString()}\n\nStreak Total: ${userResult.streak.toLocaleString()}`,
        footer: {
            text:"Last collected"
        },
        timestamp: moment(userResult.lastCollected)
	};
	message.channel.createMessage({ embed: embed });
};

module.exports.info = {
	name: "stats",
	description: "Get stats on a player.",
	category: "Game",
};
