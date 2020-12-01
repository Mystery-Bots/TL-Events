module.exports.run = async (bot, message, args) => {
    if (!bot.config.devs.includes(message.author.id)) return console.log(`${message.author.username} (ID: ${message.author.id}) tried to use "eventstats"`)
    let collection = bot.database.collection('stats')
    let result = await collection.findOne({_id:'5fb5896be09eb535b97403be'})
    let embed = {
        title: "Christmas Event Stats",
        fields: [
            {
                name: "Spawn Times (Minutes)",
                value: `Min: ${result.minSpawn}\nMax: ${result.maxSpawn}`,
                inline: true
            },
            {
                name: "Total Staff Gift",
                value: `${result.totalStaff.toLocaleString()}`,
                inline: true
            },
            {
                name: "Total Collected Gifts",
                value: `${result.totalClaims.toLocaleString()}`,
                inline: true
            },
            {
                name: "Total Common Gifts",
                value: `${result.totalcommon.toLocaleString()}`,
                inline: true
            },
            {
                name: "Total Rare Gifts",
                value: `${result.totalrare.toLocaleString()}`,
                inline: true
            },
            {
                name: "Total Epic Gifts",
                value: `${result.totalepic.toLocaleString()}`,
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