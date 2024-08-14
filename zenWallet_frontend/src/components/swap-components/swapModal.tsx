"use client";
import React, { useState } from "react";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Input } from "@material-tailwind/react";
import { TokenSelectDialog } from "./tokenSelectDialog"; // Import the TokenSelectDialog component
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { useActiveAccount } from "thirdweb/react";

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
  function handleSellAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const sellValue = e.target.value;
    setSellAmount(sellValue);
    const calculatedBuyAmount = sellValue ? (parseFloat(sellValue) * 5).toString() : "";
    setBuyAmount(calculatedBuyAmount);
  }

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

  return (
    <div className="flex flex-col justify-center items-center h-full w-full gap-4 bg-gray-500/10 backdrop-blur-md p-2 rounded-lg">
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
              type="number"
              variant="standard"
              color="white"
              label="Buy"
              className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={buyAmount}
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