import { Command } from "discord-akairo";
import { Message } from "discord.js";
import {} from "../../Lib/Utils";
import centra from "centra";
export default class FactCommand extends Command {
	public constructor() {
		super("fact", {
			aliases: ["fact"],
			category: "Fun",
			quoted: true,
			args: [
				{
					id: "args",
					type: "array",
					match: "rest",
				},
			],
			description: {
				content: "Searches the internet for a fact",
				example: ["fact"],
			},
			clientPermissions: ["SEND_MESSAGES"],
			ratelimit: 2,
			channel: "guild",
		});
	}

	public async exec(message: Message): Promise<void> {
		const res = await (await centra(`https://api.dagpi.xyz/data/fact`, "get").header("Authorization", this.client.credentials.dagpi).send()).json();
		message.util.send(res.fact, { allowedMentions: { repliedUser: false } });
	}
}
