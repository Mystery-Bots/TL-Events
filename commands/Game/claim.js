const config = require("../../config");
const moment = require("moment");
const ms = require('ms')

function userTemplate(user) {
	let secrets = config.secrets;
	let template = {
		userID: user.id,
		username: user.username,
		staffEggs: 0,
		foundEggs: 0,
		collectedEggs: 0,
		totalEggs: 0,
		streak: 0,
		lastCollected: 0,
		secrets,
	};
	return template;
}

module.exports.run = async (bot, message, args) => {
	let user = message.author;
	let randomEggs = Math.floor(Math.random() * (60 - 40 + 1) + 40);
	let randomChance = Math.floor(Math.random() * (100 - 1 + 1) + 1);
	let playerCollection = bot.database.collection("players");
	let statsCollection = bot.database.collection('stats')
	let playerStats = await playerCollection.findOne({ userID: user.id });
	if (!playerStats) {
		playerStats = userTemplate(user);
		await statsCollection.updateOne({"_id":"600608c92fe331ec1a128a1f"}, {$inc:{"totalPlayers":1}})
	}
	if (playerStats.lastCollected != 0){
		if (!moment().isAfter(moment(playerStats.lastCollected).add(1,'day'))){
			let timeLeft = moment(playerStats.lastCollected).add(1,'day').subtract(moment())
			return message.channel.createMessage(`You have already claimed your daily eggs. Please wait ${ms(timeLeft.valueOf(),{ long: true })} before claiming again.`);
		}
	}
	let collectionMessage;
	let streakMessage;
	if (randomChance <= 15) {
		currentEggs = playerCollection.collectedEggs
		playerStats.collectedEggs -= (randomEggs - 5);
		if (playerStats.collectedEggs < 0) {
			if (currentEggs == 0){
				playerStats.collectedEggs = 0
				collectionMessage = `${user.mention}, Luckily you didn't have any eggs to lose.`;
			}
			else {
				playerStats.collectedEggs = 0;
				if (totalEggs != 0){
					playerStats.totalEggs -= Math.abs(0 - (randomEggs - 5))
				}
				await statsCollection.updateOne({"_id":"600608c92fe331ec1a128a1f"}, {$inc:{"collectedEggs":-Math.abs(0 - (randomEggs - 5))}})
				collectionMessage = `Oh no ${user.mention}, you lost the rest of your collected eggs.`;
			}
		} else {
			playerStats.totalEggs -= (randomEggs - 5)
			collectionMessage = `Oh no ${user.mention}, you dropped **${
				randomEggs - 5
			}** eggs.`;
			await statsCollection.updateOne({"_id":"600608c92fe331ec1a128a1f"}, {$inc:{"collectedEggs":randomEggs-5}})

		}
	} else if (randomChance > 15 && randomChance <= 40) {
		collectionMessage = `Sadly ${user.mention}, didn't find any eggs.`;
	} else if (randomChance > 40) {
		if (user.passive){
			playerStats.collectedEggs += (randomEggs/2);
			playerStats.totalEggs += (randomEggs/2)
			collectionMessage = `Congrats ${user.mention}, you found **${randomEggs/2}** eggs.`;
			await statsCollection.updateOne({"_id":"600608c92fe331ec1a128a1f"}, {$inc:{"collectedEggs":randomEggs/2}})

		}else{
			playerStats.collectedEggs += randomEggs;
			playerStats.totalEggs += randomEggs
			collectionMessage = `Congrats ${user.mention}, you found **${randomEggs}** eggs.`;
			await statsCollection.updateOne({"_id":"600608c92fe331ec1a128a1f"}, {$inc:{"collectedEggs":randomEggs}})

		}
	}
	if (moment().isBefore(moment(playerStats.lastCollected).add(2,'day'))){
		if ((playerStats.streak + 1) % 7 == 0) {
			streakMessage = `Congrats you reached your daily streak. You have been rewarded **50** Eggs\nYour daily streak has been reset to 0/7`;
			playerStats.lastCollected = moment().valueOf()
			playerStats.collectedEggs += 50
			playerStats.totalEggs += 50
			playerStats.streak ++
			await statsCollection.updateOne({"_id":"600608c92fe331ec1a128a1f"}, {$inc:{"streaks":1}})
		} else {
			streakMessage = `Your daily streak has increased to ${
				(playerStats.streak + 1) % 7
			}/7 days`;
			playerStats.lastCollected = moment().valueOf()
			playerStats.streak ++
		}
	} else if (playerStats.lastCollected == 0){
		streakMessage = `Your daily streak has increased to ${
			(playerStats.streak + 1) % 7
		}/7 days`;
		playerStats.lastCollected = moment().valueOf()
		playerStats.streak ++
	} else {
		streakMessage = `Your daily streak has been reset to 0/7 days`;
		playerStats.lastCollected = moment().valueOf()
		playerStats.streak = 0
	}
	await playerCollection.updateOne({"userID":user.id}, {$set:playerStats}, {upsert:true})
	let finalMessage = [collectionMessage, streakMessage].join('\n')
	message.channel.createMessage(finalMessage)
};

module.exports.info = {
	name: "claim",
	description: "Claim your daily eggs",
	category: "Game",
};
