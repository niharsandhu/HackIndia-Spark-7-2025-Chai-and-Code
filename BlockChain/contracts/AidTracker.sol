// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AidTracker
 * @dev Tracks aid distributed to beneficiaries
 */
contract AidTracker is Ownable {
    struct AidCard {
        string beneficiaryId; // Unique identifier for the family
        string metadata;      // IPFS hash with beneficiary data
        uint256 totalReceived;
        bool isActive;
    }
    
    struct AidDistribution {
        uint256 ngoId;
        uint256 amount;
        uint256 timestamp;
        string details; // Could be IPFS hash with distribution details
    }
    
    // beneficiaryId => AidCard
    mapping(string => AidCard) public aidCards;
    
    // beneficiaryId => array of received aid distributions
    mapping(string => AidDistribution[]) public aidDistributions;
    
    event AidCardCreated(string beneficiaryId, string metadata);
    event AidDistributed(string beneficiaryId, uint256 ngoId, uint256 amount);
    
    constructor() Ownable() {}
    
    function createAidCard(string memory _beneficiaryId, string memory _metadata) external onlyOwner {
        require(bytes(aidCards[_beneficiaryId].beneficiaryId).length == 0, "Aid card already exists");
        
        aidCards[_beneficiaryId] = AidCard({
            beneficiaryId: _beneficiaryId,
            metadata: _metadata,
            totalReceived: 0,
            isActive: true
        });
        
        emit AidCardCreated(_beneficiaryId, _metadata);
    }
    
    function recordAidDistribution(
        string memory _beneficiaryId,
        uint256 _ngoId,
        uint256 _amount,
        string memory _details
    ) external onlyOwner {
        require(bytes(aidCards[_beneficiaryId].beneficiaryId).length > 0, "Aid card does not exist");
        require(aidCards[_beneficiaryId].isActive, "Aid card is not active");
        
        AidDistribution memory distribution = AidDistribution({
            ngoId: _ngoId,
            amount: _amount,
            timestamp: block.timestamp,
            details: _details
        });
        
        aidDistributions[_beneficiaryId].push(distribution);
        aidCards[_beneficiaryId].totalReceived += _amount;
        
        emit AidDistributed(_beneficiaryId, _ngoId, _amount);
    }
    
    function setAidCardStatus(string memory _beneficiaryId, bool _isActive) external onlyOwner {
        require(bytes(aidCards[_beneficiaryId].beneficiaryId).length > 0, "Aid card does not exist");
        aidCards[_beneficiaryId].isActive = _isActive;
    }
    
    function getDistributionCount(string memory _beneficiaryId) external view returns (uint256) {
        return aidDistributions[_beneficiaryId].length;
    }
    
    function getDistribution(string memory _beneficiaryId, uint256 _index) external view returns (AidDistribution memory) {
        require(_index < aidDistributions[_beneficiaryId].length, "Distribution index out of bounds");
        return aidDistributions[_beneficiaryId][_index];
    }
}
