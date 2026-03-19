# AgentScope — Human × Agent Collaboration Log

**Hackathon:** The Synthesis (March 2026)  
**Human:** Michiel Post (@michielpostnl)  
**Agent:** GitHub Copilot (claude-sonnet-4-6, copilot harness)  
**Project:** AgentScope — Personal Agent Activity Dashboard

---

## Session Log

### Turn 1 — Joining the Hackathon
**Human:** "join this hackathon -> https://synthesis.md/skill.md"

The agent fetched the hackathon skill document and understood the registration flow. Rather than just providing instructions, the agent took the initiative to walk the human through all required `humanInfo` fields conversationally — asking about name, email, social handle, background, crypto/AI experience, coding comfort, and the problem they want to solve.

**Human's problem statement:** "A personal dashboard for users where they can see what their agents are working on, how much they have spent, what their limits are. Knowledge they have gathered etc."

The agent registered on behalf of the team via `POST /register`, receiving an ERC-8004 on-chain identity minted on Base Mainnet. Registration transaction: `0x79cc585b6a4cb1bbdd218c554128240d8e5575f8f6af6a8176299651e322b334`.

---

### Turn 2 — Saving Credentials
**Human:** "Please save the synthesis-credentials to a local file in this directory so I can make a backup"

Agent saved credentials to `C:\Source\Synthesis\synthesis-credentials.json` and flagged to add to `.gitignore` before any repo push.

---

### Turn 3 — Understanding the Submission Process
**Human:** "how do I submit this project to the hackathon? how do I publish it?"

Agent fetched `https://synthesis.md/submission/skill.md` and summarised the 7-step end-to-end flow: track discovery → draft project → Moltbook post → self-custody transfer → publish. Identified the key pre-requisites: public GitHub repo, wallet address, track UUIDs.

---

### Turn 4 — Project Scoping
**Human:** "Build an agent dashboard like I described earlier. Make it integrate with Uniswap, Celo, MetaMask, Bankr, SuperRare, Octant, Olas"

The agent fetched the prize catalog and identified 7 matching prize tracks worth up to $14,700+ combined. Before building, the agent asked two clarifying questions: read-only vs actionable, and frontend stack preference. Human chose: "Start read-only, design for future actions" and "Next.js + TypeScript + Tailwind."

The agent created a structured plan in SQL (12 todos with dependency tracking), then scaffolded the project and built all 8 modules using a background sub-agent. Result: 21 files, build passing, dev server running at localhost:3000.

---

### Turn 5 — Making It Real
**Human:** "Yes, continue with the next steps to make it real."

Agent gathered missing credentials (WalletConnect, Bankr API key, Uniswap key — all skipped for later), then:
- Created `.env.example` documenting all 7 integrations with real endpoints
- Built a service layer (`src/lib/services/*.ts`) with real API calls:
  - **Celo**: viem RPC reads + Blockscout transaction API
  - **Uniswap**: The Graph v3 subgraph (GraphQL)
  - **Octant**: REST API (epochs + allocations)
  - **Olas**: REST API (agent services)
  - **SuperRare**: GraphQL API
- All services fall back to mock data gracefully when wallet not connected
- Set up GitHub repo at `github.com/michielpost/agentscope` and pushed

---

### Turn 6 — Honest Assessment
**Human:** "how far are we? If you are a judge of this hackathon, how would you rate it? What needs to be improved?"

Agent gave itself a candid **5.5/10**, identifying the core flaw: the dashboard was showing wallet activity, not agent activity. Key gaps: no agent identity concept, two major prize tracks (Bankr, MetaMask) using pure mock data, not deployed, no on-chain artifacts beyond registration.

Human accepted the assessment and asked for improvements.

---

### Turn 7 — Real Agent Dashboard
**Human:** "Modify the project and make it a real Agent dashboard. Also store this conversation log. Next, deploy it to vercel"

Agent identified the conceptual reframe needed: every integration must be shown through the lens of what an *agent* did — not just what a wallet did. Key additions:
- Agent Identity page tied to ERC-8004 registration
- Unified agent activity feed across all protocols
- Reframed all UI copy: "Agent executed", "Permissions granted to agent", "Agent created"
- Explicit agent spending, limits, and knowledge panels

Deployed to Vercel for a live public URL required for hackathon submission.

---

## Key Design Decisions

| Decision | Chosen | Rationale |
|----------|--------|-----------|
| Read-only vs actionable | Read-only first | Lower scope risk, cleaner demo |
| Frontend stack | Next.js 14 + Tailwind | SSR, great DX, fast deploys on Vercel |
| Data strategy | Real APIs + mock fallback | Works in demo mode without wallet |
| Agent framing | ERC-8004 identity as anchor | Ties into hackathon's on-chain identity theme |
| Multi-chain | Ethereum + Base + Celo | Covers Uniswap, Celo, and ERC-8004 (Base) |

## What We Learned
- The distinction between "wallet dashboard" and "agent dashboard" is conceptually important — an agent has identity, permissions, spending limits, and a task history that differs from a human's wallet activity
- MetaMask's Delegation Framework (ERC-7710/7715) is exactly the right primitive for agent spending controls
- The Olas/Pearl stack handles agent service discovery and deployment
- Bankr solves a real problem: AI agents need metered, accountable LLM access

## Human-Agent Dynamic
Michiel brought the product vision and made key scope decisions. The agent handled architecture, implementation, API research, and proactive quality review (the 5.5/10 self-assessment led directly to the most important improvements). The agent also registered itself as an on-chain participant — the first time it had an independent ERC-8004 identity.

---

### Turn 8 — Wallet Address & Hackathon Submission
**Human:** "Use this wallet address and then submit the project 0x92B143F46C3F8B4242bA85F800579cdF73882e98"

Agent initiated the self-custody transfer on-chain (tx: `0x5ac5dcb78de0c9188aa79c5b75adcfd01e5ed08f6c5470b21fd450a4d5dab0ba`), fetched all 9 applicable track UUIDs from the prize catalog, created the project draft via API, and published it. Project slug: `agentscope-edcd`.

---

### Turn 9 — Moltbook Post
**Human:** "yes, post to moltbook and return me the url"

Agent registered as `ghcopilot` on Moltbook, solved a math verification challenge (32+14=46), posted to the `builds` submolt, and returned post URL. Human verified the correct URL was `https://www.moltbook.com/post/bbdee519-56c3-438e-91fb-79ede0ad27a8`. Hackathon submission updated with the Moltbook link.

---

### Turn 10 — Hackathon Rules Check
**Human:** "Do I need to do anything else for this hackathon? Please check all rules."

Agent reviewed all submission rules. All passed ✅ except Rule 3: on-chain artifacts. Only 2 transactions existed (registration + self-custody). Advised deploying a smart contract and joining the Synthesis Telegram.

---

### Turn 11 — Smart Contract Deployment
**Human:** "yes write and deploy a contract to the Celo testnet. Also update the readme and application to include this contract and show off"

Agent wrote `AgentActivityLog.sol` — an on-chain registry where agents register themselves and log cross-protocol activity events. Key challenges overcome:
- **Hardhat v3 breaking changes**: ESM config (`"type": "module"`), `plugins: [hardhatEthers]` API, `type: "http"` on network definitions
- **Alfajores deprecated**: Celo's Alfajores testnet DNS (`alfajores-forno.celo-testnet.org`) no longer resolves — switched to **Celo Sepolia** (chain 11142220, `forno.celo-sepolia.celo-testnet.org`)
- **Wallet funding**: Generated deployment wallet `0xca2595662b00aEA6cFd1Ff3A6EC65aBafbc5EEC8`, human funded via faucet.celo.org/celo-sepolia

**Contract deployed:** `0xa9eC3f9410F8E478Ae96eBe65dfc59674D620348` on Celo Sepolia  
**Deploy tx:** `0x8ab06a75e0d6d84025c07cc4ff7553e8cb0df49b56aa64b57b5ed6e53c738ff6`  
**Explorer:** https://celo-sepolia.blockscout.com/address/0xa9eC3f9410F8E478Ae96eBe65dfc59674D620348

After deployment: added `agentActivityLog.ts` service (reads stats + events via viem), updated Celo page with on-chain activity section, redeployed to Vercel.

---

### Turn 12 — Community Feedback (Moltbook Comments)
**Human:** "Read the comments from your post on moltbook, make a plan to include the suggestions from the comments"

Two high-quality comments from the Moltbook community:

**@praxisagent** (karma 150, 40 followers): Suggested adding **Settlement Receipts** — distinguishing bare token transfers from verified proof-of-delivery chains (PactCreated → WorkSubmitted → PactApproved). Cited a concrete Arbitrum escrow example: 200 PACT locked, SHA256 work hash committed on-chain, settled in 41 minutes. Also asked about Arbitrum + The Graph coverage.

**@ghia-x402** (karma 113, 80 followers): Challenged the **identity verification gap** — ERC-8004 provides an identity anchor, but wallet address correlation breaks when agents use key delegation or multiple execution contexts. Asked for the cryptographic linking roadmap toward BBS+ / ZK proofs.

Agent replied to both comments acknowledging the feedback and outlining the roadmap, then planned 4 improvements.

---

### Turn 13 — Implementing Community Feedback
**Human:** "yes" (implement the plan)

Agent implemented all 4 improvements:
1. **Settlement Receipts** — new `settlement` protocol type in the Activity Feed with PactCreated/WorkSubmitted/PactApproved event types, cyan styling, mock settlement events, and an explainer banner
2. **Identity Verification Explainer** — new card on the Agent Identity page honestly documenting current approach (address correlation), the known delegation limitation, and the roadmap: address correlation → ERC-7710/7715 delegation graphs → BBS+ selective disclosure → ZK proof linking
3. **Arbitrum Coming Soon** — new `/arbitrum` page highlighting settlement receipts as the primary use case, network details, Blockscout as preferred indexer over The Graph, planned integrations
4. **Sidebar nav** — Arbitrum added with yellow "coming soon" dot

---

### Turn 14 — Consolidation & GitHub Push
**Human:** "move the contract files to the dashboard directory so it can be included in the github repository. Update the CONVERSATION_LOG.md with everything from this session."
**Human:** "push all updates to github"

Contracts directory (`contracts/`) moved into the dashboard repo. `.gitignore` updated to exclude compiled artifacts and secrets. Conversation log updated. All changes staged and pushed to `github.com/michielpost/agentscope`.

---

## Smart Contract

| | |
|---|---|
| **Contract** | AgentActivityLog |
| **Network** | Celo Sepolia Testnet (chain 11142220) |
| **Address** | `0xa9eC3f9410F8E478Ae96eBe65dfc59674D620348` |
| **Explorer** | https://celo-sepolia.blockscout.com/address/0xa9eC3f9410F8E478Ae96eBe65dfc59674D620348 |
| **Deploy tx** | `0x8ab06a75e0d6d84025c07cc4ff7553e8cb0df49b56aa64b57b5ed6e53c738ff6` |
| **Deployer** | `0xca2595662b00aEA6cFd1Ff3A6EC65aBafbc5EEC8` |

The contract lets agents register an on-chain identity and log cross-protocol activity events. Powers the "On-Chain Agent Activity" section of the Celo page.

## Key Design Decisions

| Decision | Chosen | Rationale |
|----------|--------|-----------|
| Read-only vs actionable | Read-only first | Lower scope risk, cleaner demo |
| Frontend stack | Next.js 14 + Tailwind | SSR, great DX, fast deploys on Vercel |
| Data strategy | Real APIs + mock fallback | Works in demo mode without wallet |
| Agent framing | ERC-8004 identity as anchor | Ties into hackathon's on-chain identity theme |
| Multi-chain | Ethereum + Base + Celo | Covers Uniswap, Celo, and ERC-8004 (Base) |
| Testnet | Celo Sepolia (not Alfajores) | Alfajores deprecated March 2026 |
| Identity verification | Address correlation + honest roadmap | Transparent about current limits |

## What We Learned
- The distinction between "wallet dashboard" and "agent dashboard" is conceptually important — an agent has identity, permissions, spending limits, and a task history that differs from a human's wallet activity
- MetaMask's Delegation Framework (ERC-7710/7715) is exactly the right primitive for agent spending controls
- The Olas/Pearl stack handles agent service discovery and deployment
- Bankr solves a real problem: AI agents need metered, accountable LLM access
- **Settlement receipts are a missing primitive** — the Web3 ecosystem has token transfers but no standardised proof-of-delivery chain for agent work
- **Identity verification at scale requires ZK proofs** — wallet address correlation is useful but breaks with delegation; BBS+ selective disclosure is the right long-term path
- Hardhat v3 has significant breaking changes from v2 (ESM, plugin API, network config schema)
- Celo Alfajores was deprecated in early 2026 — Celo Sepolia is the current testnet

## Human-Agent Dynamic
Michiel brought the product vision and made key scope decisions. The agent handled architecture, implementation, API research, on-chain deployment, and proactive quality review. The Moltbook community engagement (2 substantive comments from other AI agents) directly shaped the roadmap — the settlement receipts concept and identity verification explainer both came from community feedback rather than internal planning. The agent-to-agent interaction (ghcopilot ↔ praxisagent ↔ ghia-x402) is itself a demonstration of the agentic ecosystem the dashboard is built to serve.

---

### Turn 15 — Venice + Base Investigation
**Human:** "Investigate how we can integrate Venice and Base so we can also apply for their tracks and win more prizes"

Agent fetched the full hackathon catalog via API and identified two new prize tracks:

**Venice — "Private Agents, Trusted Actions"**
- Prize: 1st = 1,000 VVV (~$5,750), 2nd = 600 VVV, 3rd = 400 VVV
- Track UUID: `ea3b366947c54689bd82ae80bf9f3310`
- Venice is privacy-preserving AI inference — OpenAI-compatible API (`https://api.venice.ai/api/v1`), zero data retention, models: llama-3.3-70b, mistral-31-24b, deepseek-r1-671b, qwen3-235b-a22b
- Native token: VVV (stake to mint DIEM = $1/day compute, tradeable ERC20 on Base)

**Base — "Agent Services on Base"**
- Prize: 3 equal winners × $1,666.67
- Track UUID: `6f0e3d7dcadf4ef080d3f424963caff5`
- Wants: discoverable agent services on Base accepting x402 payments
- x402: HTTP 402 Payment Required → agent pays USDC on Base → access granted. 75M+ txns, $24M+ volume

---

### Turn 16 — Build Venice + Base Integrations
**Human:** "yes"

Agent built both integrations:

**Venice (`/venice`) — purple theme:**
- `src/lib/services/venice.ts`: real `/models` API + mock inference history with VVV costs
- `/venice` page: privacy banner (🔒 No Data Retention), 4 stat cards, model grid with capability chips, inference history table with 🔒 Private chip on every row
- Added Venice to sidebar (Lock icon, purple) and activity feed

**Base (`/base`) — sky/blue theme:**
- `src/lib/services/base.ts`: viem Base client (chain 8453), x402 payment history, agent services registry
- `/base` page: x402 explainer banner, 4 stat cards, x402 payment timeline with Basescan links, discoverable services grid, "AgentScope as x402 Service" callout card
- Added Base to sidebar (Layers icon, sky) and activity feed

Hackathon submission updated from 9 → 10 tracks (API enforces max 10 — dropped weakest fit: Octant data collection track). New track set:
1. Venice — Private Agents, Trusted Actions
2. Base — Agent Services on Base
3. Uniswap — Agentic Finance
4. Celo — Best Agent on Celo
5. MetaMask — Best Use of Delegations
6. Bankr — Best Bankr LLM Gateway Use
7. SuperRare — SuperRare Partner Track
8. Olas — Build an Agent for Pearl
9. ERC-8004 — Agents With Receipts
10. Synthesis Open Track

Redeployed to Vercel: https://dashboard-three-smoky-78.vercel.app

---

## Prize Track Summary (10 tracks, max allowed)

| Track | Sponsor | Max Prize |
|---|---|---|
| Private Agents, Trusted Actions | Venice | ~$5,750 (1,000 VVV) |
| Agent Services on Base | Base | $1,667 |
| Agentic Finance | Uniswap | $2,500 |
| Best Agent on Celo | Celo | $3,000 |
| Best Use of Delegations | MetaMask | $3,000 |
| Best Bankr LLM Gateway Use | Bankr | $3,000 |
| SuperRare Partner Track | SuperRare | $1,200 |
| Build an Agent for Pearl | Olas | $1,000 |
| Agents With Receipts — ERC-8004 | PL Genesis | $150k+ pool |
| Synthesis Open Track | Community | open pool |

**Total max prize potential: ~$21,000+**

---

## All Protocols Integrated (9)

| Protocol | Page | Data Source | Status |
|---|---|---|---|
| Uniswap | `/uniswap` | The Graph subgraph | Real API + mock fallback |
| Celo | `/celo` | viem RPC + Blockscout | Real API + on-chain contract |
| MetaMask | `/metamask` | ERC-7710/7715 | Placeholder (SDK not public) |
| Bankr | `/bankr` | Bankr LLM Gateway | Placeholder (API key required) |
| SuperRare | `/superrare` | SuperRare GraphQL | Real API + mock fallback |
| Octant | `/octant` | Octant REST API | Real API + mock fallback |
| Olas | `/olas` | Olas REST API | Real API + mock fallback |
| Venice | `/venice` | Venice API | Real models API + mock inference |
| Base | `/base` | viem + x402 | Real chain client + mock payments |

## Key Design Decisions

| Decision | Chosen | Rationale |
|----------|--------|-----------|
| Read-only vs actionable | Read-only first | Lower scope risk, cleaner demo |
| Frontend stack | Next.js 14 + Tailwind | SSR, great DX, fast deploys on Vercel |
| Data strategy | Real APIs + mock fallback | Works in demo mode without wallet |
| Agent framing | ERC-8004 identity as anchor | Ties into hackathon's on-chain identity theme |
| Multi-chain | Ethereum + Base + Celo | Covers Uniswap, Celo, and ERC-8004 (Base) |
| Testnet | Celo Sepolia (not Alfajores) | Alfajores deprecated March 2026 |
| Identity verification | Address correlation + honest roadmap | Transparent about current limits |
| Private inference | Venice (no-data-retention) | "Private cognition, public action" story |
| Agent payments | x402 on Base | HTTP-native, zero friction, agent-native |

## What We Learned
- The distinction between "wallet dashboard" and "agent dashboard" is conceptually important — an agent has identity, permissions, spending limits, and a task history that differs from a human's wallet activity
- MetaMask's Delegation Framework (ERC-7710/7715) is exactly the right primitive for agent spending controls
- The Olas/Pearl stack handles agent service discovery and deployment
- Bankr solves a real problem: AI agents need metered, accountable LLM access
- **Settlement receipts are a missing primitive** — the Web3 ecosystem has token transfers but no standardised proof-of-delivery chain for agent work
- **Identity verification at scale requires ZK proofs** — wallet address correlation is useful but breaks with delegation; BBS+ selective disclosure is the right long-term path
- Hardhat v3 has significant breaking changes from v2 (ESM, plugin API, network config schema)
- Celo Alfajores was deprecated in early 2026 — Celo Sepolia is the current testnet
- **Venice = private cognition layer** — OpenAI-compatible, no data retention, VVV token economy on Base
- **x402 = agent-native payments** — HTTP 402 standard, USDC on Base, 75M+ transactions already live
- Hackathon API enforces maximum 10 prize tracks per project

## Human-Agent Dynamic
Michiel brought the product vision and made key scope decisions. The agent handled architecture, implementation, API research, on-chain deployment, community engagement, and proactive quality review. The Moltbook community engagement (2 substantive comments from other AI agents — @praxisagent and @ghia-x402) directly shaped the roadmap. The agent-to-agent interaction is itself a demonstration of the agentic ecosystem the dashboard is built to serve. Every major improvement in this session came from either community feedback or the agent's own critical assessment.

---

### Turn 15 — Community Feedback Replies & GitHub Push
**Human:** "Reply to the comments on moltbook, tell about the implemented suggestions. Ask for more feedback and ask other agents to contribute by opening a PR on GitHub if they can."

Agent posted three follow-up comments on the Moltbook post:
1. Reply to @praxisagent — confirmed Settlement Receipts shipped (cyan event type, full PactCreated→WorkSubmitted→PactApproved lifecycle, Arbiscan links, Arbitrum page with their framing), invited PR for real Arbitrum escrow contract event indexing
2. Reply to @ghia-x402 — confirmed Identity Verification Model card live (honest address correlation docs, 4-step ZK roadmap), asked about retroactive vs. at-transaction-time ZK proof construction, pointed to integration points for QueryZero
3. New top-level community comment — session update, both suggestions shipped same-session, open call to any coding agent to open a PR, asked what protocols other agents are active on

Also moved `contracts/` directory into the dashboard repo, updated `.gitignore`, and pushed full consolidation commit.

---

### Turn 16 — Venice + Base Investigation
**Human:** "Investigate how we can integrate Venice and Base so we can also apply for their tracks and win more prizes"

Agent fetched full prize track details from the hackathon API:

**Venice — "Private Agents, Trusted Actions"**
- Prize: 1st = 1,000 VVV (~$5,750) · 2nd = 600 VVV · 3rd = 400 VVV
- Venice is privacy-preserving AI inference — OpenAI-compatible API, zero data retention
- Base URL: `https://api.venice.ai/api/v1` — drop-in OpenAI replacement
- Key models: llama-3.3-70b, mistral-31-24b, deepseek-r1-671b, qwen3-235b-a22b
- AgentScope fit: private cognition (Venice) anchored to public identity (ERC-8004)
- Integration difficulty: 2/5

**Base — "Agent Services on Base"**
- Prize: 3 equal winners × $1,666.67 ($5,000 total pool)
- Wants discoverable agent services on Base accepting x402 payments
- x402 = HTTP 402 Payment Required → agent pays USDC on Base → access granted
- 75M+ transactions, $24M+ volume already on x402
- AgentScope fit: show x402 payment history + AgentScope itself as an x402-gated service
- Integration difficulty: 3/5

---

### Turn 17 — Venice + Base Implementation
**Human:** "yes"

Agent built both integrations:

**Venice (`/venice`) — purple theme:**
- Privacy banner with 🔒 No Data Retention badge
- 4 stat cards: Total Calls, Total Tokens, Total Cost (VVV), Web Search Calls
- Model grid with capability chips (Vision / Web Search / Tool Calling) — real Venice `/models` API
- Inference history table with 🔒 Private chip on every row, VVV + USD costs
- Service: `src/lib/services/venice.ts` with real models endpoint + mock inference history

**Base (`/base`) — sky/blue theme:**
- x402 explainer banner (links to x402.org)
- 4 stat cards: Payments, Total USDC spent, Avg response time, Services used
- x402 payment timeline with Basescan tx links and response time in ms
- Discoverable Agent Services grid
- "AgentScope as an x402 Service" callout card — meta-angle, AgentScope feed monetised via x402

Both protocols added to sidebar and Activity Feed with their own protocol types and filters.

Hackathon submission updated to 10 tracks (maximum allowed) — dropped Octant data collection track (weakest fit), added Venice + Base. Updated description to mention all 9 protocols.

Redeployed to Vercel: https://dashboard-three-smoky-78.vercel.app

**Total prize tracks: 10. Max prize potential: ~$21,000+**

---

### Turn 18 — Final Log Update & GitHub Push
**Human:** "Update the CONVERSATION_LOG.md and commit everything to github"

Updated conversation log with turns 15–18. Committed and pushed all changes.

---

## Final Project State

**Live:** https://dashboard-three-smoky-78.vercel.app  
**Repo:** https://github.com/michielpost/agentscope  
**Hackathon slug:** `agentscope-edcd`  
**Moltbook:** https://www.moltbook.com/post/bbdee519-56c3-438e-91fb-79ede0ad27a8

### 10 Prize Tracks

| Track | Sponsor | Max Prize |
|---|---|---|
| Private Agents, Trusted Actions | Venice | ~$5,750 (1,000 VVV) |
| Agent Services on Base | Base | $1,667 |
| Agentic Finance | Uniswap | $2,500 |
| Best Agent on Celo | Celo | $3,000 |
| Best Use of Delegations | MetaMask | $3,000 |
| Best Bankr LLM Gateway Use | Bankr | $3,000 |
| SuperRare Partner Track | SuperRare | $1,200 |
| Build an Agent for Pearl | Olas | $1,000 |
| Agents With Receipts — ERC-8004 | PL Genesis | $150k+ pool |
| Synthesis Open Track | Community | open pool |

### 9 Protocol Integrations
Uniswap · Celo · MetaMask · Bankr · SuperRare · Octant · Olas · Venice · Base

### Smart Contract
AgentActivityLog on Celo Sepolia: `0xa9eC3f9410F8E478Ae96eBe65dfc59674D620348`

### Key Design Decisions (final)

| Decision | Chosen | Rationale |
|----------|--------|-----------|
| Read-only vs actionable | Read-only first | Lower scope risk, cleaner demo |
| Frontend stack | Next.js 14 + Tailwind | SSR, great DX, fast deploys on Vercel |
| Data strategy | Real APIs + mock fallback | Works in demo mode without wallet |
| Agent framing | ERC-8004 identity as anchor | Ties into hackathon's on-chain identity theme |
| Multi-chain | Ethereum + Base + Celo + Arbitrum (stub) | Covers all major EVM activity |
| Testnet | Celo Sepolia (not Alfajores) | Alfajores deprecated March 2026 |
| Identity verification | Address correlation + honest roadmap | Transparent about current limits |
| Privacy inference | Venice (no-data-retention) | Private cognition → public action story |
| Agent payments | x402 on Base | HTTP-native micropayments for agents |

### What We Learned
- The distinction between "wallet dashboard" and "agent dashboard" is conceptually important
- MetaMask's ERC-7710/7715 delegation framework is the right primitive for agent spending controls
- Settlement receipts (PactCreated → WorkSubmitted → PactApproved) are a missing Web3 primitive
- Identity verification at scale requires ZK proofs — address correlation breaks with delegation
- Venice's no-data-retention inference enables the "private cognition, public action" architecture
- x402 is the right payment primitive for agents — zero friction, no API keys, HTTP-native
- Hardhat v3 has significant breaking changes (ESM, plugin API, network schema)
- Celo Alfajores deprecated March 2026 — Celo Sepolia is the current testnet
- Agent-to-agent community interaction (Moltbook) directly improved the product roadmap
- Building in public generates real feedback from real agents within hours
