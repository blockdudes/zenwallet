"use client";
import React, { useState } from "react";
import { UserBorrowedDialog } from "./userBorrowedDialog";

import {
  getContract,
  readContract,
  prepareContractCall,
  sendAndConfirmTransaction,
} from "thirdweb";
import { client } from "../../lib/client";
import { sepolia } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";

import { zenContractABI } from "../../abis/zenContractABI";
import { ethers } from "ethers";

const ASSETS = [
  {
    name: "Ethereum",
    amount: 5,
    address: "0x213243wqdsfrwqe1r32efdvwcsaxdewr",
  },
  {
    name: "Cardano",
    amount: 1000,
    address: "0x213243wqdsfrwqe1r32efdvwcsaxdewr",
  },
];

const UserBorrowed = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const activeAccount = useActiveAccount();

  const handleBorrowClick = (asset: any) => {
    setSelectedAsset(asset);
    setDialogOpen(true);
  };

  const readRContract = async () => {
    try {
      if (activeAccount) {
        const Gcontract = getContract({
          address: "0x07BDb8D33CBD393311C0df5fC8d4e1F1717CdF7B",
          abi: zenContractABI as any,
          client: client,
          chain: sepolia,
        });

        console.log(Gcontract);

        const read = await readContract({
          contract: Gcontract,
          method:
            "function getWallet(address signer) public view returns (Wallet memory)",
          params: [activeAccount?.address],
        });

        console.log(read);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const writeContract = async () => {
    try {
      if (activeAccount) {
        const Gcontract = getContract({
          address: "0x07BDb8D33CBD393311C0df5fC8d4e1F1717CdF7B",
          abi: zenContractABI as any,
          client: client,
          chain: sepolia,
        });

        const transaction = await prepareContractCall({
          contract: Gcontract,
          method: "requestNewEVMWallet",
          params: [],
          value: BigInt(ethers.utils.parseEther("1").toString()),
          gas: BigInt(100000),
        });

        const result = await sendAndConfirmTransaction({
          transaction: transaction,
          account: activeAccount,
        });

        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-1">
      <button onClick={readRContract}>TTTt</button>
      <div className="text-white bg-white/10 hover:bg-white/20 rounded-md px-5 py-1 backdrop-blur-sm ">ASSETS YOU BORROWED</div>
      <div className="relative">
        <div className="text-sm text-left text-gray-300">
          {/* Static header */}
          <div className="text-xs uppercase bg-white/20 top-0 z-10 rounded-t-lg backdrop-blur-md">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="py-4 px-6 justify-center">Asset</th>
                  <th className="py-4 px-6 justify-center">Borrowed Amount</th>
                  <th className="py-4 px-6 justify-center">Actions</th>
                </tr>
              </thead>
            </table>
          </div>
          {/* Scrollable body */}
          <div className="overflow-auto rounded-b-lg bg-white/10 backdrop-blur-md">
            <table className="w-full">
              <tbody className="bg-transparent">
                {ASSETS.map((asset, index) => (
                  <tr key={index}>
                    <td className="py-4 px-6 text-white justify-center">
                      {asset.name}
                    </td>
                    <td className="py-4 px-6 text-white justify-center">
                      {asset.amount}
                    </td>
                    <td className="py-4 px-6 flex justify-center">
                      <button
                        className="text-sm bg-white/10 hover:bg-white/20 rounded-md px-5 py-1 backdrop-blur-sm text-black"
                        onClick={() => handleBorrowClick(asset)}
                      >
                        Repay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {dialogOpen && selectedAsset && (
        <UserBorrowedDialog
          asset={selectedAsset}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default UserBorrowed;
