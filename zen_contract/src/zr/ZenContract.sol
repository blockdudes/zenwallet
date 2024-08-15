// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Lib_RLPWriter} from "./libraries/Lib_RLPWriter.sol";
import {SignTypes} from "./libraries/SignTypes.sol";
import {IZrSign} from "./interfaces/IZrSign.sol";
import "v2-periphery/interfaces/IUniswapV2Router01.sol";
import "v2-core/interfaces/IERC20.sol";
import "../aaveV3/IPool.sol";

contract ZenContract {
    using Lib_RLPWriter for uint256;
    using Lib_RLPWriter for address;
    using Lib_RLPWriter for bytes;
    using Lib_RLPWriter for bytes[];
    using SignTypes for SignTypes.SimpleTx;

    // Custom errors
    error WalletAlreadyRegistered();
    error WalletNotExists();
    error ChainNotSupported();
    event DebugInfo(address indexed signer, uint indexed walletIndex);

    bytes32 internal constant EVM_WALLET_TYPE =
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

    constructor(
        address _zrSignAddress,
        address _uniswapRouterAddress,
        address _aavePoolAddress
    ) {
        signContract = IZrSign(_zrSignAddress);
        uniswapRouter = IUniswapV2Router01(_uniswapRouterAddress);
        aavePool = IPool(_aavePoolAddress);
        isChainSupported[11155111] = true;
        isChainSupported[80002] = true;
    }

    // State variables
    IZrSign public signContract;
    IUniswapV2Router01 public uniswapRouter;
    IPool public aavePool;
    mapping(address => uint256) public userMultisupportWallet;
    mapping(address => bool) public isWalletCreated;
    mapping(uint256 => bool) public isChainSupported;
    uint256 public walletIndex = 0;

    receive() external payable {}

    function requestNewEVMWallet() public payable virtual {
        SignTypes.ZrKeyReqParams memory params = SignTypes.ZrKeyReqParams({
            walletTypeId: EVM_WALLET_TYPE,
            options: 1
        });

        signContract.zrKeyReq{value: msg.value}(params);

        isWalletCreated[msg.sender] = true;
        userMultisupportWallet[msg.sender] = walletIndex;
        walletIndex++;
    }

    function getWallet(address signer) public view returns (Wallet memory) {
        string memory zrKey = signContract.getZrKey(
            EVM_WALLET_TYPE,
            address(this),
            userMultisupportWallet[signer]
        );
        return
            Wallet({
                walletAddress: zrKey,
                walletIndex: userMultisupportWallet[signer]
            });
    }

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

    function rlpEncodeData(
        bytes memory data
    ) internal virtual returns (bytes memory) {
        return data.writeBytes();
    }

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

    function stringToAddress(string memory str) public pure returns (address) {
        bytes memory tmp = bytes(str);
        uint160 addr = 0;
        uint160 b = 0;
        uint160 base = 16;

        require(tmp.length == 42, "Invalid address length"); 

        for (uint i = 2; i < 42; i++) { 
            b = uint160(uint8(tmp[i]));

            if (b >= 48 && b <= 57) { 
                b -= 48;
            } else if (b >= 97 && b <= 102) { 
                b -= (97 - 10);
            } else if (b >= 65 && b <= 70) { 
                b -= (65 - 10);
            } else {
                revert("Invalid character in address");
            }

            addr = addr * base + b;
        }

        return address(addr);
    }

    function _signAndSend(
        uint256 chainId,
        address signer,
        bytes memory calldataPayload
    ) internal {
        if (!isChainSupported[chainId]) {
            revert ChainNotSupported();
        }
        //  (, , uint totalFee) = signContract.estimateFee(
        //     EVM_WALLET_TYPE,
        //     address(this),
        //     userMultisupportWallet[signer],
        //     0
        // );

        SignTypes.ZrSignParams memory params = SignTypes.ZrSignParams({
            walletTypeId: EVM_WALLET_TYPE,
            walletIndex: getWallet(signer).walletIndex,
            dstChainId: chainId == 11155111 ? sepoliaChainId : amoyChainId,
            payload: calldataPayload,
            broadcast: true
        });
        emit DebugInfo(signer, getWallet(signer).walletIndex);

        signContract.zrSignTx{value: msg.value}(params);
    }

    function send(
        uint256 chainId,
        bytes memory data,
        uint256 nonce,
        address to,
        uint256 value,
        uint256 gasPrice,
        uint256 gasLimit
    ) public payable isWalletExists {
        if (!isChainSupported[chainId]) {
            revert ChainNotSupported();
        }

        bytes memory rlpPayloadData = rlpEncodeData(data);

        bytes memory rlpTransactionData = rlpEncodeTransaction(
            nonce,
            gasPrice,
            gasLimit,
            to,
            value,
            rlpPayloadData
        );

        _signAndSend(chainId, msg.sender, rlpTransactionData);
    }

    function recieve(
        uint256 chainId,
        uint256 nonce,
        address to,
        uint256 value,
        uint256 gasPrice,
        uint256 gasLimit
    ) public payable isWalletExists {
        address payable walletAddress = payable(
            stringToAddress(getWallet(msg.sender).walletAddress)
        );
        walletAddress.transfer(value);

        bytes memory rlpTransactionData = rlpEncodeTransaction(
            nonce,
            gasPrice,
            gasLimit,
            to,
            value,
            "0x"
        );

        _signAndSend(chainId, msg.sender, rlpTransactionData);
    }

     function recieveErc20(
        uint256 chainId,
        uint256 nonce,
        address to,
        uint256 value,
        uint256 gasPrice,
        uint256 gasLimit,
        address token
    ) public payable isWalletExists {
       
        IERC20(token).transferFrom(
            msg.sender,
            stringToAddress(getWallet(msg.sender).walletAddress),
            value
        );

        bytes memory data = abi.encodeWithSelector(
            IERC20(token).transfer.selector,
            to,
            value
        );

        bytes memory rlpPayloadData = rlpEncodeData(data);

        bytes memory rlpTransactionData = rlpEncodeTransaction(
            nonce,
            gasPrice,
            gasLimit,
            to,
            value,
            rlpPayloadData
        );

        _signAndSend(chainId, msg.sender, rlpTransactionData);
    }



    function sendToken(
        uint256 chainId,
        uint256 nonce,
        address to,
        address token,
        uint256 value,
        uint256 gasPrice,
        uint256 gasLimit
    ) public isWalletExists {
        if (!isChainSupported[chainId]) {
            revert ChainNotSupported();
        }

        IERC20(token).transferFrom(
            msg.sender,
            stringToAddress(getWallet(msg.sender).walletAddress),
            value
        );

        bytes memory data = abi.encodeWithSelector(
            IERC20(token).transfer.selector,
            to,
            value
        );

        bytes memory rlpPayloadData = rlpEncodeData(data);

        bytes memory rlpTransactionData = rlpEncodeTransaction(
            nonce,
            gasPrice,
            gasLimit,
            to,
            value,
            rlpPayloadData
        );

        _signAndSend(chainId, msg.sender, rlpTransactionData);
    }

    function swapTokens(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMinimum,
        address recipient,
        uint256 nonce,
        uint256 gasPrice,
        uint256 gasLimit,
        uint256 chainId
    ) public isWalletExists {
        IERC20(tokenIn).transferFrom(
            msg.sender,
            address(bytes20(bytes(getWallet(msg.sender).walletAddress))),
            amountIn
        );

        bytes memory approveCalldata = _encodeTransaction(
            abi.encodePacked(uint256(nonce)),
            abi.encodePacked(uint256(gasPrice)),
            abi.encodePacked(uint256(gasLimit)),
            abi.encodePacked(address(uniswapRouter)),
            abi.encodePacked(uint256(amountIn)),
            abi.encodeWithSelector(
                IERC20.approve.selector,
                address(uniswapRouter),
                amountIn
            )
        );

        _signAndSend(chainId, msg.sender, approveCalldata);

        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        bytes memory swapCalldata = _encodeTransaction(
            abi.encodePacked(uint256(nonce + 1)),
            abi.encodePacked(uint256(gasPrice)),
            abi.encodePacked(uint256(gasLimit)),
            abi.encodePacked(address(uniswapRouter)),
            abi.encodePacked(uint256(0)),
            abi.encodeWithSelector(
                uniswapRouter.swapTokensForExactTokens.selector,
                amountIn,
                amountOutMinimum,
                path,
                recipient,
                block.timestamp + 300
            )
        );

        _signAndSend(chainId, msg.sender, swapCalldata);
    }

    function getAmountOut(
        uint amountIn,
        address tokenIn,
        address tokenOut
    ) public view returns (uint amountOut) {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        uint256[] memory amounts = uniswapRouter.getAmountsOut(amountIn, path);
        return amounts[amounts.length - 1];
    }

    function aaveSupply(
        address token,
        uint256 amount,
        uint256 nonce,
        uint256 gasPrice,
        uint256 gasLimit,
        uint256 chainId
    ) public isWalletExists {
        IERC20(token).transferFrom(
            msg.sender,
            address(bytes20(bytes(getWallet(msg.sender).walletAddress))),
            amount
        );

        bytes memory approveCalldata = _encodeTransaction(
            abi.encodePacked(uint256(nonce)),
            abi.encodePacked(uint256(gasPrice)),
            abi.encodePacked(uint256(gasLimit)),
            abi.encodePacked(address(uniswapRouter)),
            abi.encodePacked(uint256(amount)),
            abi.encodeWithSelector(
                IERC20.approve.selector,
                address(aavePool),
                amount
            )
        );

        _signAndSend(chainId, msg.sender, approveCalldata);

        bytes memory supplyCalldata = _encodeTransaction(
            abi.encodePacked(uint256(nonce + 1)),
            abi.encodePacked(uint256(gasPrice)),
            abi.encodePacked(uint256(gasLimit)),
            abi.encodePacked(address(aavePool)),
            abi.encodePacked(uint256(0)),
            abi.encodeWithSelector(
                aavePool.supply.selector,
                token,
                amount,
                msg.sender,
                0
            )
        );

        _signAndSend(chainId, msg.sender, supplyCalldata);
    }

    function aaveBorrow(
        address asset,
        uint256 amount,
        uint256 interestRateMode,
        uint256 nonce,
        uint256 gasPrice,
        uint256 gasLimit,
        uint256 chainId
    ) public isWalletExists {
        IERC20(asset).transferFrom(
            msg.sender,
            stringToAddress(getWallet(msg.sender).walletAddress),
            amount
        );

        bytes memory approveCalldata = _encodeTransaction(
            abi.encodePacked(uint256(nonce)),
            abi.encodePacked(uint256(gasPrice)),
            abi.encodePacked(uint256(gasLimit)),
            abi.encodePacked(address(uniswapRouter)),
            abi.encodePacked(uint256(amount)),
            abi.encodeWithSelector(
                IERC20.approve.selector,
                address(aavePool),
                amount
            )
        );

        _signAndSend(chainId, msg.sender, approveCalldata);

        bytes memory borrowCalldata = _encodeTransaction(
            abi.encodePacked(uint256(nonce)),
            abi.encodePacked(uint256(gasPrice)),
            abi.encodePacked(uint256(gasLimit)),
            abi.encodePacked(address(aavePool)),
            abi.encodePacked(uint256(0)),
            abi.encodeWithSelector(
                aavePool.borrow.selector,
                asset,
                amount,
                interestRateMode,
                0,
                msg.sender
            )
        );

        _signAndSend(chainId, msg.sender, borrowCalldata);
    }

    function aaveRepay(
        address asset,
        uint256 amount,
        uint256 interestRateMode,
        uint256 nonce,
        uint256 gasPrice,
        uint256 gasLimit,
        uint256 chainId
    ) public isWalletExists {
        IERC20(asset).transferFrom(
            msg.sender,
            stringToAddress(getWallet(msg.sender).walletAddress),
            amount
        );

        bytes memory approveCalldata = _encodeTransaction(
            abi.encodePacked(uint256(nonce)),
            abi.encodePacked(uint256(gasPrice)),
            abi.encodePacked(uint256(gasLimit)),
            abi.encodePacked(address(uniswapRouter)),
            abi.encodePacked(uint256(amount)),
            abi.encodeWithSelector(
                IERC20.approve.selector,
                address(aavePool),
                amount
            )
        );

        _signAndSend(chainId, msg.sender, approveCalldata);

        bytes memory repayCalldata = _encodeTransaction(
            abi.encodePacked(uint256(nonce)),
            abi.encodePacked(uint256(gasPrice)),
            abi.encodePacked(uint256(gasLimit)),
            abi.encodePacked(address(aavePool)),
            abi.encodePacked(uint256(0)),
            abi.encodeWithSelector(
                aavePool.repay.selector,
                asset,
                amount,
                interestRateMode,
                msg.sender
            )
        );

        _signAndSend(chainId, msg.sender, repayCalldata);
    }
}
