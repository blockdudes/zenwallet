"use client";
import {
  Input,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Select,
  Option,
} from "@material-tailwind/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaEthereum } from "react-icons/fa";
import { SiJsonwebtokens } from "react-icons/si";
import { BeatLoader } from "react-spinners";
import { useActiveAccount } from "thirdweb/react";
import { polygonAmoy, sepolia } from "thirdweb/chains";
import { getContract, prepareContractCall, PreparedTransaction, readContract } from "thirdweb";
import { client } from "@/lib/client";
import { zenContractABI } from "@/abis/zenContractABI";
import { getNonce } from "thirdweb/extensions/farcaster"
import { ethers } from "ethers";
import { sendAndConfirmTransaction } from "thirdweb";
import { tokenContractABI } from "@/abis/tokenContractABI"
import { providerSepolia, providerAmoy } from "@/lib/utils/helper";
import { zwalletAddress } from "@/lib/utils/helper";



const getChainNonce = async (chainId: number, address: string) : Promise<bigint>=>  {
  if (chainId === sepolia.id) {
    const sepoliaNonce = await providerSepolia.getTransactionCount(address);
    return BigInt(sepoliaNonce)
  } else if (chainId === polygonAmoy.id) {
    const polygonNonce = await providerAmoy.getTransactionCount(address);
    return BigInt(polygonNonce)
  } else {
    throw new Error("Unsupported chain ID");
  }
}

const SendDetailsTabs = () => {

  const [tokenAddress, setTokenAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isEth, setIsEth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const activeAccount = useActiveAccount();

  const [selectedChain, setSelectedChain] = useState<typeof sepolia | typeof polygonAmoy>(sepolia);

  const handleChainChange = (value: string | undefined) => {
    setSelectedChain(value === "polygon" ? polygonAmoy : sepolia);
  };

  const storeTransaction = (transactionData: any) => {
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

  async function handleSend(type: string) {
    setIsLoading(true);
  
    try {
      let transactionPromise: Promise<any>;

      if (type === "NATIVE") {
        transactionPromise = handleSendETH();
      } else if (type === "TOKEN") {
        transactionPromise = handleSendERC20();
      } else {
        throw new Error("Invalid transaction type");
      }

      const result = await transactionPromise;
      
      if (!result) {
        throw new Error('Transaction rejected or failed');
      }

      toast.success('Transaction sent!');
      if (result) {
        const transactionData = {
          TYPE: "send",
          AMOUNT: amount,
          TOKEN_ADDRESS: tokenAddress,
          SENDER_ADDRESS: activeAccount?.address,
          RECEIVER_ADDRESS: recipientAddress,
        };
        storeTransaction(transactionData);
        setRecipientAddress("");
        setTokenAddress("");
        setAmount("");
      }
    } catch (error: any) {
      toast.error(error.message || 'Could not send transaction.');

    } finally {
      setIsLoading(false);
    }
  }

  const handleTokenAddressChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTokenAddress(e.target.value);
  const handleRecipientAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setRecipientAddress(e.target.value);
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAmount(e.target.value);


  const nativeChainConfig = {
    [sepolia.id]: {
      gasPrice: BigInt(50000000000),
      gasLimit: BigInt(30000),
      value: 0.005
    },
    [polygonAmoy.id]: {
      gasPrice: BigInt(31000000000),
      gasLimit: BigInt(25000),
      value: 0.001
    }
  };

  const eRC20ChainConfig = {
    [sepolia.id]: {
      gasPrice: BigInt(50000000000),
      gasLimit: BigInt(80000),
      value: BigInt(ethers.utils.parseEther("0.005").toString())
    },
    [polygonAmoy.id]: {
      gasPrice: BigInt(31000000000),
      gasLimit: BigInt(80000),
      value: BigInt(ethers.utils.parseEther("0.001").toString())
    }
  };


  const handleSendERC20 = async () => {
    try {

      if (tokenAddress && recipientAddress && amount) {
        const erc20Contract = getContract({
          address: tokenAddress,
          abi: tokenContractABI.abi as any,
          client: client,
          chain: polygonAmoy
        });

        const contract = getContract({
          address: zwalletAddress,
          abi: zenContractABI as any,
          client: client,
          chain: polygonAmoy
        });

        const [addr, decimals] = await Promise.all([
          readContract({
            contract: contract,
            method: "getWallet",
            params: []
          }),
          readContract({
            contract: erc20Contract,
            method: "decimals",
            params: []
          })
        ])

        // if (selectedChain.id === sepolia.id) {
        //   extraTransaction = prepareContractCall({
        //     contract: erc20Contract,
        //     method: "function transfer(address to, uint256 value)",
        //     params: ["0xc131F61467B4Ee837C2756bDBcd8F9900c3C1620", BigInt(ethers.utils.parseUnits(amount, decimals).toString())],
        //     gas: BigInt(10000000) 
        //     // add mpc address
        //   });
        // }
        //  else if (selectedChain.id === polygonAmoy.id) {
        //   extraTransaction = prepareContractCall({
        //     contract: erc20Contract,
        //     method: "function approve(address spender, uint256 value)",
        //     params: ["0xCc36eA2d9a5fB00b2E5eE9eddBe862deEEDF44a8", BigInt(ethers.utils.parseUnits(amount, decimals).toString())],
        //     gas: BigInt(10000000)
        //   });
        // }

        let extraTransaction: PreparedTransaction<any> | null  = prepareContractCall({
          contract: erc20Contract,
          method: "function approve(address spender, uint256 value)",
          params: [zwalletAddress, BigInt(ethers.utils.parseUnits(amount, decimals).toString())],
          gas: BigInt(10000000)
        });

        const extraTransactionResult = activeAccount && await sendAndConfirmTransaction({
          account: activeAccount,
          transaction: extraTransaction as PreparedTransaction<any>
        })

        if (extraTransactionResult) {
          if (extraTransactionResult.status === "success") {

            const nonce  = await getChainNonce(selectedChain.id, (addr as any).walletAddress.toString());
            console.log(nonce)

            const transaction = prepareContractCall({
              contract: contract,
              method: "function sendToken(uint256 chainId, uint256 nonce, address to, address token, uint256 value, uint256 gasPrice, uint256 gasLimit) public payable",
              params: [BigInt(selectedChain.id), nonce, recipientAddress, tokenAddress, BigInt(ethers.utils.parseUnits(amount, decimals).toString()), eRC20ChainConfig[selectedChain.id].gasPrice, eRC20ChainConfig[selectedChain.id].gasLimit],
              value: eRC20ChainConfig[selectedChain.id].value,
              gas: BigInt(10000000)
            });

            const result = activeAccount && await sendAndConfirmTransaction({
              account: activeAccount,
              transaction: transaction
            })

            console.log(result)

            if (result) {
              if (result.status === "success") {
                return true
              } else {
                return false
              }
            } else {
              return false
            }
          } else {
            return false
          }
        } else {
          return false
        }
      } else {
        toast.error("All Fields Required!");
      }
    } catch (error) {
      console.log(error)
      return false;
    }
  }

  const handleSendETH = async () => {
    try {
      if (recipientAddress && amount) {

        const contract = getContract({
          address: zwalletAddress,
          abi: zenContractABI as any,
          client: client,
          chain: polygonAmoy
        });

        const addr = await readContract({
          contract: contract,
          method: "getWallet",
          params: []
        });

        const nonce  = await getChainNonce(selectedChain.id, (addr as any).walletAddress.toString());

        const transaction = prepareContractCall({
          contract: contract,
          method: "function send(uint256 chainId, bytes memory data, uint256 nonce, address to, uint256 value, uint256 gasPrice, uint256 gasLimit) public payable",
          params: [BigInt(selectedChain.id), "0x", nonce, recipientAddress, BigInt(ethers.utils.parseEther(amount).toString()), nativeChainConfig[selectedChain.id].gasPrice, eRC20ChainConfig[selectedChain.id].gasLimit],
          // value: BigInt(ethers.utils.parseEther(Number(nativeChainConfig[selectedChain.id].value ).toString()).toString()),
          value: BigInt(ethers.utils.parseEther((Number(amount) + nativeChainConfig[selectedChain.id].value).toString()).toString()),
          gas: BigInt(10000000)
        });
   
           const result = activeAccount && await sendAndConfirmTransaction({
            account: activeAccount,
            transaction: transaction
          })

        if (result) {
          if (result.status === "success") {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      } else {
        toast.error("All Fields Required!");
      }
    } catch (error) {
      console.log(error);
      return false
    }
  }

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
                <Select
                  label="Select Chain"
                  value={selectedChain === polygonAmoy ? "polygon" : "sepolia"}
                  onChange={handleChainChange}
                  color="gray"
                  // colors="white"
                  className="w-full text-white"
                  placeholder="Choose a chain"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <Option value="polygon">Polygon</Option>
                  <Option value="sepolia">Sepolia</Option>
                  {/* Add more chains as needed */}
                </Select>
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
              <div className="flex gap-2 items-center justify-center">
                <button
                  className="w-1/2 bg-white/10 backdrop-blur-sm rounded-lg p-2 my-4"
                  onClick={() => handleSend("TOKEN")}
                >
                  <div className="flex items-center justify-center h-[20px] text-white">
                    {isLoading ? <BeatLoader size={5} color="white" /> : "SEND"}
                  </div>
                </button>
              </div>


            </TabPanel>
            <TabPanel value="ethereum">
              <div className="flex flex-col gap-2">
                <Select
                  label="Select Chain"
                  value={selectedChain === polygonAmoy ? "polygon" : "sepolia"}
                  onChange={handleChainChange}
                  color="gray"
                  // colors="white"
                  className="w-full text-white"
                  placeholder="Choose a chain"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <Option value="polygon">Polygon</Option>
                  <Option value="sepolia">Sepolia</Option>
                  {/* Add more chains as needed */}
                </Select>
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

              <div className="flex gap-2 items-center justify-center">
                <button
                  className="w-1/2 bg-white/10 backdrop-blur-sm rounded-lg p-2 my-4"
                  onClick={() => handleSend("NATIVE")}
                >
                  <div className="flex items-center justify-center h-[20px] text-white">
                    {isLoading ? <BeatLoader size={5} color="white" /> : "SEND"}
                  </div>
                </button>
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
        {/* <button
          className="w-1/2 bg-white/10 backdrop-blur-sm rounded-lg p-2"
          onClick={handleSend}
        >
          <div className="flex items-center justify-center h-[20px] text-white">
            {isLoading ? <BeatLoader size={5} color="white" /> : "SEND"}
          </div>
        </button> */}
      </div>
    </div>
  );
};

export default SendDetailsTabs;
export { getChainNonce }
