import { core } from "core"
import { Repository } from "Repository"

export class Account {
	constructor(private readonly repository: Repository) {}

	async list(): Promise<core.Account[]> {
		return [
			{
				id: "blahblah",
				sort: "81234",
				accountNumber: "123456789",
				bank: "icabanken",
				type: "card",
			},
			{
				id: "jkdjasljdl",
				sort: "65432",
				accountNumber: "09876543",
				bank: "danskebank",
				type: "saving",
			},
		]
	}
}
