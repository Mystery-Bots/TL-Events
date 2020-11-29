medals = {
    "1":"🥇",
    "2":"🥈",
    "3":"🥉"
}

module.exports.run = async (bot, message, args) => {
    let guild = message.channel.guild
    let collection = bot.database.collection(`${guild.id}`)
    let top10 = await collection.find().sort({totalPoints:-1}).limit(10).toArray()
    let descriptionList = ["Based on total points:"]
    let placing = 1
    top10.forEach(user => {
        descriptionList.push(`${medals[placing] ? medals[placing] : `#${placing}`} <@${user.userID}>: ${user.totalPoints.toLocaleString()}`)
        placing += 1
    })
    embedObject = {
        title:"Leaderboard Top 10",
        description: descriptionList.join('\n'),
        color: 0xf2ae4f
    }
    message.channel.createMessage({embed:embedObject})
}

module.exports.info = {
    name: "leaderboard",
    description: "Get the current leaderboard",
    category: "Game",
    cooldown: "20s"
}