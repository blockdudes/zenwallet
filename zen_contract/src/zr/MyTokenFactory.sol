// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ERC20.sol";

contract MyTokenFactory {
    event Deployed(address addr, uint256 salt);

    function deployMyToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 decimals,
        uint256 salt
    ) public {
        // Construct the initialization bytecode
        bytes memory bytecode = abi.encodePacked(
            type(MyERC20).creationCode,
            abi.encode(name, symbol, initialSupply, decimals)
        );

        bytes32 finalSalt = keccak256(abi.encodePacked(msg.sender, salt));

        address tokenAddress;

        assembly {
            tokenAddress := create2(0, add(bytecode, 32), mload(bytecode), finalSalt)
        }

        require(tokenAddress != address(0), "Failed to deploy contract");

        emit Deployed(tokenAddress, salt);
    }

    function computeAddress(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 decimals,
        uint256 salt
    ) public view returns (address) {
        // Construct the initialization bytecode
        bytes memory bytecode = abi.encodePacked(
            type(MyERC20).creationCode,
            abi.encode(name, symbol, initialSupply, decimals)
        );
        
        bytes32 finalSalt = keccak256(abi.encodePacked(msg.sender, salt));

        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                finalSalt,
                keccak256(bytecode)
            )
        );

        return address(uint160(uint256(hash)));
    }
}
