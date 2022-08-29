// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationCheck {
    function checkVal(uint256 etherAmount) public pure returns (uint256) {
        // amount is in ether, but msg.value is in wei
        uint256 scale = 10**18 * 1 ether;
        return etherAmount / scale;
    }
}
