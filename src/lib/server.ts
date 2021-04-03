import { join } from "path";
import { InterfaceClient, req, fourth, sec, sleep } from "./Utils";
import type { User, TextChannel } from "discord.js";
import { MessageEmbed } from "discord.js";
const fastify = require("fastify")({
	logger: false,
	root: join(__dirname, "..", "..", "..", "public", "html"),
});
export default class Server {
	online: boolean;
	port: number;
	topAuth: string;
	dbotsAuth: string;
	client: InterfaceClient;
	constructor(client: InterfaceClient, { online = true, port = 3000, topAuth = "6969", dbotsAuth = "6969" }: { online?: boolean; port?: number; topAuth?: string; dbotsAuth?: string }) {
		this.port = port;
		this.client = client;
		this.online = online;
		this.topAuth = topAuth;
		this.dbotsAuth = dbotsAuth;
	}
	public async Start(): Promise<void> {
		if (this.online !== true) return;
		//prettier-ignore
		fastify.register(import("fastify-static"), { root: join(__dirname, "..",  "..", "public") });
		//prettier-ignore
		fastify.post("/api/votes", async (req) => { return await this.Api(req); });
		fastify.register(import("./routes"), { logLevel: "warn" });
		fastify.listen(this.port, "0.0.0.0", () => {
			this.client.logger.info(sec(`Server running at http://localhost:${this.port}`));
		});
		await sleep("2000").then((r) => this.client.logger.info(sec(`Server running at http://localhost:${this.port}`)));
	}
	public async Api(req: req): Promise<{ success: boolean; status: number; message?: string }> {
		const headers = req.headers;
		if (headers?.authorization) {
			let member: User;
			if (headers.authorization == this.topAuth || headers.authorization == this.dbotsAuth) {
				if (headers.authorization == this.topAuth) {
					member = await this.client.users.fetch(req.body.user);
				} else if (headers.authorization == this.dbotsAuth) {
					member = await this.client.users.fetch(req.body.id);
				}

				this.client.gp.math("commands", "+", 1);
				const iq = Math.floor(Math.random() * 150) + 1;
				this.client.UserData.ensure(member.id, { iq: iq });
				if (!member) return;
				this.client.logger.info(fourth("[ VOTE ] ") + sec(`${member.tag} (${member.id})`));
				const wknd = req.body.isWeekend;
				const cur = Number(this.client.UserData.get(member.id as string, "iq"));
				if (!cur) return;
				const amount = wknd ? 2 : 1;
				this.client.UserData.set(member.id, cur + amount, "iq");

				const channel = (this.client.channels.cache.get("823935750168117312") || (await this.client.channels.fetch("823935750168117312"))) as TextChannel;
				channel.send(
					new MessageEmbed()
						.setAuthor(`vote from ${member.tag}`, member.avatarURL())
						.setDescription(`**${member} had ${cur || "Nothing"} iq now has ${cur + amount || "Nothing"} iq**`)
						.setTimestamp()
						.setColor("#f000ff")
				);
				return { success: true, status: 200 };
			} else {
				return { success: false, status: 203, message: "Authorization is required to access this endpoint." };
			}
		} else {
			return { success: false, status: 203, message: "Authorization is required to access this endpoint." };
		}
	}
}
