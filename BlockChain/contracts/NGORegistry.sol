// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NGORegistry
 * @dev Manages the registration and status of NGOs
 */
contract NGORegistry is Ownable {
    struct NGO {
        address wallet;
        string name;
        string metadata; // IPFS hash for additional NGO data
        bool isApproved;
        bool needsFunding;
    }
    
    // Mapping from NGO ID to NGO data
    mapping(uint256 => NGO) public ngos;
    uint256 public ngoCount;
    
    event NGORegistered(uint256 indexed ngoId, address wallet, string name);
    event NGOStatusChanged(uint256 indexed ngoId, bool isApproved, bool needsFunding);
    
    constructor() Ownable() {}
    
    function registerNGO(address _wallet, string memory _name, string memory _metadata) external onlyOwner {
        uint256 ngoId = ngoCount;
        ngos[ngoId] = NGO({
            wallet: _wallet,
            name: _name,
            metadata: _metadata,
            isApproved: true,
            needsFunding: false
        });
        
        ngoCount++;
        emit NGORegistered(ngoId, _wallet, _name);
    }
    
    function updateNGOStatus(uint256 _ngoId, bool _isApproved, bool _needsFunding) external onlyOwner {
        require(_ngoId < ngoCount, "NGO does not exist");
        
        NGO storage ngo = ngos[_ngoId];
        ngo.isApproved = _isApproved;
        ngo.needsFunding = _needsFunding;
        
        emit NGOStatusChanged(_ngoId, _isApproved, _needsFunding);
    }
    
    function updateNGOWallet(uint256 _ngoId, address _newWallet) external onlyOwner {
        require(_ngoId < ngoCount, "NGO does not exist");
        ngos[_ngoId].wallet = _newWallet;
    }
    
    function getNGOsInNeed() external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count the NGOs in need
        for (uint256 i = 0; i < ngoCount; i++) {
            if (ngos[i].isApproved && ngos[i].needsFunding) {
                count++;
            }
        }
        
        // Create an array with the correct length
        uint256[] memory ngoIds = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < ngoCount; i++) {
            if (ngos[i].isApproved && ngos[i].needsFunding) {
                ngoIds[index] = i;
                index++;
            }
        }
        
        return ngoIds;
    }
}
