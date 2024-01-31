# Blockchain GateWay

* Client: User
* Account: Blockchain Account

## Manager

### Account Manager

- WeakMap
    - Key: Client's UUID
    - Item: email
- Map email with client's uuid
- Key is managed by key List

## Controller

### Client

- signup: Create Client
    - HTTP Method: POST

    - Body
        - email: string
        - password: string

- login
    - HTTP Method: POST

    - Body
        - email: string
        - password: string

    - Response
        - uuid: client uuid

- logout
    - HTTP Method: POST

    - Body
        - uuid: client uuid

    - Response
        - message

### Account

- create: Create Account
    - HTTP Method: POST

    - Body
        - uuid: client uuid

    - Response
        - address: Account Address

- list: Account List
    - HTTP Method: POST

    - Body
        - uuid: client uuid

    - Response
        - address: Account Address List Mapped with Client

- balance: Account Balance
    - HTTP Method: POST

    - Body
        - uuid: client uuid
        - address: account address

    - Response
        - address: Account Balance

### Transaction

- send
    - HTTP Method: POST

    - Body
        - from: Sender's Blockchain Address 
        - to: Receiver's Blockchain Address
        - value: Sending Coin Value
        - gas: Gas