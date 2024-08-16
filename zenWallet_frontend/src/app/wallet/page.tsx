"use client";
import RecieveDetails from "@/components/wallet-components/recieveDetails";
import SendDetails from "@/components/wallet-components/sendDetails";
import React from "react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { getUserData } from "@/lib/features/getUserDataSlice";

const WalletPage = () => {
  const [receive, setReceive] = useState(false);

  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.getUserData);
  console.log(userData);

  useEffect(() => {
    console.log("USER");
    dispatch(getUserData("0x44EEA30C2C35B10E7858C44787df948b0aaA7c2E"));
  }, [])

  return (
    <div className="min-h-[calc(100vh_-_228px)] w-full flex p-10 justify-between items-center align-middle">
      <div className="absolute top-[100px] left-[220px] flex justify-center align-middle items-start flex-col ">
        <span className="text-white/50">Balance</span>
        <span className=" text-2xl text-white">29292</span>
      </div>
      <div className="flex justify-center items-center flex-col gap-4 w-full min-h-full">
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
