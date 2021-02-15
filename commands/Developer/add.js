module.exports.run = async (bot, message, args) => {
    if (!bot.config.devs.includes(message.author.id)) return console.log(`${message.author.username} (ID: ${message.author.id}) tried to use "add"`)
    let user = args[0]
    let playerCollection = bot.database.collection("players")
    let statsCollection = bot.database.collection("stats")
    await playerCollection.updateOne({"userID":user}, {$inc:{"staffEggs":parseInt(args[1]),"totalEggs":parseInt(args[1])}})
    await statsCollection.updateOne({"_id":"600608c92fe331ec1a128a1f"}, {$inc:{"staffEggs":parseInt(args[1])}})
    message.channel.createMessage({content:`Added ${args[1]} eggs to <@${user}>'s profile`, messageReferenceID:message.id})
}

module.exports.info = {
    name: "add",
    description: "Add eggs to a users profile",
    category: "Developer"
}