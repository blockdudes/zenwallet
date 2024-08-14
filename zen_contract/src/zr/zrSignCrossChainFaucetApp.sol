// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Lib_RLPWriter} from "./libraries/Lib_RLPWriter.sol";
import {ZrSignFaucetTypes} from "./libraries/ZrSignFaucetTypes.sol";
import {ZrSignConnect} from "./zrSignConnect.sol";

contract zrSignCrossChainFaucetApp is ZrSignConnect {
    using Lib_RLPWriter for uint256;
    bytes32 internal constant sepoliaChainId =
        0xafa90c317deacd3d68f330a30f96e4fa7736e35e8d1426b2e1b2c04bce1c2fb7;

    bytes32 internal constant amoyChainId =
        0x4df3b2a1df4e086e001def1ba6466078aa6aaf12e7a183f590364b811b18ee5b;

    mapping(bytes32 => uint256) internal _chainNonce;
    mapping(bytes32 => ZrSignFaucetTypes.GasParams) internal _gasParams;
    constructor(address zrSignAddress) ZrSignConnect(zrSignAddress) {
        _gasParams[sepoliaChainId] = ZrSignFaucetTypes.GasParams({
            defaultGasPrice: 50000000000,
            defaultGasLimit: 100000
        });
        _gasParams[amoyChainId] = ZrSignFaucetTypes.GasParams({
            defaultGasPrice: 10000000000,
            defaultGasLimit: 100000
        }); 
    }

    receive() external payable{}

    function getSepoliaEth() external payable {
        _submitTransaction(sepoliaChainId, msg.sender, msg.value);
    }

    function getAmoyMatic() external payable {
        _submitTransaction(amoyChainId, msg.sender, msg.value);
    }

    function _submitTransaction(
        bytes32 dstChain,
        address to,
        uint256 value
    ) internal {
        ZrSignFaucetTypes.GasParams memory gasParams = _gasParams[dstChain];
        bytes memory data = rlpEncodeData(abi.encodePacked(block.chainid));
        (uint256 mpcFee, , ) = estimateFee(1);
        uint256 netValue = (value - mpcFee) -
            (gasParams.defaultGasPrice * gasParams.defaultGasLimit);
        bytes memory rlpTransactionData = rlpEncodeTransaction(
            _chainNonce[dstChain],
            gasParams.defaultGasPrice,
            gasParams.defaultGasLimit,
            to,
            netValue,
            data
        );
        reqSignForTx(EVM_WALLET_TYPE, 0, dstChain, rlpTransactionData, true);
        _chainNonce[dstChain]++;
    }

    function getSimpleSepoliaEth() external payable {
        _submitSimpleTransaction(sepoliaChainId, msg.sender, msg.value);
    }

    function getSimpleAmoyMatic() external payable {
        _submitSimpleTransaction(amoyChainId, msg.sender, msg.value);
    }

    function _submitSimpleTransaction(
        bytes32 dstChain,
        address to,
        uint256 value
    ) internal {
        bytes memory data = rlpEncodeData(abi.encodePacked(block.chainid));
        ZrSignFaucetTypes.GasParams memory gasParams = _gasParams[dstChain];
        (uint256 mpcFee, , ) = estimateFee(OPTIONS_MONITORING);
        uint256 netValue = (value - mpcFee) -
            (gasParams.defaultGasPrice * gasParams.defaultGasLimit);

        reqSignForSimpleTx(
            EVM_WALLET_TYPE,
            1,
            dstChain,
            toChecksumHexString(to),
            netValue,
            data,
            true
        );
        _chainNonce[dstChain]++;
    }
}
