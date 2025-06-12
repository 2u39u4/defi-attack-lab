# 🔓 DeFi Attack Lab

一个基于 Hardhat 的 DeFi 攻防实验平台，包含两个典型攻击案例：

- 🧨 重入攻击（Reentrancy Attack）
- 🧨 预言机操控攻击（Oracle Price Manipulation）

本项目适合网络安全方向学生、智能合约开发者、DeFi 安全研究者进行学习、实验和扩展。

---

## 🧠 攻击原理解释

### 1. 重入攻击（Reentrancy Attack）

**核心漏洞**：合约在更新用户状态前先执行 `call.value()`，导致攻击合约递归调用，重复提取资金。

攻击流程：

1. 用户存入 ETH 到 `Vault`。
2. 攻击者合约调用 `withdraw()`。
3. `Vault` 调用攻击合约 fallback，攻击者再次发起 `withdraw()`，余额尚未更新，造成多次取款。
4. `Vault` 被掏空。

### 2. 预言机操控攻击（Oracle Manipulation）

**核心漏洞**：Lending 协议依赖一个不可信的 Oracle 合约获取抵押品价格，攻击者可控制价格导致系统高估抵押品价值。

攻击流程：

1. 攻击者将 Oracle 报价人为设置为高价。
2. 存入极少 ETH 抵押，却因高估价值能借出远超抵押价值的 ETH。
3. 攻击合约完成套利。

---

## 🧩 合约功能介绍

### `Vault.sol`

一个简单的 ETH 金库合约，允许用户存款和取款。存在重入攻击漏洞。

### `VaultAttack.sol`

攻击者合约，通过重入方式递归调用目标合约的 `withdraw()`，反复盗取资金。

### `PriceOracle.sol`

一个简化的预言机，允许任意用户设置价格，用于模拟被攻击的场景。

### `LendingProtocol.sol`

一个依赖 Oracle 报价进行抵押借贷的协议，允许用户存入 ETH 作为抵押借出资金。

### `OracleLendingAttack.sol`

攻击者合约，先操控 Oracle 报价为高价，伪造高价值抵押，从协议中借出超额资金。

---

## 🛠️ 本地部署与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 编译合约

```bash
npx hardhat compile
```

### 3. 运行攻击脚本
重入攻击：
```bash
npx hardhat run scripts/runVaultAttack.js
```
预言机攻击：
```bash
npx hardhat run scripts/runOracleLendingAttack.js
```

---

## 📝 免责声明

本项目仅用于教育和研究目的，不构成任何形式的法律建议或保证。使用本项目的合约进行攻击可能导致严重损失，风险由使用者自行承担。
