module.exports.run = async (bot, message, args) => {
    if (!bot.config.devs.includes(message.author.id)) return console.log(`${message.author.username} (ID: ${message.author.id}) tried to use "eventstats"`)
    let collection = bot.database.collection('stats')
    let result = await collection.findOne({_id:'5fb5896be09eb535b97403be'})
    let embed = {
        title: "Christmas Event Stats",
        fields: [
            {
                name: "Spawn Times (Seconds)",
                value: `Min: ${result.minSpawn}\nMax: ${result.maxSpawn}`,
                inline: true
            },
            {
                name: "Total Staff Gift",
                value: `${result.totalStaff}`,
                inline: true
            },
            {
                name: "Total Collected Gifts",
                value: `${result.totalClaims}`,
                inline: true
            },
            {
                name: "Total Common Gifts",
                value: `${result.totalCommon}`,
                inline: true
            },
            {
                name: "Total Rare Gifts",
                value: `${result.totalRare}`,
                inline: true
            },
            {
                name: "Total Epic Gifts",
                value: `${result.totalEpic}`,
                inline: true
            },
        ]}
    await message.channel.createMessage({embed:embed})
}

module.exports.info = {
    name: "eventstats",
    description: "Get all the stats about the event.",
    category: "Developer",
}