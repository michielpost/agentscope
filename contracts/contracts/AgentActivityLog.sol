// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title AgentActivityLog
/// @notice On-chain activity registry for AI agents. Agents register themselves
///         and log actions across Web3 protocols. Powers the AgentScope dashboard.
/// @dev Deployed on Celo Sepolia testnet (chain 11142220) for The Synthesis hackathon.
///      Contract: 0xa9eC3f9410F8E478Ae96eBe65dfc59674D620348
contract AgentActivityLog {

    struct Activity {
        string protocol;   // e.g. "uniswap", "celo", "superrare"
        string action;     // e.g. "swap", "transfer", "mint"
        string detail;     // e.g. "2500 USDC → 0.98 ETH"
        uint256 timestamp;
    }

    struct AgentInfo {
        string name;
        string agentType;  // e.g. "copilot", "custom", "olas-service"
        bool registered;
        uint256 registeredAt;
        uint256 activityCount;
    }

    mapping(address => AgentInfo) public agents;
    mapping(address => Activity[]) private _activities;
    address[] public agentList;

    event AgentRegistered(
        address indexed agent,
        string name,
        string agentType,
        uint256 timestamp
    );

    event ActivityLogged(
        address indexed agent,
        string protocol,
        string action,
        string detail,
        uint256 timestamp
    );

    // ─── Registration ────────────────────────────────────────────────────────

    /// @notice Register as an agent. Each address can only register once.
    function registerAgent(string calldata name, string calldata agentType) external {
        require(!agents[msg.sender].registered, "AgentActivityLog: already registered");
        require(bytes(name).length > 0, "AgentActivityLog: name required");

        agents[msg.sender] = AgentInfo({
            name: name,
            agentType: agentType,
            registered: true,
            registeredAt: block.timestamp,
            activityCount: 0
        });
        agentList.push(msg.sender);

        emit AgentRegistered(msg.sender, name, agentType, block.timestamp);
    }

    // ─── Activity Logging ────────────────────────────────────────────────────

    /// @notice Log an agent action. Caller must be registered.
    function logActivity(
        string calldata protocol,
        string calldata action,
        string calldata detail
    ) external {
        require(agents[msg.sender].registered, "AgentActivityLog: not registered");
        require(bytes(protocol).length > 0, "AgentActivityLog: protocol required");
        require(bytes(action).length > 0, "AgentActivityLog: action required");

        _activities[msg.sender].push(Activity({
            protocol: protocol,
            action: action,
            detail: detail,
            timestamp: block.timestamp
        }));
        agents[msg.sender].activityCount++;

        emit ActivityLogged(msg.sender, protocol, action, detail, block.timestamp);
    }

    // ─── Views ───────────────────────────────────────────────────────────────

    /// @notice Get all activities for an agent.
    function getActivities(address agent) external view returns (Activity[] memory) {
        return _activities[agent];
    }

    /// @notice Get the last N activities for an agent.
    function getRecentActivities(address agent, uint256 count)
        external
        view
        returns (Activity[] memory)
    {
        Activity[] storage all = _activities[agent];
        uint256 total = all.length;
        uint256 resultCount = count > total ? total : count;
        Activity[] memory result = new Activity[](resultCount);
        for (uint256 i = 0; i < resultCount; i++) {
            result[i] = all[total - resultCount + i];
        }
        return result;
    }

    /// @notice Total number of registered agents.
    function getAgentCount() external view returns (uint256) {
        return agentList.length;
    }

    /// @notice Check if an address is registered.
    function isRegistered(address agent) external view returns (bool) {
        return agents[agent].registered;
    }
}
