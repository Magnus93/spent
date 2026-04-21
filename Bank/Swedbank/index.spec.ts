import { Swedbank } from "./index"

const csv = `* Transaktioner Period 2025-01-012025-12-31 Skapad 2026-04-13 22:01 CEST
Radnummer,Clearingnummer,Kontonummer,Produkt,Valuta,Bokföringsdag,Transaktionsdag,Valutadag,Referens,Beskrivning,Belopp,Bokfört saldo
1,83816,9244483674,"e-sparkonto",SEK,2025-12-30,2025-12-31,2026-01-01,"skatt","Preliminär skatt",-52.00,19064.40
2,83816,9244483674,"e-sparkonto",SEK,2025-12-30,2025-12-31,2026-01-01,"","Sparränta",176.57,19116.40`

describe("Swedbank", () => {
	it("parse", () => {
		const transactions = Swedbank.parseCsv(1, 2, csv)
		expect(transactions).toEqual([
			{
				accountId: 1,
				batchId: 2,
				date: new Date("2025-12-31"),
				type: undefined,
				amount: -52,
				balance: 19064.4,
				currency: "SEK",
				description: "Preliminär skatt",
				reference: "skatt",
				orderInBatch: 1,
				raw: {
					Radnummer: "1",
					Clearingnummer: "83816",
					Kontonummer: "9244483674",
					Produkt: "e-sparkonto",
					Valuta: "SEK",
					Bokföringsdag: "2025-12-30",
					Transaktionsdag: "2025-12-31",
					Valutadag: "2026-01-01",
					Referens: "skatt",
					Beskrivning: "Preliminär skatt",
					Belopp: "-52.00",
					"Bokfört saldo": "19064.40",
				},
			},
			{
				accountId: 1,
				batchId: 2,
				date: new Date("2025-12-31"),
				type: undefined,
				amount: 176.57,
				balance: 19116.4,
				currency: "SEK",
				description: "Sparränta",
				reference: "",
				orderInBatch: 0,
				raw: {
					Radnummer: "2",
					Clearingnummer: "83816",
					Kontonummer: "9244483674",
					Produkt: "e-sparkonto",
					Valuta: "SEK",
					Bokföringsdag: "2025-12-30",
					Transaktionsdag: "2025-12-31",
					Valutadag: "2026-01-01",
					Referens: "",
					Beskrivning: "Sparränta",
					Belopp: "176.57",
					"Bokfört saldo": "19116.40",
				},
			},
		])
	})
})
