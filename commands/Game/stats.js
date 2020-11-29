medals = {
    "1":"🥇",
    "2":"🥈",
    "3":"🥉"
}

module.exports.run = async (bot, message, args) => {
    const collection = bot.database.collection(`${message.channel.guild.id}`)
    user = message.mentions[0]
    if(!user){
        user = message.author
    }
    let userResult = await collection.findOne({"userID": `${user.id}`})
    if (!userResult) return message.channel.createMessage("No user stats found.")
    let allResult = await collection.find().sort({totalPoints:-1}).toArray()
    placing = (allResult.map((e)=>{return e.userID}).indexOf(user.id))+1
    embed = {
        title: `${user.username}'s Stats`,
        color: 0xff99f8,
        description: `ID: ${user.id}\n\n**Total Points:** ${userResult.totalPoints.toLocaleString()}\n**Ranking:** ${placing}${medals[placing] ? medals[placing] : ""}`,
        fields: [
            {
                name: "Common (1 pt)",
                value: userResult.common.toLocaleString()
            },
            {
                name: "Rare (2 pts)",
                value: userResult.rare.toLocaleString()
            },
            {
                name: "Epic (5 pts)",
                value: userResult.epic.toLocaleString()
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