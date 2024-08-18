'use client';
import SwapModal from "@/components/swap-components/swapModal";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useActiveAccount } from "thirdweb/react";
import { providerAmoy, providerSepolia, usdcAddress, usdtAddress } from "@/lib/utils/helper";



const tokenABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

const SwapPage = () => {
  const [usdcBalanceAmoy, setUsdcBalanceAmoy] = useState("0");
  const [usdcBalanceSepolia, setUsdcBalanceSepolia] = useState("0");
  const [usdtBalanceAmoy, setUsdtBalanceAmoy] = useState("0");
  const [usdtBalanceSepolia, setUsdtBalanceSepolia] = useState("0");

  const userAddress =  useActiveAccount();
  console.log('userAddress',userAddress)

  useEffect(() => {
    if (!userAddress) return;

    const getBalances = async () => {
      const usdcContractAmoy = new ethers.Contract(usdcAddress, tokenABI, providerAmoy);
      const usdcContractSepolia = new ethers.Contract(usdcAddress, tokenABI, providerSepolia);
      const usdtContractAmoy = new ethers.Contract(usdtAddress, tokenABI, providerAmoy);
      const usdtContractSepolia = new ethers.Contract(usdtAddress, tokenABI, providerSepolia);

      const [usdcBalanceAmoy, usdcBalanceSepolia, usdtBalanceAmoy, usdtBalanceSepolia] = await Promise.all([
        usdcContractAmoy.balanceOf(userAddress.address),
        usdcContractSepolia.balanceOf(userAddress.address),
        usdtContractAmoy.balanceOf(userAddress.address),
        usdtContractSepolia.balanceOf(userAddress.address)
      ]);

      setUsdcBalanceAmoy(ethers.utils.formatUnits(usdcBalanceAmoy, 6));
      setUsdcBalanceSepolia(ethers.utils.formatUnits(usdcBalanceSepolia, 6));
      setUsdtBalanceAmoy(ethers.utils.formatUnits(usdtBalanceAmoy, 6));
      setUsdtBalanceSepolia(ethers.utils.formatUnits(usdtBalanceSepolia, 6));
    };

    getBalances();
  }, [userAddress]);

  return (
    <div className="min-h-[calc(100vh_-_228px)] w-full flex p-10 justify-between items-center align-middle gap-36">
    <div className="absolute bottom-0 top-0 left-0 right-0 my-auto mx-auto">
      <img src="/hero.png" alt="swapHero" className="w-[480px] h-[380px] object-cover" />
    </div>
    <div className="flex justify-center items-end flex-col gap-4 w-full min-h-full p-4">
      <span className="text-white/70 font-semibold">Balance</span>
      <p className="text-white text-sm">
        USDC Balance on Amoy: <span className="font-medium">{usdcBalanceAmoy}</span>
      </p>
      <p className="text-white text-sm">
        USDC Balance on Sepolia: <span className="font-medium">{usdcBalanceSepolia}</span>
      </p>
      <p className="text-white text-sm">
        USDT Balance on Amoy: <span className="font-medium">{usdtBalanceAmoy}</span>
      </p>
      <p className="text-white text-sm">
        USDT Balance on Sepolia: <span className="font-medium">{usdtBalanceSepolia}</span>
      </p>
    </div>
    <div className="flex justify-center items-center flex-col gap-4 w-full h-full">
      <SwapModal />
    </div>
  </div>
  );
};

export default SwapPage;