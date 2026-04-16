# DB tables

## imports
- id
- imported_at

## accounts
- sort
- account_number
- bank
- type: "card" | "e-spar" or something?


## transactions
- id
- account_id - fk
- fingerprint - unique hash(account_id + date + amount + normalized_description + balance)
- date
- import_id - fk
- import_order - int
- type: "deposit" | "transfer" or "outbound?" | "card_transaction" | "misc" (nullable)
- amount
- balance
- currency
- description - text NOT NULL
- reference - text (nullable)
- raw_payload - jsonb



# Later maybe

## rules (filters?)
- apply rules
e.g. if tx matches this then add to category

## categories
- id
- name
- merchant (nullable)

sub-categories? with merchant?


## users
- id
- email
- password_hash

## sessions


## account_transfers or transaction_pairs or transaction_links
link transactions together between accounts, like
- from_transaction_id
- to_transaction_id
- amount_delta
