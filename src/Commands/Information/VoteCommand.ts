//https://raw.githubusercontent.com/SkyBlockDev/malil-akairo/main/vote.markdown
import { Command } from "discord-akairo";
import centra from "centra";
import { MessageEmbed, Message } from "discord.js";

export default class VoteCommand extends Command {
	public constructor() {
		super("vote", {
			aliases: ["vote", "votes"],
			category: "Info",
			quoted: true,
			description: {
				content: "Sends the links you can use to vote for malil",
				example: ["vote"],
			},
			clientPermissions: ["SEND_MESSAGES"],
			ratelimit: 3,
			channel: "guild",
		});
	}
	public async exec(message: Message): Promise<Message> {
		const embed = new MessageEmbed()
			.setTitle("Vote lists")
			.setThumbnail(this.client.user.avatarURL())
			.setTimestamp()
			.setColor(this.client.colors.default)
			.setDescription(
				"[topgg](https://top.gg/bot/749020331187896410/vote), (increases iq)\n" +
					"[discordbotlist.com](https://discordbotlist.com/bots/malil/upvote),\n" +
					"[BladeBots](https://bladebotlist.xyz/bot/749020331187896410/vote),\n" +
					"[fateList](https://fateslist.xyz/bot/749020331187896410/vote)"
			);
		return message.util.send(embed);
	}
}
