# 🌍 ReliefChain

**A Decentralized Disaster Relief Platform Built on Blockchain**

ReliefChain is a transparent, efficient, and tamper-proof donation system designed to help donors, verified NGOs, and affected families during natural disasters. Using Ethereum smart contracts, USDC/ETH donations, PoA cards, and QR-based tracking, ReliefChain ensures that every rupee/USDC donated reaches those who need it — with full visibility.

---

## 🚨 Problem Statement

Disaster relief efforts are often delayed, opaque, and mismanaged. Donors lack visibility, funds are often diverted or misused, and families struggle to access aid. ReliefChain solves this using blockchain transparency, decentralized access, and real-time verification.

---

## 🎯 Objective

To provide a blockchain-powered platform where donors can:
- Directly support specific disaster-hit regions
- Trust that their contributions are used properly
- Track the delivery of aid to affected families via QR-based PoA cards

---

## 🚀 Features

- **Targeted Donations:** Donate ETH or USDC to specific disasters (e.g., floods in Bihar)
- **Verified NGOs:** Only approved NGOs can raise aid requests and receive funds
- **Real-Time Fund Allocation:** Aid requirements are posted by NGOs; donation amounts update live
- **QR-Based PoA Cards:** Families receive QR codes; scanned to mark aid as “received”
- **Smart Contract Driven:** Donations, aid logs, and fund allocation are fully on-chain
- **Public Transparency:** Donors can track their impact on-chain and through the UI
- **Aid Dashboard:** Visual overview of aid progress, pending needs, and delivered relief

---

## 🧠 Tech Stack

| Layer          | Tech                                |
|----------------|-------------------------------------|
| 💻 Frontend     | Next.js, React, Tailwind CSS         |
| ⚙️ Backend      | Node.js, Express.js, MongoDB (optional) |
| 🔗 Blockchain   | Ethereum, Solidity, Thirdweb SDK     |
| 🪙 Tokens       | ETH, USDC (ERC-20)                   |
| 👛 Wallets      | MetaMask, WalletConnect (via Thirdweb) |
| 📦 Storage      | IPFS (PoA Cards) + MongoDB (optional off-chain logging) |

---

## 🔄 Workflow

1. **NGO registers a disaster** with aid requirements (food packs, tents, etc.)
2. **Donors view the disaster** and send ETH or USDC using their wallet
3. **Funds are recorded on-chain**, deducted from total need
4. **Aid is distributed**, and NGO scans family’s QR PoA Card
5. **Aid status updates** from “Pending” to “Received”
6. **Donors track their donation** and verify its impact

---

## 🛠️ How to Run the Project

### Prerequisites:
- Node.js & npm
- MetaMask (testnet setup)


### 1. Clone the repo
https://github.com/niharsandhu/HackIndia-Spark-7-2025-Chai-and-Code

