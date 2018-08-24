
var SlackBot = require('slackbots');
import {threeButtonsFunc, introButton, ollyOnStart, ollyOnIntro, ollyOnMatch, youDontExist} from './bot-lib';
import User from "../users/entity"
let time = `${new Date().getHours()}:${new Date().getMinutes()}`;

export const bot = new SlackBot({
	token: process.env.BOT_ID,
	name: "Olly"
})

bot.on("start", () => {
	const params = {
		icon_emoji: ":penguin:"
	}
	
	console.log(`Olly's server is running @ ${time}`)

	bot.postMessageToChannel(
		"olly-status",
		`${ollyOnStart}`,
		`${params.icon_emoji}`
	)
})

bot.on("error", (err) => console.log(err))

bot.on("message", (data) => {
	if (data.type !== "message") {
		return;
	}
	handleMessage(data)
})

function handleMessage(data) {
	if(!data.text) return;

	if (data.text.includes("goals")) {
		return ollyMatch(data)
	} else if (data.text.includes("intro")) {
		return ollyIntro(data)
	}
}

async function ollyIntro(data) {
	const existingUser = await User.find({slackId: data.user})

	if(existingUser.length > 0) {
		return `${youDontExist}`
	}

	bot.postMessage(
		data.channel,
		`${ollyOnIntro}`,
		{
			attachments: await JSON.stringify(await introButton)
		}
	)
		.then(res => console.log(" ___ OLLY INTRO res ___ : ", res.message))
  	.catch(err => console.error(err))
}

async function ollyMatch(data) {
  bot.postMessage(
    data.channel, 
    `${ollyOnMatch}`,
    {
      attachments: await JSON.stringify(await threeButtonsFunc())
    }
  )
  .then(res => console.log("RESULT", res))
  .catch(err => console.error(err))
}
