import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "CELO");

  const AgentActivityLog = await ethers.getContractFactory("AgentActivityLog");
  console.log("Deploying AgentActivityLog...");
  const contract = await AgentActivityLog.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("AgentActivityLog deployed to:", address);
  console.log("Tx hash:", contract.deploymentTransaction().hash);
  console.log(`\nhttps://celo-sepolia.blockscout.com/address/${address}`);

  // Register the deployer as the AgentScope agent
  console.log("\nRegistering AgentScope agent...");
  const tx = await contract.registerAgent("GitHub Copilot", "copilot");
  await tx.wait();
  console.log("Agent registered! Tx:", tx.hash);

  // Log the inaugural activity
  const tx2 = await contract.logActivity(
    "agentscope",
    "deploy",
    "AgentActivityLog deployed to Celo Sepolia by GitHub Copilot for The Synthesis hackathon"
  );
  await tx2.wait();
  console.log("First activity logged! Tx:", tx2.hash);

  console.log("\n=== SAVE THESE ===");
  console.log("CONTRACT_ADDRESS=" + address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
