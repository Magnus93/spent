import { Icabanken } from "./index"

const csv = `Datum;Text;Typ;Belopp;Saldo
2026-04-12;Galaxy Tobak           Uppsala        Se ;Reserverat belopp;-40,00 kr;
2026-04-11;Chopchop Boland               ;Korttransaktion;-343,00 kr;187,94 kr
2026-04-11;Galaxy Tobak                  ;Korttransaktion;-92,00 kr;530,94 kr`

describe("Icabanken", () => {
	it("parse", () => {
		const transactions = Icabanken.parseCsv(1, 2, csv)
		expect(transactions).toEqual([
			{
				accountId: 1,
				batchId: 2,
				amount: -40,
				balance: undefined,
				orderInBatch: 2,
				date: new Date("2026-04-12"),
				description: "Galaxy Tobak           Uppsala        Se",
				type: undefined,
				currency: "SEK",
				raw: {
					Datum: "2026-04-12",
					Text: "Galaxy Tobak           Uppsala        Se",
					Typ: "Reserverat belopp",
					Belopp: "-40,00 kr",
					Saldo: "",
				},
			},
			{
				accountId: 1,
				batchId: 2,
				date: new Date("2026-04-11"),
				description: "Chopchop Boland",
				orderInBatch: 1,
				type: "card_transaction",
				amount: -343.0,
				balance: 187.94,
				currency: "SEK",
				raw: {
					Datum: "2026-04-11",
					Text: "Chopchop Boland",
					Typ: "Korttransaktion",
					Belopp: "-343,00 kr",
					Saldo: "187,94 kr",
				},
			},
			{
				accountId: 1,
				batchId: 2,
				date: new Date("2026-04-11"),
				description: "Galaxy Tobak",
				type: "card_transaction",
				amount: -92.0,
				balance: 530.94,
				orderInBatch: 0,
				currency: "SEK",
				raw: {
					Datum: "2026-04-11",
					Text: "Galaxy Tobak",
					Typ: "Korttransaktion",
					Belopp: "-92,00 kr",
					Saldo: "530,94 kr",
				},
			},
		])
	})
})
