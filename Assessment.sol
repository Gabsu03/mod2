// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

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
