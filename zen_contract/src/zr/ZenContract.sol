// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Lib_RLPWriter} from "./libraries/Lib_RLPWriter.sol";
import {SignTypes} from "./libraries/SignTypes.sol";
import {IZrSign} from "./interfaces/IZrSign.sol";
// import {ZrSignFaucetTypes} from "./libraries/ZrSignFaucetTypes.sol";
// import {ZrSignConnect} from "./zrSignConnect.sol";
// import "./ZrContract/ZrSign(implementation)/contracts/interfaces/zr/ISign.sol";
// import "./ZrContract/ZrSign(implementation)/contracts/interfaces/zr/IZrSign.sol";
import "v2-periphery/interfaces/IUniswapV2Router01.sol";
import "v2-core/interfaces/IERC20.sol";
import "../aaveV3/IPool.sol";

contract zrSignCrossChainFaucetApp  {
    using Lib_RLPWriter for uint256;
    using Lib_RLPWriter for address;
    using Lib_RLPWriter for bytes;
    using Lib_RLPWriter for bytes[];
    using SignTypes for SignTypes.SimpleTx;

    // Custom errors
    error WalletAlreadyRegistered();
    error WalletNotExists();
    error ChainNotSupported();

    bytes32 internal constant EVMWalletType =
        0xe146c2986893c43af5ff396310220be92058fb9f4ce76b929b80ef0d5307100a;

    bytes32 internal constant sepoliaChainId =
        0xafa90c317deacd3d68f330a30f96e4fa7736e35e8d1426b2e1b2c04bce1c2fb7;

    bytes32 internal constant amoyChainId =
        0x4df3b2a1df4e086e001def1ba6466078aa6aaf12e7a183f590364b811b18ee5b;

    struct Wallet {
        string walletAddress;
        uint256 walletIndex;
    }
    modifier isWalletExists() {
        require(isWalletCreated[msg.sender], "Wallet does not exist");
        _;
    }


    constructor(address _zrSignAddress, address _uniswapRouterAddress, address _aavePoolAddress) {
        signContract = IZrSign(_zrSignAddress);
        uniswapRouter = IUniswapV2Router01(_uniswapRouterAddress);
        aavePool = IPool(_aavePoolAddress);
    }

    // State variables
    IZrSign public signContract;
    IUniswapV2Router01 public uniswapRouter;
    IPool public aavePool;
    mapping(address => Wallet) public userMultisupportWallet;
    mapping(address => bool) public isWalletCreated;
    mapping(uint256 => bool) public isChainSupported;
    uint256 public walletIndex = 0;



    receive() external payable {}

    // function getSepoliaEth() external payable {
    //     _submitTransaction(sepoliaChainId, msg.sender, msg.value);
    // }

    // function getAmoyMatic() external payable {
    //     _submitTransaction(amoyChainId, msg.sender, msg.value);
    // }

    // function _submitTransaction(
    //     bytes32 dstChain,
    //     address to,
    //     uint256 value
    // ) internal {
    //     ZrSignFaucetTypes.GasParams memory gasParams = _gasParams[dstChain];
    //     bytes memory data = rlpEncodeData(abi.encodePacked(block.chainid));
    //     (uint256 mpcFee, , ) = estimateFee(1);
    //     uint256 netValue = (value - mpcFee) -
    //         (gasParams.defaultGasPrice * gasParams.defaultGasLimit);
    //     bytes memory rlpTransactionData = rlpEncodeTransaction(
    //         _chainNonce[dstChain],
    //         gasParams.defaultGasPrice,
    //         gasParams.defaultGasLimit,
    //         to,
    //         netValue,
    //         data
    //     );
    //     reqSignForTx(EVM_WALLET_TYPE, 0, dstChain, rlpTransactionData, true);
    //     _chainNonce[dstChain]++;
    // }
}
