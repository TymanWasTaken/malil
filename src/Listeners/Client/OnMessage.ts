import { Listener } from "discord-akairo";
import { Message } from "discord.js";
import Client from "../../Classes/Client";
import skytils from "../../Lib/skytils";
import tricked from "../../Lib/tricked";
import drm from "../../Lib/dungeonroom";
import shitpost from "../../Lib/shitpost";
export default class message extends Listener {
	public constructor(client: Client) {
		super("message", {
			emitter: "client",
			event: "message",
			category: "client",
		});
		this.client = client;
	}

	async exec(message: Message): Promise<void> {
		if (message?.guild?.id == "748956745409232945") {
			tricked(message);
		} else if (message?.guild?.id == "804143990869590066") {
			drm(message);
		} else if (message?.author.bot) {
			return;
		} else if (message?.guild?.id == "807302538558308352") {
			skytils(message);
		} else if (this.client.gp.ensure("shitpost", []).includes(message?.channel?.id)) {
			shitpost(message);
		}
	}
}
