# Marketplace Smart Contract

## Overview

This repository contains the code for a simple decentralized marketplace smart contract implemented in Solidity. The contract allows users to list items for sale and buy items from other users.

## Features

- **Owner Management**: The contract owner is set at deployment and has exclusive rights to certain actions.
- **Item Listing**: Users can list items for sale by specifying a name and price.
- **Item Purchase**: Users can purchase listed items, with funds being transferred to the seller.
- **Item Retrieval**: Anyone can view the details of a listed item.

## Contract Details

### SPDX License Identifier
```solidity
// SPDX-License-Identifier: MIT
```

### Pragma Directive
```solidity
pragma solidity ^0.8.13;
```

### Contract Definition
```solidity
contract Marketplace {
    address public owner;

    struct Item {
        uint id;
        string name;
        uint price;
        address payable seller;
        address buyer;
        bool sold;
    }

    uint public itemCount;
    mapping(uint => Item) public items;

    event ItemListed(uint id, string name, uint price, address seller);
    event ItemSold(uint id, address buyer, uint price);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _;
    }

    modifier onlySeller(uint _itemId) {
        require(items[_itemId].seller == msg.sender, "Only the seller can perform this action");
        _;
    }

    function listItem(string memory _name, uint _price) public {
        require(_price > 0, "Price must be greater than zero");

        itemCount++;
        items[itemCount] = Item(
            itemCount,
            _name,
            _price,
            payable(msg.sender),
            address(0),
            false
        );

        emit ItemListed(itemCount, _name, _price, msg.sender);
    }

    function buyItem(uint _itemId) public payable {
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "Item does not exist");
        require(msg.value == item.price, "Incorrect value sent");
        require(!item.sold, "Item already sold");
        require(item.seller != msg.sender, "Seller cannot buy their own item");

        item.seller.transfer(msg.value);
        item.buyer = msg.sender;
        item.sold = true;

        emit ItemSold(_itemId, msg.sender, item.price);
    }

    function getItem(uint _itemId) public view returns (Item memory) {
        require(_itemId > 0 && _itemId <= itemCount, "Item does not exist");
        return items[_itemId];
    }
}
```

## Functions

### `listItem`
```solidity
function listItem(string memory _name, uint _price) public;
```
- Allows a user to list an item for sale.
- Emits an `ItemListed` event.

### `buyItem`
```solidity
function buyItem(uint _itemId) public payable;
```
- Allows a user to purchase a listed item.
- Transfers the item's price to the seller.
- Emits an `ItemSold` event.

### `getItem`
```solidity
function getItem(uint _itemId) public view returns (Item memory);
```
- Returns the details of a specified item.

## Events

### `ItemListed`
```solidity
event ItemListed(uint id, string name, uint price, address seller);
```
- Emitted when an item is listed for sale.

### `ItemSold`
```solidity
event ItemSold(uint id, address buyer, uint price);
```
- Emitted when an item is sold.

## Deployment

To deploy the contract, use the `Marketplace` constructor, which sets the deployer as the contract owner.

## Usage

1. **List an Item**: Call `listItem` with the item's name and price.
2. **Buy an Item**: Call `buyItem` with the item's ID and send the correct value.
3. **Get Item Details**: Call `getItem` with the item's ID.

## Authors

Aaron Gabrielle A. Galera
Email : 8214785@ntc.edu.ph

## License

This project is licensed under the MIT License