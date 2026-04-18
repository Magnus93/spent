import { Account as CoreAccount } from "./Account"
import { Batch as CoreBatch } from "./Batch"
import { Transaction as CoreTransaction } from "./Transaction"

export namespace core {
	export import Account = CoreAccount
	export import Batch = CoreBatch
	export import Transaction = CoreTransaction
}
