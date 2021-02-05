module.exports.Run = async function(bot, database){        
	bot.editStatus('online')
	require('../services/solve').Run(bot)
	console.log("Bot Ready")
}