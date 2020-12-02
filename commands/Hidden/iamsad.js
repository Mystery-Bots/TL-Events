
module.exports.run = async (bot, message, args) => {
    await message.delete()
    message.channel.createMessage("OwO did someone claim the gift before you.")
}

module.exports.info = {
    name: "iamsad",
    description: "Changes the bots' pfp for 1h",
    category: "Hidden",
    aliases: ['imgonnacry','imgonnacrynow','immagocrynow','immagocry']
}