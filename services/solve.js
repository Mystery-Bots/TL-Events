const ms = require('ms')

module.exports.Run = async function (bot){
	setInterval(async () => {
		let a = Math.floor(Math.random() * 100) + 1;
		let b = Math.floor(Math.random() * 100) + 1;
		let op = ["*", "+", "/", "-"][Math.floor(Math.random()*4)];
		let channel = await bot.getChannel('799176819222773801')
		let collection = bot.database.collection('players')
		let message = await channel.createMessage(`Solve the below problem to earn 10 eggs (rounded to closest whole number):\n\`${a} ${op.replace('*','×').replace('/','÷')} ${b}\``)
		let responses = await channel.awaitMessages(m => m.content == Math.round(eval(a + op + b)), { time: ms('5m'), maxMatches: 1 });
		if (responses.length){
			let response = responses[0]
			let user = await collection.findOne({"userID":response.author.id})
			message.edit(`${response.author.mention} solved the below problem:\n\`${a} ${op.replace('*','×').replace('/','÷')} ${b}\``)
			if (user.passive){
				await collection.updateOne({"userID":message.author.id},{$inc:{"collectedEggs":(10/2)}})
				await collection.updateOne({"userID":message.author.id},{$inc:{"totalEggs":(10/2)}})
			}else{
				await collection.updateOne({"userID":message.author.id},{$inc:{"collectedEggs":(10)}})
				await collection.updateOne({"userID":message.author.id},{$inc:{"totalEggs":(10)}})
			}
		}
		else{
			message.edit(`No one solved the below problem:\n\`${a} ${op.replace('*','×').replace('/','÷')} ${b}\``)
		}
	}, ms(`1h`));
}