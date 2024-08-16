// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {Lib_RLPWriter} from "./libraries/Lib_RLPWriter.sol";

import {SignTypes} from "./libraries/SignTypes.sol";

import {IZrSign} from "./interfaces/IZrSign.sol";

// Abstract contract for ZrSign connections
abstract contract ZrSignConnect {
    // Use the RLPWriter library for various types
    using Lib_RLPWriter for address;
    using Lib_RLPWriter for uint256;
    using Lib_RLPWriter for bytes;
    using Lib_RLPWriter for bytes[];
    using SignTypes for SignTypes.SimpleTx;

    event ZrKeyRequest(
        bytes32 indexed walletTypeId,
        address indexed owner,
        uint256 indexed walletIndex,
        bool monitoring
    );

    bytes16 private constant HEX_DIGITS = "0123456789abcdef";
    uint8 private constant ADDRESS_LENGTH = 20;
    error StringsInsufficientHexLength(uint256 value, uint256 length);

    uint8 public constant WALLET_REQUESTED = 1;
    uint8 public constant WALLET_REGISTERED = 2;

    uint8 public constant SIG_REQ_IN_PROGRESS = 1;
    uint8 public constant SIG_REQ_ALREADY_PROCESSED = 2;

    uint8 public constant OPTIONS_MONITORING = 2;

    // Address of the ZrSign contract
    address payable internal immutable ZR_SIGN_ADDRESS;

    // The wallet type for EVM-based wallets
    bytes32 internal constant EVM_WALLET_TYPE =
        0xe146c2986893c43af5ff396310220be92058fb9f4ce76b929b80ef0d5307100a;

    constructor(address zrSignAddress) {
        ZR_SIGN_ADDRESS = payable(zrSignAddress);
    }

    // Request a new EVM wallet
    // This function uses the ZrSign contract to request a new public key for the EVM wallet type
    function requestNewEVMWallet(uint8 options) public payable virtual {
        // Prepare the parameters for the key request
        SignTypes.ZrKeyReqParams memory params = SignTypes.ZrKeyReqParams({
            walletTypeId: EVM_WALLET_TYPE,
            options: options
        });

        IZrSign(ZR_SIGN_ADDRESS).zrKeyReq{value: msg.value}(params);

        emit ZrKeyRequest(EVM_WALLET_TYPE, msg.sender, 0, false);

    }

    // Request a signature for a specific hash
    // This function uses the ZrSign contract to request a signature for a specific hash
    // Parameters:
    // - walletTypeId: The ID of the wallet type associated with the hash
    // - fromAccountIndex: The index of the public key to be used for signing
    // - dstChainId: The ID of the destination chain
    // - payloadHash: The hash of the payload to be signed
    function reqSignForHash(
        bytes32 walletTypeId,
        uint256 walletIndex,
        bytes32 dstChainId,
        bytes32 payloadHash
    ) internal virtual {
        (, , uint totalFee) = IZrSign(ZR_SIGN_ADDRESS).estimateFee(
            walletTypeId,
            address(this),
            walletIndex,
            0
        );

        SignTypes.ZrSignParams memory params = SignTypes.ZrSignParams({
            walletTypeId: walletTypeId,
            walletIndex: walletIndex,
            dstChainId: dstChainId,
            payload: abi.encodePacked(payloadHash),
            broadcast: false // Not used in this context
        });

        IZrSign(ZR_SIGN_ADDRESS).zrSignHash{value: totalFee}(params);
    }

    // Request a signature for a specific data payload
    // This function uses the ZrSign contract to request a signature for a specific data payload
    // Parameters:
    // - walletTypeId: The ID of the wallet type associated with the data payload
    // - fromAccountIndex: The index of the public key to be used for signing
    // - dstChainId: The ID of the destination chain
    // - payload: The data payload to be signed
    function reqSignForData(
        bytes32 walletTypeId,
        uint256 walletIndex,
        bytes32 dstChainId,
        bytes memory payload
    ) internal virtual {
        (, , uint totalFee) = IZrSign(ZR_SIGN_ADDRESS).estimateFee(
            walletTypeId,
            address(this),
            walletIndex,
            0
        );

        SignTypes.ZrSignParams memory params = SignTypes.ZrSignParams({
            walletTypeId: walletTypeId,
            walletIndex: walletIndex,
            dstChainId: dstChainId,
            payload: payload,
            broadcast: false
        });

        IZrSign(ZR_SIGN_ADDRESS).zrSignData{value: totalFee}(params);
    }

    // Request a signature for a transaction
    // This function uses the ZrSign contract to request a signature for a transaction
    // Parameters:
    // - walletTypeId: The ID of the wallet type associated with the transaction
    // - fromAccountIndex: The index of the account from which the transaction will be sent
    // - chainId: The ID of the chain on which the transaction will be executed
    // - payload: The RLP-encoded transaction data
    // - broadcast: A flag indicating whether the transaction should be broadcasted immediately

    function reqSignForTx(
        bytes32 walletTypeId,
        uint256 walletIndex,
        bytes32 dstChainId,
        bytes memory payload,
        bool broadcast
    ) internal virtual {
        (, , uint totalFee) = IZrSign(ZR_SIGN_ADDRESS).estimateFee(
            walletTypeId,
            address(this),
            walletIndex,
            0
        );
        SignTypes.ZrSignParams memory params = SignTypes.ZrSignParams({
            walletTypeId: walletTypeId,
            walletIndex: walletIndex,
            dstChainId: dstChainId,
            payload: payload,
            broadcast: broadcast
        });

        IZrSign(ZR_SIGN_ADDRESS).zrSignTx{value: totalFee}(params);
    }

    function reqSignForSimpleTx(
        bytes32 walletTypeId,
        uint256 walletIndex,
        bytes32 dstChainId,
        string memory to,
        uint256 value,
        bytes memory data,
        bool broadcast
    ) internal virtual {
        (, , uint totalFee) = IZrSign(ZR_SIGN_ADDRESS).estimateFee(
            walletTypeId,
            address(this),
            walletIndex,
            0
        );
        bytes memory payload = SignTypes
            .SimpleTx({to: to, value: value, data: data})
            .encodeSimple();

        SignTypes.ZrSignParams memory params = SignTypes.ZrSignParams({
            walletTypeId: walletTypeId,
            walletIndex: walletIndex,
            dstChainId: dstChainId,
            payload: payload,
            broadcast: broadcast
        });

        IZrSign(ZR_SIGN_ADDRESS).zrSignTx{value: totalFee}(params);
    }

    function estimateFee(
        uint8 options
    ) public view returns (uint256 mpcFee, uint256 netResp, uint256 total) {
        return IZrSign(ZR_SIGN_ADDRESS).estimateFee(options, 0);
    }

    // Get all EVM wallets associated with this contract
    // This function uses the ZrSign contract to get all wallets of the EVM type that belong to this contract
    function getEVMWallets() public view virtual returns (string[] memory) {
        return
            IZrSign(ZR_SIGN_ADDRESS).getZrKeys(EVM_WALLET_TYPE, address(this));
    }

    // Get an EVM wallet associated with this contract by index
    // This function uses the ZrSign contract to get a specific EVM wallet that belongs to this contract, specified by an index
    // Parameter:
    // - index: The index of the EVM wallet to be retrieved
    function getEVMWallet(uint256 index) public view returns (string memory) {
        return
            IZrSign(ZR_SIGN_ADDRESS).getZrKey(
                EVM_WALLET_TYPE,
                address(this),
                index
            );
    }

    // Encode data using RLP
    // This function uses the RLPWriter library to encode data into RLP format
    function rlpEncodeData(
        bytes memory data
    ) internal virtual returns (bytes memory) {
        return data.writeBytes();
    }

    // Encode a transaction using RLP
    // This function uses the RLPWriter library to encode a transaction into RLP format
    function rlpEncodeTransaction(
        uint256 nonce,
        uint256 gasPrice,
        uint256 gasLimit,
        address to,
        uint256 value,
        bytes memory data
    ) internal virtual returns (bytes memory) {
        bytes memory nb = nonce.writeUint();
        bytes memory gp = gasPrice.writeUint();
        bytes memory gl = gasLimit.writeUint();
        bytes memory t = to.writeAddress();
        bytes memory v = value.writeUint();
        return _encodeTransaction(nb, gp, gl, t, v, data);
    }

    // Helper function to encode a transaction
    // This function is used by the rlpEncodeTransaction function to encode a transaction into RLP format
    function _encodeTransaction(
        bytes memory nonce,
        bytes memory gasPrice,
        bytes memory gasLimit,
        bytes memory to,
        bytes memory value,
        bytes memory data
    ) internal pure returns (bytes memory) {
        bytes memory zb = uint256(0).writeUint();
        bytes[] memory payload = new bytes[](9);
        payload[0] = nonce;
        payload[1] = gasPrice;
        payload[2] = gasLimit;
        payload[3] = to;
        payload[4] = value;
        payload[5] = data;
        payload[6] = zb;
        payload[7] = zb;
        payload[8] = zb;
        return payload.writeList();
    }

    function toHexString(address addr) internal pure returns (string memory) {
        return toHexString(uint256(uint160(addr)), ADDRESS_LENGTH);
    }
    function toHexString(
        uint256 value,
        uint256 length
    ) internal pure returns (string memory) {
        uint256 localValue = value;
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = HEX_DIGITS[localValue & 0xf];
            localValue >>= 4;
        }
        if (localValue != 0) {
            revert StringsInsufficientHexLength(value, length);
        }
        return string(buffer);
    }
    function toChecksumHexString(
        address addr
    ) internal pure returns (string memory) {
        bytes memory buffer = bytes(toHexString(addr));

        // hash the hex part of buffer (skip length + 2 bytes, length 40)
        uint256 hashValue;
        assembly ("memory-safe") {
            hashValue := shr(96, keccak256(add(buffer, 0x22), 40))
        }

        for (uint256 i = 41; i > 1; --i) {
            // possible values for buffer[i] are 48 (0) to 57 (9) and 97 (a) to 102 (f)
            if (hashValue & 0xf > 7 && uint8(buffer[i]) > 96) {
                // case shift by xoring with 0x20
                buffer[i] ^= 0x20;
            }
            hashValue >>= 4;
        }
        return string(buffer);
    }
}
