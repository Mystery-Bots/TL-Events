const EmbedPaginator = require('eris-pagination');

let medals = {
    "1":"🥇",
    "2":"🥈",
    "3":"🥉"
}

async function overallLeaderboard(collection){
    let top10 = await collection.find().sort({totalEggs:-1}).limit(10).toArray()
    let descriptionList = []
    let placing = 1
    top10.forEach(user => {
        descriptionList.push(`${medals[placing] ? medals[placing] : `#${placing}`} <@${user.userID}>: ${user.totalEggs.toLocaleString()}`)
        placing += 1
    })
    let embedObject = {
        author:{
            name: "Leaderboard Top 10"
        },
        title: "Overall Leaderboard",
        description: descriptionList.join('\n'),
        color: 0xf2ae4f,
        footer: {
            text: "Page 1/4"
        }
    }
    return embedObject
}

async function foundLeaderboard(collection){
    let top10 = await collection.find().sort({foundEggs:-1}).limit(10).toArray()
    let descriptionList = []
    let placing = 1
    top10.forEach(user => {
        descriptionList.push(`${medals[placing] ? medals[placing] : `#${placing}`} <@${user.userID}>: ${user.foundEggs.toLocaleString()}`)
        placing += 1
    })
    let embedObject = {
        author:{
            name: "Leaderboard Top 10"
        },
        title: "Found Leaderboard",
        description: descriptionList.join('\n'),
        color: 0xf2ae4f,
        footer: {
            text: "Page 2/4"
        }
    }
    return embedObject
}

async function collectedLeaderboard(collection){
    let top10 = await collection.find().sort({collectedEggs:-1}).limit(10).toArray()
    let descriptionList = []
    let placing = 1
    top10.forEach(user => {
        descriptionList.push(`${medals[placing] ? medals[placing] : `#${placing}`} <@${user.userID}>: ${user.collectedEggs.toLocaleString()}`)
        placing += 1
    })
    let embedObject = {
        author:{
            name: "Leaderboard Top 10"
        },
        title: "Collected Leaderboard",
        description: descriptionList.join('\n'),
        color: 0xf2ae4f,
        footer: {
            text: "Page 3/4"
        }
    }
    return embedObject
}

async function streakLeaderboard(collection){
    let top10 = await collection.find().sort({streak:-1}).limit(10).toArray()
    let descriptionList = []
    let placing = 1
    top10.forEach(user => {
        descriptionList.push(`${medals[placing] ? medals[placing] : `#${placing}`} <@${user.userID}>: ${user.streak.toLocaleString()}`)
        placing += 1
    })
    let embedObject = {
        author:{
            name: "Leaderboard Top 10"
        },
        title: "Streak Leaderboard",
        description: descriptionList.join('\n'),
        color: 0xf2ae4f,
        footer: {
            text: "Page 4/4"
        }
    }
    return embedObject
}

module.exports.run = async (bot, message, args) => {
    let overall = await overallLeaderboard(bot.database.collection("players"))
    let found = await foundLeaderboard(bot.database.collection("players"))
    let collected = await collectedLeaderboard(bot.database.collection("players"))
    let streak = await streakLeaderboard(bot.database.collection("players"))
    EmbedPaginator.createPaginationEmbed(message, [overall, found, collected, streak], {
        showPageNumbers: false,
        extendedButtons: true
    });
}

module.exports.info = {
    name: "leaderboard",
    description: "Get the current leaderboard",
    category: "Game",
    cooldown: "20s",
    GuildOnly: true,
    aliases: ["lb"]
}