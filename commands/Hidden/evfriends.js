module.exports.run = async (bot, message, args) => {
    if (message.channel.guild.id != "793414964059701249") return
    await message.member.addRole("793415158948823090","They became my friend")
    await message.delete()
    return
}

module.exports.info = {
    name: "evfriends",
    description: "Gives the user the tlev's Friends role",
    category: "Hidden",
}