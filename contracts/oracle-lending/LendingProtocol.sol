// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../oracle/PriceOracle.sol";

contract LendingProtocol {
    PriceOracle public oracle;
    mapping(address => uint256) public collateral;

    constructor(address _oracle) {
        oracle = PriceOracle(_oracle);
    }

    function depositCollateral() external payable {
        collateral[msg.sender] += msg.value;
    }

    function borrow() external {
        uint256 price = oracle.getPrice();
        require(collateral[msg.sender] * price / 1e18 >= 1000, "Undercollateralized");
        payable(msg.sender).transfer(0.5 ether);
    }

    receive() external payable {}
}
