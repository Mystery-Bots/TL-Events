module.exports.run = async (bot, message, args) => {
    message.channel.createMessage(`Ping: ${message.channel.guild.shard.latency.toFixed(1)} ms`)
}

module.exports.info = {
    name: "ping",
    description: "Get bot's ping.",
    category: "About",
    cooldown: "20s"
}