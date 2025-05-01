// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DonationVault
 * @dev Main contract that receives donations and distributes to NGOs
 */
contract DonationVault is Ownable, ReentrancyGuard {

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        bytes32 transactionHash; // Add transactionHash to match backend
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

    event DonationReceived(address indexed donor, uint256 amount, uint256 donationId, bytes32 transactionHash);
    event FundsSentToNGO(uint256 indexed ngoId, address ngoWallet, uint256 amount, uint256 fundingId);
    event FundsReturnedFromNGO(uint256 indexed ngoId, uint256 amount, uint256 fundingId);

    constructor() Ownable() {}

    // Function to receive ETH donations
    receive() external payable {
        _recordDonation(msg.sender, msg.value, keccak256(abi.encodePacked(msg.sender, msg.value, block.timestamp)));
    }

    // Explicit donation function
    function donateFor(address donor) external payable {
        _recordDonation(donor, msg.value, keccak256(abi.encodePacked(donor, msg.value, block.timestamp)));
    }

    function _recordDonation(address _donor, uint256 _amount, bytes32 _transactionHash) internal {
        uint256 donationId = donations.length;

        donations.push(Donation({
            donor: _donor,
            amount: _amount,
            timestamp: block.timestamp,
            transactionHash: _transactionHash
        }));

        totalDonated += _amount;
        emit DonationReceived(_donor, _amount, donationId, _transactionHash);
    }

    // Send funds to an NGO in need
    function fundNGO(uint256 _ngoId, uint256 _amount, address _ngoWallet) external onlyOwner nonReentrant {
        require(_amount <= address(this).balance, "Insufficient balance");

        uint256 fundingId = fundings.length;

        fundings.push(NGOFunding({
            ngoId: _ngoId,
            amount: _amount,
            timestamp: block.timestamp,
            returned: 0
        }));

        totalDistributed += _amount;

        // Transfer funds to NGO
        (bool sent, ) = payable(_ngoWallet).call{value: _amount}("");
        require(sent, "Failed to send funds to NGO");

        emit FundsSentToNGO(_ngoId, _ngoWallet, _amount, fundingId);
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
}
