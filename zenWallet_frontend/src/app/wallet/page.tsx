"use client";
import RecieveDetails from "@/components/wallet-components/recieveDetails";
import SendDetails from "@/components/wallet-components/sendDetails";
import React from "react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { getUserData } from "@/lib/features/getUserDataSlice";

import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { polygonAmoy, sepolia } from "thirdweb/chains";
import { client } from "@/lib/client";
import { Tooltip, Button } from "@material-tailwind/react";

const WalletPage = () => {
  const [receive, setReceive] = useState(false);

  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.getUserData);
  console.log(userData);

  const account = useActiveAccount();

  const userPolygonBalance = useWalletBalance({
    chain: polygonAmoy,
    address: account && account?.address,
    client: client
  });

  const userSepoliaBalance = useWalletBalance({
    chain: sepolia,
    address: account && account?.address,
    client: client
  });

  console.log(userPolygonBalance.data?.displayValue, userSepoliaBalance.data?.displayValue);

  useEffect(() => {
    console.log("USER");
    dispatch(getUserData("0x44EEA30C2C35B10E7858C44787df948b0aaA7c2E"));
  }, [])

  return (
    <div className="min-h-[calc(100vh_-_228px)] w-full flex p-10 justify-between items-center align-middle">
      <div className="absolute bottom-12 left-0">
        <img
          src="/swapHero.png"
          alt="walletHero"
          className="w-[400px] h-[400px] object-cover"
        />
      </div>
      <div className="absolute top-[150px] left-[370px] flex justify-center align-middle items-start flex-col ">
        <span className="text-white/50">Balance</span>
        <span className=" text-[12px] text-white">{polygonAmoy.name}: {userPolygonBalance.data?.displayValue.slice(0, 5)} {userPolygonBalance.data?.symbol}</span>
        <span className=" text-[12px] text-white">{sepolia.name}: {userSepoliaBalance.data?.displayValue.slice(0, 5)} {userSepoliaBalance.data?.symbol}</span>
      </div>
      <div className="flex justify-center items-end flex-col gap-4 w-full min-h-full p-2">
        <button
          className={`backdrop-blur-md rounded-md px-[20px] py-[10px] w-[200px] text-white ${receive ? "bg-white/10" : "bg-white/30 shadow-sm"
            }`}
          onClick={() => setReceive(false)}
        >
          Send
        </button>
        <button
          className={`backdrop-blur-md rounded-md px-[20px] py-[10px] w-[200px] text-white ${receive ? "bg-white/30 shadow-sm" : "bg-white/10"
            }`}
          onClick={() => setReceive(true)}
        >
          Receive
        </button>
      </div>
      <div className="flex justify-center items-center flex-col gap-4 w-full h-full">
        {receive ? <RecieveDetails /> : <SendDetails />}
      </div>
    </div>
  );
};

export default WalletPage;
