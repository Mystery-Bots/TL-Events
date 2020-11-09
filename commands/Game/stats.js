medals = {
    "1":"🥇",
    "2":"🥈",
    "3":"🥉"
}

module.exports.run = async (bot, message, args) => {
    const collection = bot.database.collection(`${message.channel.guild.id}`)
    user = message.author
    let userResult = await collection.findOne({"userID": `${user.id}`})
    let allResult = await collection.find().sort({totalPoints:-1}).toArray()
    placing = (allResult.map((e)=>{return e.userID}).indexOf(user.id))+1
    totalPoints = parseInt(userResult["Common"]) + (parseInt(userResult["Rare"])*2) + (parseInt(userResult["Epic"])*5)
    embed = {
        title: `${user.username}'s Stats`,
        color: 0xff99f8,
        description: `ID: ${user.id}\n\n**Total Points:** ${totalPoints}\n**Ranking:** ${placing}${medals[placing] ? medals[placing] : ""}`,
        fields: [
            {
                name: "Common",
                value: userResult["Common"]
            },
            {
                name: "Rare",
                value: userResult["Rare"]
            },
            {
                name: "Epic",
                value: userResult["Epic"]
            },
            
        ]
    }
    message.channel.createMessage({embed:embed})
}

module.exports.info = {
    name: "stats",
    description: "Get stats on a player.",
    category: "Game",
}