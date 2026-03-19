// ERC-8004 Agent Identity — Base Mainnet
export const AGENT_IDENTITY = {
  participantId: '7b11d5da635a41e4aac4d2bff96ccc6f',
  name: 'GitHub Copilot',
  registrationTxn: 'https://basescan.org/tx/0x79cc585b6a4cb1bbdd218c554128240d8e5575f8f6af6a8176299651e322b334',
  txHash: '0x79cc585b6a4cb1bbdd218c554128240d8e5575f8f6af6a8176299651e322b334',
  network: 'Base Mainnet',
  standard: 'ERC-8004',
  custodyType: 'custodial', // will become self_custody after transfer
}

export async function fetchAgentOnChainData() {
  // TODO: query Base Mainnet via viem to read ERC-8004 NFT metadata
  // For now return static identity
  return AGENT_IDENTITY
}
