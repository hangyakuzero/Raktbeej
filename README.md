# Raktbeej

Raktbeej is a decentralized science platform where researchers can upload papers, define royalty splits with collaborators, and receive donations that are distributed automatically on-chain.

The idea is simple: if research is collaborative, payouts should be collaborative too, and everyone should be able to verify how money is split.

## Table of Contents

- [What is Raktbeej?](#what-is-raktbeej)
- [What Problem It Solves](#what-problem-it-solves)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Guide](#setup-guide)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Running the App](#running-the-app)
- [Feature Walkthrough](#feature-walkthrough)
- [Contributing](#contributing)

## What is Raktbeej?

Raktbeej is a DeSci project built for fair research royalties.

When a paper is uploaded, the authors can define wallet addresses and percentage splits. Later, when someone donates, the smart contract routes funds to each collaborator according to those predefined splits.

## What Problem It Solves

Most publishing and funding systems are not transparent about how revenue is shared.

Raktbeej addresses three common issues:

- Open-access work usually has no direct payout system.
- Royalty distribution between collaborators is often manual and unclear.
- Donors cannot easily verify whether contributors were paid fairly.

## How It Works

```text
Author uploads paper
    -> PDF stored on IPFS via Pinata
    -> Paper metadata and royalty splits saved in Neon Postgres
    -> Donor sends funds to Polygon Amoy contract
    -> Contract distributes funds to author wallets based on saved splits
```

Why this approach works:

- Metadata stays off-chain, so authors avoid unnecessary gas costs.
- Files are not tied to a single centralized server.
- Donation distribution is verifiable on-chain.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| UI Components | shadcn/ui |
| Auth | Clerk |
| Database | Neon PostgreSQL via Drizzle ORM |
| File Storage | Pinata (IPFS) |
| Smart Contract | Solidity, Hardhat |
| Blockchain Network | Polygon Amoy Testnet |
| Deployment | Vercel |

## Project Structure

```text
Raktbeej/
|- app/                    # Next.js App Router pages and API routes
|- components/             # Shared UI components
|- contracts/              # Solidity smart contracts
|- drizzle/                # Drizzle migrations and schema metadata
|- lib/                    # Utility libraries (db, pinata, etc.)
|- scripts/                # Hardhat deployment scripts
|- utils/                  # Shared helper functions
|- artifacts/              # Hardhat compiled contract artifacts
|- public/                 # Static assets
|- drizzle.config.ts       # Drizzle config
|- hardhat.config.js       # Hardhat network config
|- middleware.ts           # Clerk auth middleware
`- next.config.ts          # Next.js config
```

## Prerequisites

Before starting, make sure you have:

- Node.js v18+ and npm
- A Neon account (PostgreSQL)
- A Pinata account (IPFS uploads)
- A Clerk account (authentication)
- MetaMask or another EVM wallet
- Polygon Amoy testnet POL from the Polygon faucet

## Setup Guide

### 1. Clone the repo

```bash
git clone https://github.com/hangyakuzero/Raktbeej.git
cd Raktbeej
```

### 2. Install dependencies

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Neon PostgreSQL
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# Pinata
PINATA_JWT=eyJhbGci...
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud

# Smart Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
PRIVATE_KEY=your_wallet_private_key
```

Do not commit `.env.local`.

## Database Setup

Push schema:

```bash
npx drizzle-kit push
```

Generate and run migrations if schema changes:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Open Drizzle Studio:

```bash
npx drizzle-kit studio
```

## Smart Contract Deployment

Contract file: `contracts/Donate.sol`

### 1. Configure Hardhat

Ensure `hardhat.config.js` has Polygon Amoy configured and `PRIVATE_KEY` is set in `.env.local`.

### 2. Compile

```bash
npx hardhat compile
```

### 3. Deploy to Amoy

```bash
npx hardhat run scripts/deploy.js --network amoy
```

After deployment, copy the contract address into `NEXT_PUBLIC_CONTRACT_ADDRESS`.

### 4. Verify (optional)

```bash
npx hardhat verify --network amoy <CONTRACT_ADDRESS>
```

## Running the App

Development:

```bash
npm run dev
```

App URL: http://localhost:3000

Production:

```bash
npm run build
npm start
```

Lint:

```bash
npm run lint
```

## Feature Walkthrough

### 1. Sign up / Sign in

Visit `/sign-up` and create an account through Clerk.

### 2. Browse papers

Visit `/papers` to view uploaded papers and donation options.

### 3. Upload a paper

Authenticated authors can:

1. Upload a PDF to IPFS via Pinata.
2. Add collaborator wallet addresses.
3. Define royalty splits that add up to 100%.
4. Save metadata and splits to Neon.

### 4. Donate

1. Connect wallet on Polygon Amoy.
2. Choose a paper and donation amount.
3. Confirm transaction.
4. Contract distributes funds to all listed wallets.

### 5. About page

Visit `/About` to learn the project background and motivation.

## Contributing

Contributions are welcome.

```bash
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

Then open a pull request with a short summary of what changed and why.

## Roadmap

- Better on-chain accounting to reduce donation gas overhead
- Improved author attribution workflow
- Mainnet deployment after more testing
- DAO-based governance
- Multi-chain support

## Acknowledgements

- Pinata and IPFS for decentralized file storage
- Neon for serverless PostgreSQL
- Polygon for EVM-compatible low-cost transactions
- The DeSci community

<div className="text-sm" style={{ textAlign: "center" }}>Built by a Indian who wants research to stay open and contributors to be paid fairly.</div>