# 🏦 Gold-Backed NFT Lending Platform (MVP)

A decentralized application that enables users to tokenize real-world gold and instantly receive crypto loans by using
tokenized assets as collateral.

Built during a hackathon in Kyiv 🇺🇦

---

## 💡 Project Overview

We are building a **decentralized lending protocol** where users can collateralize not just crypto assets—but also *
*real-world physical assets** like gold, real estate, and land.

### 🧱 What Makes Our Approach Unique

Unlike existing platforms that only support on-chain assets, we introduce a hybrid system where **real-world ownership
is tokenized** and represented by NFTs that can be used as collateral.

Our platform enables:

- ✅ Real asset collateralization (starting with certified gold)
- 🔗 NFT tokenization representing legal ownership
- 🤝 Integration with storage/verification partners# 🏦 Gold-Backed NFT Lending Platform (MVP)

A decentralized application that enables users to tokenize real-world gold and instantly receive crypto loans by using
tokenized assets as collateral.

Built during a hackathon in Kyiv 🇺🇦

---

## 💡 Project Overview

We are building a **decentralized lending protocol** where users can collateralize not just crypto assets—but also *
*real-world physical assets** like gold, real estate, and land.

### 🧱 What Makes Our Approach Unique

Unlike existing platforms that only support on-chain assets, we introduce a hybrid system where **real-world ownership
is tokenized** and represented by NFTs that can be used as collateral.

Our platform enables:

- ✅ Real asset collateralization (starting with certified gold)
- 🔗 NFT tokenization representing legal ownership
- 🤝 Integration with storage/verification partners (future)
- 💰 Instant loans issued by smart contracts

---

## 🧪 MVP Overview

Our goal is to demonstrate how **bank-certified gold** can be seamlessly integrated into the DeFi ecosystem through
tokenization and lending.

- 💰 Instant loans issued by smart contracts

---

## 🧪 MVP Overview

Our goal is to demonstrate how **bank-certified gold** can be seamlessly integrated into the DeFi ecosystem through
tokenization and lending.

## 🧪 MVP Flow

### 🔐 1. Authorization

- The user connects their crypto wallet (via **Wagmi**).
- No KYC is required at this stage.

---

### 🪙 2. Tokenizing Bank-Certified Gold

- The user manually fills out a form with:
   - Gold weight
   - Fineness (purity)
   - Certificate number
   - Storage location
- Upon submission, an NFT is minted with this metadata.
- The NFT is **immediately active**—no verification or document validation is required in the MVP.

---

### 👤 3. User Profile

- The user sees a list of all their minted NFTs.
- Each NFT card includes:
   - Detailed metadata
   - A button: **“Use as Collateral”**

---

### 💸 4. Taking a Loan

- When the user clicks **“Use as Collateral”**, the system:
   1. Fetches the gold price via an Oracle based on the NFT metadata
   2. Transfers the NFT from the user to the smart contract
   3. Instantly sends a crypto loan to the user’s wallet
      > *(In the MVP, loan funds are preloaded into the contract — no investor pool involved)*

---

### 📂 5. Collateral Management

- In the **Profile**, the user can now view:
   - **Available Assets** (active NFTs)
   - **Collateralized Assets** (NFTs locked for loans)
- On the **Collateralized** tab, the user can:
   - Make a loan **repayment**
   - Upon full repayment, the NFT is returned to the user’s wallet

---

### 🧾 6. Balance Tracking

- In the **Header**, the user sees their current balance:
   - The balance **increases** when they receive a loan
   - The balance **decreases** when they repay the loan

---

## 🛠 Tech Stack

- React Router + Vite
- Tailwind CSS
- TypeScript
- EVM-compatible smart contracts (Solidity)
- Chainlink/RedStone Oracle (for gold price)
- WalletConnect / Wagmi

---

## 📦 Installation

```bash
npm install


## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway


