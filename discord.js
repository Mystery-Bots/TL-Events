const Discord = require("eris");
const { readdirSync } = require("fs");
const { sep } = require("path");
let config = require("./config");
const ms = require("ms");
const moment = require("moment");
const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(config.database, {useUnifiedTopology: true});
client.connect().then(connection => {
	database = connection.db("TL-Events")
	bot.database = database
})


const bot = new Discord.Client(config.discord.token, {
	intents:4611,
	compress: true,
	guildSubscriptions:false,
	messageLimit:0,
	largeThreshold: 0,
	disableEvents: {
		'MESSAGE_DELETE':true,
		'MESSAGE_DELETE_BULK':true,
		'MESSAGE_UPDATE':true,
		'USER_UPDATE':true,
		'VOICE_SERVER_UPDATE':true
	},
});

bot.config = config.discord;

// Creating command and aliases collection.
["commands", "aliases"].forEach((x) => (bot[x] = new Discord.Collection()));

const load = (dir = "./commands/") => {
	readdirSync(dir).forEach((dirs) => {
		// sub folder check
		const commands = readdirSync(`${dir}${sep}${dirs}${sep}`).filter((files) =>
			files.endsWith(".js")
		);
		// get all files in sub folder
		for (const file of commands) {
			// put all commands in collection
			const pull = require(`${dir}/${dirs}/${file}`);
			// check to see if command exists
			if (
				pull.info &&
				typeof pull.info.name === "string" &&
				typeof pull.info.category === "string"
			) {
				if (bot.commands.get(pull.info.name))
					return console.warn(
						`Two or more commands have the same name ${pull.info.name}.`
					);
				if (pull.info.disabled){}
				// get more info about command for help command
				else{bot.commands.set(pull.info.name, pull);}
				console.log(`Loaded command ${pull.info.name}.`);
			} else {
				console.log(
					`Error loading command in ${dir}${dirs}.${file} you have a missing info.name or info.name is not a string. or you have a missing info.category or info.category is not a string`
				);
				continue;
			}
			// command aliases
			if (pull.info.aliases && typeof pull.info.aliases === "object") {
				pull.info.aliases.forEach((alias) => {
					// check for conflict with other commands
					if (bot.aliases.get(alias))
						return console.warn(
							`Two commands or more commands have the same aliases ${alias}`
						);
					bot.aliases.set(alias, pull.info.name);
				});
			}
		}
	});
};
load();

bot
	.on("error",console.error)
	.on("warn", console.warn)
	.on("ready", () => {
		require("./discordEvents/ready").Run(bot);
	})
	.on("disconnect", () => {
		console.warn("Disconnected!");
	})
	.on("reconnecting", () => {
		console.warn(
			`${moment(Date.now()).format("hh/mm A, DD/MM/YYYY")}: Reconnecting...`
		);
	})
	.on("messageCreate", (message) => {
		require('./discordEvents/message').Run(bot, message)
	})
	.on("interactionCreate",(interaction) => {
		require('./discordEvents/interactionCreate').Run(bot,interaction)
	})

setTimeout(async() => {
	bot.connect()
}, 5*1000);
