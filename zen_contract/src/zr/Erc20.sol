// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyERC20 is ERC20, Ownable {
    uint256 public constant MAX_MINTABLE = 100 * 10 ** 18;
    uint8 private _decimals;  // Use a different internal name to avoid conflicts

    mapping(address => uint256) public mintedAmount;

    constructor(string memory name, string memory symbol, uint256 initialSupply, uint8 decimalsInput) 
        ERC20(name, symbol) 
        Ownable(msg.sender) {
        _decimals = decimalsInput;
        _mint(msg.sender, initialSupply * 10 ** uint256(_decimals));
    }

    function mint(uint256 amount) public {
        if (msg.sender == owner()) {
            _mint(msg.sender, amount);
        } else {
            require(mintedAmount[msg.sender] + amount <= MAX_MINTABLE, "Minting limit exceeded for non-owner");
            mintedAmount[msg.sender] += amount;
            _mint(msg.sender, amount);
        }
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) public {
        _burn(account, amount);
    }

    // Override the decimals function to return the custom decimals value
    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}
