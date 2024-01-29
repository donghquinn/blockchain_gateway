# Blockchain GateWay

* Client: User
* Account: Blockchain Account

## Functions

### Account

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

- account/create: Create Account
    - HTTP Method: POST
    - Body
        - uuid: client uuid
    - Response
        - address: Account Address


### Transaction

- send
    - HTTP Method: POST
    - Body
        - from: Sender's Blockchain Address 
        - to: Receiver's Blockchain Address
        - value: Sending Coin Value
        - gas: Gas.