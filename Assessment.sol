// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Buy(uint256 amount);
    event Sell(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256) {
        return balance;
    }

    function buy() public payable {
        require(msg.sender == owner, "You are not the owner of this account");

        uint _previousBalance = balance;

        // Perform transaction
        balance += msg.value;

        // Assert transaction completed successfully
        assert(balance == _previousBalance + msg.value);

        // Emit the event
        emit Buy(msg.value);
    }

    // Custom error
    error InsufficientBalance(uint256 balance, uint256 sellAmount);

    function sell(uint256 _sellAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");

        uint _previousBalance = balance;
        if (balance < _sellAmount) {
            revert InsufficientBalance({
                balance: balance,
                sellAmount: _sellAmount
            });
        }

        // Perform transaction
        balance -= _sellAmount;
        (bool sent, ) = owner.call{value: _sellAmount}("");
        require(sent, "Failed to send Ether");

        // Assert the balance is correct
        assert(balance == (_previousBalance - _sellAmount));

        // Emit the event
        emit sell(_sellAmount);
    }
}
