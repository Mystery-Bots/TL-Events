medals = {
    "1":"🥇",
    "2":"🥈",
    "3":"🥉"
}

template = {
    "common": 0,
    "rare":0,
    "epic":0,
    "totalPoints":0
}

module.exports.run = async (bot, message, args) => {
    const collection = bot.database.collection(`${message.channel.guild.id}`)
    user = message.mentions[0]
    if(!user){
        if (!args[0]){
            user = message.author
        }
        else {
            userArray = await message.channel.guild.fetchMembers({userIDs:[args[0]]})
            user = userArray[0]
        }
    }
    let userResult = await collection.findOne({"userID": `${user.id}`})
    if (!userResult) {
        template.userID = user.id,
        template.username = `${user.username}#${user.discriminator}`
        await userCollection.insertOne(userUpdateDoc); 
        userResult = await collection.findOne({"userID": `${user.id}`})
    }
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
            {
                name: "Total Gifts",
                value: (userResult.common+userResult.rare+userResult.epic).toLocaleString()
            }
        ]
    }
    message.channel.createMessage({embed:embed})
}

module.exports.info = {
    name: "stats",
    description: "Get stats on a player.",
    category: "Game",
}