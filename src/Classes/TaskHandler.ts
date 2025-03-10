import { join } from "path";
import { ms } from "../Lib/Utils";
import { readdirSync } from "fs";
import client from "./Client";
export default class TaskHandler {
	directory: string;
	client: client;

	constructor(client, { directory }) {
		this.client = client;
		this.directory = directory;
	}
	loadall() {
		const taskfiles = readdirSync(join(__dirname, "..", "Tasks")).filter((file) => file.endsWith(".js"));
		for (const file of taskfiles) {
			const task = require(join(__dirname, "..", "Tasks/" + file));
			if (task?.awaitReady == true) {
				this.client.on("ready", () => {
					if (task?.runOnStart == true) task.execute(this.client);
				});
			} else if (task?.runOnStart == true) task.execute(this.client);

			if (task?.delay) {
				setInterval(() => {
					task?.execute(this.client);
				}, ms(task?.delay));
			}
		}
	}
}
