// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./AidTracker.sol";
import "./NGORegistry.sol";

/**
 * @title DonationVault
 * @dev Main contract that receives donations and distributes to NGOs
 */
contract DonationVault is Ownable, ReentrancyGuard {
    NGORegistry public ngoRegistry;
    AidTracker public aidTracker;
    
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }
    
    struct NGOFunding {
        uint256 ngoId;
        uint256 amount;
        uint256 timestamp;
        uint256 returned; // Amount returned if unused
    }
    
    Donation[] public donations;
    NGOFunding[] public fundings;
    
    // ETH donation stats
    uint256 public totalDonated;
    uint256 public totalDistributed;
    uint256 public totalReturned;
    
    event DonationReceived(address indexed donor, uint256 amount, uint256 donationId);
    event FundsSentToNGO(uint256 indexed ngoId, address ngoWallet, uint256 amount, uint256 fundingId);
    event FundsReturnedFromNGO(uint256 indexed ngoId, uint256 amount, uint256 fundingId);
    
    constructor(address _ngoRegistry, address _aidTracker) Ownable() {
        ngoRegistry = NGORegistry(_ngoRegistry);
        aidTracker = AidTracker(_aidTracker);
    }
    
    // Function to receive ETH donations
    receive() external payable {
        _recordDonation(msg.sender, msg.value);
    }
    
    // Explicit donation function
    function donate() external payable {
        _recordDonation(msg.sender, msg.value);
    }
    
    function _recordDonation(address _donor, uint256 _amount) internal {
        uint256 donationId = donations.length;
        
        donations.push(Donation({
            donor: _donor,
            amount: _amount,
            timestamp: block.timestamp
        }));
        
        totalDonated += _amount;
        emit DonationReceived(_donor, _amount, donationId);
    }
    
    // Send funds to an NGO in need
    function fundNGO(uint256 _ngoId, uint256 _amount) external onlyOwner nonReentrant {
        require(_amount <= address(this).balance, "Insufficient balance");
        
        (address ngoWallet, bool isApproved, bool needsFunding) = _getNGODetails(_ngoId);
        
        require(isApproved, "NGO is not approved");
        require(needsFunding, "NGO does not need funding");
        
        uint256 fundingId = fundings.length;
        
        fundings.push(NGOFunding({
            ngoId: _ngoId,
            amount: _amount,
            timestamp: block.timestamp,
            returned: 0
        }));
        
        totalDistributed += _amount;
        
        // Transfer funds to NGO
        (bool sent, ) = payable(ngoWallet).call{value: _amount}("");
        require(sent, "Failed to send funds to NGO");
        
        emit FundsSentToNGO(_ngoId, ngoWallet, _amount, fundingId);
    }
    
    // Record returned funds from NGO
    function recordReturnedFunds(uint256 _fundingId, uint256 _amount) external payable onlyOwner {
        require(_fundingId < fundings.length, "Funding ID does not exist");
        require(_amount <= msg.value, "Insufficient returned funds");
        
        NGOFunding storage funding = fundings[_fundingId];
        require(_amount <= funding.amount - funding.returned, "Amount exceeds what can be returned");
        
        funding.returned += _amount;
        totalReturned += _amount;
        
        emit FundsReturnedFromNGO(funding.ngoId, _amount, _fundingId);
    }
    
    // Get detailed information about an NGO from the registry
    function _getNGODetails(uint256 _ngoId) internal view returns (address wallet, bool isApproved, bool needsFunding) {
        (wallet, , , isApproved, needsFunding) = ngoRegistry.ngos(_ngoId);
    }
    
    // Update registry or tracker address (in case of upgrades)
    function setNGORegistry(address _ngoRegistry) external onlyOwner {
        ngoRegistry = NGORegistry(_ngoRegistry);
    }
    
    function setAidTracker(address _aidTracker) external onlyOwner {
        aidTracker = AidTracker(_aidTracker);
    }
    
    // Get stats about the donations and distributions
    function getStats() external view returns (uint256 balance, uint256 donated, uint256 distributed, uint256 returned) {
        return (
            address(this).balance,
            totalDonated,
            totalDistributed,
            totalReturned
        );
    }
    
    // Emergency withdrawal in case of critical issues
    function emergencyWithdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool sent, ) = payable(owner()).call{value: balance}("");
        require(sent, "Failed to send funds");
    }
}
