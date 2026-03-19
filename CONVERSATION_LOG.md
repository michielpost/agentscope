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
