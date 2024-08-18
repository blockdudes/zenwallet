"use client";
import React, { useState } from "react";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Input } from "@material-tailwind/react";
import { TokenSelectDialog } from "./tokenSelectDialog"; // Import the TokenSelectDialog component
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { useActiveAccount } from "thirdweb/react";
import { getContract, readContract } from "thirdweb";
import { uniswapRouterABI } from "@/abis/uniswapRouterABI";
import { tokenContractABI } from "@/abis/tokenContractABI";
import { zenContractABI } from "@/abis/zenContractABI";
import { client } from "@/lib/client";
import { sepolia } from "thirdweb/chains";
import { ethers } from "ethers";
import { polygonAmoy } from "thirdweb/chains";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { getChainNonce } from "../wallet-components/sendDetails";

const SwapModal = () => {
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [sellToken, setSellToken] = useState({
    label: "",
    address: "",
    src: "https://assets.coingecko.com/coins/images/26580/standard/ONDO.png?1696525656",
  });

  const [buyToken, setBuyToken] = useState({
    label: "",
    address: "",
    src: "https://assets.coingecko.com/coins/images/26580/standard/ONDO.png?1696525656",
  });
  const [openSellDialog, setOpenSellDialog] = useState(false);
  const [openBuyDialog, setOpenBuyDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const activeAccount = useActiveAccount();

  // Define a new function to handle the sell amount change and calculate the buy amount
  async function handleSellAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const sellValue = e.target.value;
    setSellAmount(sellValue);

    // If sellValue is empty or not a valid number, reset buyAmount and return
    if (!sellValue || isNaN(Number(sellValue))) {
      console.log("here");
      setBuyAmount("");
      return;
    }

    try {

      const contract = getContract({
        address: "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008",
        abi: uniswapRouterABI as any,
        client: client,
        chain: sepolia
      });

      const erc20Contract = getContract({
        address: sellToken.address,
        abi: tokenContractABI.abi as any,
        client: client,
        chain: sepolia
      });

      const decimal = 6;

      console.log(decimal, sellValue);

      const amountOut = await readContract({
        contract: contract,
        method: "getAmountsOut",
        params: [BigInt(ethers.utils.parseUnits(sellValue, decimal).toString()), [sellToken.address, buyToken.address]]
      })

      console.log(amountOut);

      const buyValueBigInt = amountOut[1];
      const buyValueFormatted = ethers.utils.formatUnits(buyValueBigInt, decimal);

      console.log(buyValueFormatted);
      setBuyAmount((prev) => buyValueFormatted);
    } catch (error) {
      console.error("Error calculating buy amount:", error);
      setBuyAmount("");
    }
  }

  console.log(buyAmount, "HELL");

  const storeTransaction = (transactionData: any) => {
    // Fetch existing transactions from localStorage
    const existingTransactions = localStorage.getItem("transactionData");
    const transactions = existingTransactions
      ? JSON.parse(existingTransactions)
      : [];

    if (!Array.isArray(transactions)) {
      console.error("Stored transaction data is corrupted or not an array");
      return; // Optionally handle this case more gracefully
    }
    // Add the new transaction to the array using the spread operator
    const updatedTransactions = [...transactions, transactionData];

    // Save the updated array back to localStorage
    localStorage.setItem(
      "transactionData",
      JSON.stringify(updatedTransactions)
    );
  };

  async function handleSwap() {
    let result = await handleSwapToken();
    if (result) {
      setIsLoading(true);
      if (sellToken.address === buyToken.address) {
        toast.error("Tokens cannot be the same");
        setIsLoading(false);
        return;
      }
      const transactionData = {
        TYPE: "swap",
        AMOUNT: sellAmount,
        TOKEN_ADDRESS: sellToken.address,
        SENDER_ADDRESS: activeAccount?.address,
        RECEIVER_ADDRESS: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      };
      storeTransaction(transactionData);

      toast.promise(
        new Promise<void>((resolve, reject) => {
          console.log(isLoading);
          setTimeout(() => {
            setIsLoading(false);
            resolve();
            setSellAmount("");
            setBuyAmount("");
            setSellToken({
              label: "",
              address: "",
              src: "https://assets.coingecko.com/coins/images/26580/standard/ONDO.png?1696525656",
            });
            setBuyToken({
              label: "",
              address: "",
              src: "https://assets.coingecko.com/coins/images/26580/standard/ONDO.png?1696525656",
            });
          }, 3000);
        }),
        {
          loading: "Sending...",
          success: <b>Swap successful!</b>,
          error: <b>Could not swap.</b>,
        }
      );
      console.log({
        "sell amount: ": sellAmount,
        "sell token: ": sellToken.address,
        "buy amount: ": buyAmount,
        "buy token: ": buyToken.address,
      });
    }
  }

  const handleSwapToken = async () => {
    try {
      if (sellToken.address && buyToken.address && sellAmount && buyAmount) {

        console.log(sellToken.address)
        const erc20Contract = getContract({
          address: sellToken.address,
          abi: tokenContractABI.abi as any,
          client: client,
          chain: polygonAmoy
        });

        console.log(erc20Contract);


        const decimal = 6;


        console.log(BigInt(ethers.utils.parseUnits(sellAmount, decimal).toString()));
        const approveTransaction = prepareContractCall({
          contract: erc20Contract,
          method: "approve",
          params: ["0xa1059f3a472BBb3e212ea81d056eD19cde6e5A5F", BigInt(ethers.utils.parseUnits(sellAmount, decimal).toString())],
          gas: BigInt(10000000)
        });
        console.log(approveTransaction)

        const approveResult = activeAccount && await sendAndConfirmTransaction({
          account: activeAccount,
          transaction: approveTransaction
        })
        console.log(approveResult)

        if (approveResult) {
          if (approveResult.status === "success") {
            if (approveResult.status === "success") {
              const contract = getContract({
                address: "0xa1059f3a472BBb3e212ea81d056eD19cde6e5A5F",
                abi: zenContractABI as any,
                client: client,
                chain: polygonAmoy
              });
              const addr = await readContract({
                contract: contract,
                method: "getWallet",
                params: []
              });
              console.log(addr)

              const nonce = await getChainNonce(sepolia.id, (addr as any).walletAddress.toString());

              const transaction = prepareContractCall({
                contract: contract,
                method: "function swapTokens(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMinimum, address recipient, uint256 nonce, uint256 gasPrice, uint256 gasLimit, uint256 chainId) public",
                params: [sellToken.address, buyToken.address, BigInt(ethers.utils.parseUnits(sellAmount, decimal).toString()), BigInt(ethers.utils.parseUnits(buyAmount, decimal).toString()), "0x54Dd044528656B3b43b037C7D3c189AbfD940a71", nonce, BigInt(31000000000), BigInt(80000), BigInt(sepolia.id)],
                value: BigInt(ethers.utils.parseEther("0.001").toString()),
                gas: BigInt(10000000)
              });

              const result = activeAccount && await sendAndConfirmTransaction({
                account: activeAccount,
                transaction: transaction
              })

              if (result) {
                if (result.status === "success") {
                  const privateKey = "0x";
                  const provider = new ethers.providers.JsonRpcProvider("https://sepolia.rpc.thirdweb.com");
                  // const nonce = await provider.getTransactionCount(activeAccount?.address);
                  const wallet = new ethers.Wallet(privateKey, provider);
                  const uniswapRouterAddress = '0x54Dd044528656B3b43b037C7D3c189AbfD940a71';
                  const uniswapRouter = new ethers.Contract(uniswapRouterAddress, uniswapRouterABI, wallet);
                  const amountIn = ethers.utils.parseUnits(sellAmount, decimal);
                  const amountOutMin = ethers.utils.parseUnits(buyAmount, decimal);
                  const path = [sellToken.address, buyToken.address];
                  const to = activeAccount?.address;
                  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
                  const tx = await uniswapRouter.swapTokensForExactTokens(
                    amountOutMin,
                    amountIn,
                    path,
                    to,
                    deadline,
                    {
                      gasLimit: ethers.utils.hexlify(1000000) // Adjust as needed
                    }
                  );
                  const receipt = await tx.wait();
                  console.log(receipt);
                  return true
                } else {
                  return false
                }
              } else {
                return false
              }
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        toast.error("Please select a token and amount");
      }

    } catch (error) {
      console.log(error);
      return false;
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-full w-full gap-4 bg-gray-500/10 backdrop-blur-md p-2 rounded-lg">
      <button onClick={handleSwapToken}>uniswap</button>
      <div className="relative flex flex-col justify-center items-center h-full w-full gap-2">
        {/* Sell Section */}
        <div className="w-full h-[120px] rounded-[10px] p-4 border-white/20 border-[1px] bg-white/10 backdrop-blur-md">
          <div className="flex w-full h-full justify-between items-center gap-4">
            <Input
              type="number"
              variant="standard"
              color="white"
              label="Sell"
              className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={sellAmount}
              onChange={handleSellAmountChange}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
            />
            <button
              className="backdrop-blur-md bg-gray-200/30 rounded-full p-2 w-[180px] text-white flex items-center justify-between gap-2 text-xs"
              onClick={() => setOpenSellDialog(true)}
            >
              {sellToken.address ? (
                <>
                  <div className="bg-white rounded-full p-1">
                    <img
                      src={sellToken.src}
                      alt={sellToken.label}
                      className="w-4 h-4 "
                    />
                  </div>
                  {sellToken.label.toUpperCase()}
                </>
              ) : (
                <>
                  <div className="bg-white rounded-full p-1">
                    <img
                      src={sellToken.src}
                      alt={sellToken.label}
                      className="w-4 h-4 "
                    />
                  </div>
                  Select
                </>
              )}
              <ChevronDownIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Buy Section */}
        <div className="absolute shadow-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-full h-10 w-10 flex items-center justify-center">
          <ArrowsUpDownIcon className="w-6 h-6" />
        </div>
        <div className="w-full h-[120px] rounded-[10px] p-4 border-white/20 border-[1px] bg-white/20 backdrop-blur-md">
          <div className="flex w-full h-full justify-between items-center gap-4">
            <Input
              type="text"
              variant="standard"
              color="white"
              label="Buy"
              className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={buyAmount.slice(0, 5)}
              readOnly
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
            />
            <button
              className="backdrop-blur-md bg-gray-200/30 rounded-full p-2 w-[180px] text-white flex items-center justify-between gap-2 text-sm"
              onClick={() => setOpenBuyDialog(true)}
            >
              {buyToken.address ? (
                <>
                  <div className="bg-white rounded-full p-1">
                    <img
                      src={buyToken.src}
                      alt={buyToken.label}
                      className="w-4 h-4 "
                    />
                  </div>
                  {buyToken.label.toUpperCase()}
                </>
              ) : (
                <>
                  <div className="bg-white rounded-full p-1">
                    <img
                      src={buyToken.src}
                      alt={buyToken.label}
                      className="w-4 h-4 "
                    />
                  </div>
                  Select
                </>
              )}
              <ChevronDownIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <button
        className="backdrop-blur-md bg-white/40 rounded-md px-[20px] py-[10px] w-[200px] text-white"
        onClick={handleSwap}
      >
        {isLoading ? <BeatLoader size={5} color="white" /> : "SWAP"}
      </button>

      {openSellDialog && (
        <TokenSelectDialog
          onSelect={(token) => setSellToken(token)}
          open={openSellDialog}
          setOpen={setOpenSellDialog}
        />
      )}
      {openBuyDialog && (
        <TokenSelectDialog
          onSelect={(token) => setBuyToken(token)}
          open={openBuyDialog}
          setOpen={setOpenBuyDialog}
        />
      )}
    </div>
  );
};

export default SwapModal;