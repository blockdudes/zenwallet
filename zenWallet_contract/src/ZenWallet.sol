// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ZrContract/ZrSign(implementation)/contracts/interfaces/zr/IZrSign.sol";
import "@uniswap/v2-periphery/interfaces/IUniswapV2Router01.sol";
import "@uniswap/v2-core/interfaces/IERC20.sol";
import "./aaveV3/IPool.sol";

contract ZenWallet {
    // Custom errors
    error WalletAlreadyRegistered();
    error WalletNotExists();
    error ChainNotSupported();

    // Constants
    bytes32 internal constant EVMWalletType =
        0xe146c2986893c43af5ff396310220be92058fb9f4ce76b929b80ef0d5307100a;

    struct Wallet {
        string walletAddress;
        uint256 walletIndex;
    }

    modifier isWalletExists() {
    require(isWalletCreated[msg.sender], "Wallet does not exist");
    _;
    }

    // State variables
    IZrSign public signContract;
    IUniswapV2Router01 public uniswapRouter;
    IPool public aavePool;
    mapping(address => Wallet) public userMultisupportWallet;
    mapping(address => bool) public isWalletCreated;
    mapping(uint256 => bool) public isChainSupported;
    uint256 public walletIndex = 0;

    // Constructor
    constructor(address _signContractAddress, address _uniswapRouterAddress, address _aavePoolAddress) {
        signContract = IZrSign(_signContractAddress);
        uniswapRouter = IUniswapV2Router01(_uniswapRouterAddress);
        aavePool = IPool(_aavePoolAddress);
    }

    // Public and external functions
    function getKey() public payable isWalletExists {

        //  (, , uint256 totalFee) = signContract.estimateFee(
        //     1,
        //     0
        // );
    
        SignTypes.ZrKeyReqParams memory params = SignTypes.ZrKeyReqParams({
            walletTypeId: EVMWalletType,
            options: 1
        });

        signContract.zrKeyReq{value: msg.value}(params);
        isWalletCreated[msg.sender] = true;
        string memory zrKey = signContract.getZrKey(
            EVMWalletType,
            msg.sender,
            walletIndex
        );
        userMultisupportWallet[msg.sender] = Wallet(zrKey, walletIndex);
        walletIndex++;
    }

    function getWallet() public view returns (Wallet memory) {
        return userMultisupportWallet[msg.sender];
    }

    function destinationChainHash(
        uint256 chainId
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("eip155:", chainId));
    }

    function transfer(uint256 chainId, bytes memory data) public isWalletExists {

        if (!isChainSupported[chainId]) {
            revert ChainNotSupported();
        }

        _signAndSend(chainId, msg.sender, data);
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

    function _signAndSend(
        uint256 chainId,
        address signer,
        bytes memory calldataPayload
    ) internal {
        signContract.zrSignTx(
            SignTypes.ZrSignParams({
                walletTypeId: EVMWalletType,
                walletIndex: userMultisupportWallet[signer].walletIndex,
                dstChainId: destinationChainHash(chainId),
                payload: calldataPayload,
                broadcast: true
            })
        );
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
            address(bytes20(bytes(userMultisupportWallet[msg.sender].walletAddress))),
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

        _signAndSend(chainId,msg.sender, approveCalldata);

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
                uniswapRouter.swapExactTokensForTokens.selector,
                amountIn,
                amountOutMinimum,
                path,
                recipient,
                block.timestamp + 300
            )
        );

        _signAndSend(chainId,msg.sender, swapCalldata);
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
            address(bytes20(bytes(userMultisupportWallet[msg.sender].walletAddress))),
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

        _signAndSend(chainId,msg.sender, approveCalldata);


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

        _signAndSend(chainId,msg.sender, supplyCalldata);
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
            address(bytes20(bytes(userMultisupportWallet[msg.sender].walletAddress))),
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

        _signAndSend(chainId,msg.sender, approveCalldata);

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

        _signAndSend(chainId,msg.sender, borrowCalldata);
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
            address(bytes20(bytes(userMultisupportWallet[msg.sender].walletAddress))),
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

        _signAndSend(chainId,msg.sender, approveCalldata);

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

        _signAndSend(chainId,msg.sender, repayCalldata);
    }

}
