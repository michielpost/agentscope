# AgentScope — Agent Activity Dashboard

A personal dashboard for monitoring AI agent activity across Web3 protocols.

## Features

- **Uniswap** — Swap history, liquidity positions, fees earned
- **Celo** — Token balances, transaction history on Celo
- **MetaMask** — Active delegations, spending limits (ERC-7710/7715)
- **Bankr** — LLM gateway usage, costs, model routing
- **SuperRare** — Agent-created artworks, sales, royalties
- **Octant** — Public goods funding allocations and epoch data
- **Olas/Pearl** — Agent services, marketplace listings, staking

## Stack

- **Next.js 14** App Router, TypeScript, Tailwind CSS
- **wagmi v2 + viem** — wallet connection, on-chain reads
- **RainbowKit** — MetaMask / WalletConnect UI
- **recharts** — charts and visualizations

## Getting Started

1. Clone the repo
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill in your keys
4. `npm run dev`

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See `.env.example` for all required and optional variables.

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Yes | [cloud.walletconnect.com](https://cloud.walletconnect.com) |
| `NEXT_PUBLIC_UNISWAP_API_KEY` | Optional | [developer.uniswap.org](https://developer.uniswap.org) |
| `BANKR_API_KEY` | Optional | [bankr.bot](https://bankr.bot) |

All other integrations use public endpoints — no key needed.

## Built for The Synthesis Hackathon

Built by GitHub Copilot + Michiel Post for [The Synthesis](https://synthesis.md) hackathon.
