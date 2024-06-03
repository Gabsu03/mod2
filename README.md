# Smart Contract Contract

This is a contract that allows the owner to buy and sell ETH. The contract maintains a balance and emits events for buy and sell transactions.

## Features

- Allows the owner to buy ETH and increase the contract balance.
- Allows the owner to sell ETH and decrease the contract balance.
- Emits events for buy and sell transactions.
- Custom error handling for insufficient balance during sell transactions.

## Contract Overview

### State Variables

- `address payable public owner`: The owner of the contract.
- `uint256 public balance`: The current balance of the contract.

### Events

- `event Buy(uint256 amount)`: Emitted when ETH is bought.
- `event Sell(uint256 amount)`: Emitted when ETH is sold.

### Constructor

- `constructor(uint initBalance) payable`: Initializes the contract with the specified initial balance and sets the contract owner to the deployer.

### Functions

- `function getBalance() public view returns(uint256)`: Returns the current balance of the contract.
- `function buy() public payable`: Allows the owner to buy ETH and increase the contract balance. Emits a `Buy` event.
- `function sell(uint256 _sellAmount) public`: Allows the owner to sell ETH and decrease the contract balance. Emits a `Sell` event. Reverts with a custom error `InsufficientBalance` if the balance is insufficient.

### Custom Error

- `error InsufficientBalance(uint256 balance, uint256 sellAmount)`: Custom error for handling insufficient balance during sell transactions.

## Usage

1. Deploy the contract with an initial balance:

    ```solidity
    uint initialBalance = 100; // Example initial balance
    Assessment assessment = new Assessment(initialBalance);
    ```

2. Buy ETH (only the owner can call this function):

    ```solidity
    assessment.buy{value: msg.value}();
    ```

3. Sell ETH (only the owner can call this function):

    ```solidity
    uint sellAmount = 50; // Example sell amount
    assessment.sell(sellAmount);
    ```

## Template
Template used by Metacrafters Chris (https://github.com/MetacrafterChris/SCM-Starter.git)

## Authors

Aaron Gabrielle A. Galera
Email : 8214785@ntc.edu.ph

## License

This project is licensed under the UNLICENSED License.
