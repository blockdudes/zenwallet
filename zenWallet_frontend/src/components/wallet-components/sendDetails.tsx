"use client";
import {
  Input,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaEthereum } from "react-icons/fa";
import { SiJsonwebtokens } from "react-icons/si";
import { BeatLoader } from "react-spinners";
import { useActiveAccount } from "thirdweb/react";

const SendDetailsTabs = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isEth, setIsEth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const activeAccount = useActiveAccount();

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

  async function handleSend() {
    setIsLoading(true);
    // Store transaction data in local storage
    const transactionData = {
      TYPE: "send",
      AMOUNT: amount,
      TOKEN_ADDRESS: tokenAddress,
      SENDER_ADDRESS: activeAccount?.address,
      RECEIVER_ADDRESS: recipientAddress,
    };
    storeTransaction(transactionData);

    toast.promise(
      new Promise<void>((resolve, reject) => {
        console.log(isLoading);
        setTimeout(() => {
          setIsLoading(false);
          resolve();
          setRecipientAddress("");
          setTokenAddress("");
          setAmount("");
        }, 3000);
      }),
      {
        loading: "Sending...",
        success: <b>Transaction sent!</b>,
        error: <b>Could not send transaction.</b>,
      }
    );
    console.log({
      tokenAddress: isEth
        ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        : tokenAddress,
      recipientAddress,
      amount,
      isEth,
    });
  }

  const handleTokenAddressChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTokenAddress(e.target.value);
  const handleRecipientAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setRecipientAddress(e.target.value);
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAmount(e.target.value);

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="flex flex-col gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg min-w-[364px] min-h-[300px] justify-between items-center">
        <Tabs value="erc20" className="w-full">
          <TabsHeader
            className="bg-transparent"
            indicatorProps={{
              className: "bg-white/30 backdrop-blur-sm shadow-none !text-white",
            }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Tab
              value="erc20"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onClick={() => setIsEth(false)}
            >
              <div className="flex items-center gap-2">
                <SiJsonwebtokens />
                <span>ERC20</span>
              </div>
            </Tab>
            <Tab
              value="ethereum"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onClick={() => setIsEth(true)}
            >
              <div className="flex items-center gap-2">
                <FaEthereum />
                <span>ETH</span>
              </div>
            </Tab>
          </TabsHeader>
          <TabsBody
            animate={{
              initial: { y: 400 }, // Position before the animation starts
              mount: { y: 0 }, // End position when the tab is active
              unmount: { y: 400 }, // Position when the tab becomes inactive
            }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <TabPanel value="erc20">
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  variant="outlined"
                  color="white"
                  label="Token Address"
                  className="w-full"
                  value={tokenAddress}
                  onChange={handleTokenAddressChange}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                />
                <Input
                  type="text"
                  variant="outlined"
                  color="white"
                  label="Recipient Address"
                  className="w-full"
                  value={recipientAddress}
                  onChange={handleRecipientAddressChange}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                />
                <Input
                  type="text"
                  variant="outlined"
                  color="white"
                  label="Amount"
                  className="w-full"
                  value={amount}
                  onChange={handleAmountChange}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                />
              </div>
            </TabPanel>
            <TabPanel value="ethereum">
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  variant="outlined"
                  color="white"
                  label="Recipient Address"
                  className="w-full"
                  value={recipientAddress}
                  onChange={handleRecipientAddressChange}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                />
                <Input
                  type="text"
                  variant="outlined"
                  color="white"
                  label="Amount"
                  className="w-full"
                  value={amount}
                  onChange={handleAmountChange}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                />
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
        <button
          className="w-1/2 bg-white/10 backdrop-blur-sm rounded-lg p-2"
          onClick={handleSend}
        >
          <div className="flex items-center justify-center h-[20px] text-white">
            {isLoading ? <BeatLoader size={5} color="white" /> : "SEND"}
          </div>
        </button>
      </div>
    </div>
  );
};

export default SendDetailsTabs;
