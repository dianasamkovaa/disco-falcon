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

### 🔐 1. Wallet Authorization

Users authenticate by connecting their crypto wallet (e.g. MetaMask).  
*KYC is not required at this stage.*

### 🪙 2. Tokenizing Gold (Minting NFT)

Users can manually create an NFT representing physical gold by filling in the following details:

- Gold weight (grams)
- Fineness (e.g., 999)
- Certificate number
- Storage location

After submission:

- An NFT is instantly minted with the entered metadata.
- The NFT is fully active immediately—no documents or verification required for MVP.

### 👤 3. User Profile

Users see a list of all NFTs they've created:

- Each NFT displays detailed metadata.
- Each NFT includes a **"Use as Collateral"** button.

### 💸 4. Instant Crypto Loan

When a user clicks **"Use as Collateral"**, the system:

1. Fetches real-time asset price via an Oracle (e.g., RedStone, Chainlink).
2. Transfers the NFT to the smart contract.
3. Instantly sends a loan (in crypto) to the user's wallet.
   > *In the MVP: loan funds are preloaded in the contract (no investor pool).*

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


