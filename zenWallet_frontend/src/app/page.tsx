"use client";
import {
  ConnectButton,
  lightTheme,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { useRouter } from "next/navigation";
import { client } from "@/lib/client";

export default function Home() {
  const status = useActiveWalletConnectionStatus();
  const router = useRouter();
  return (
    <main>
      <div className="min-h-[calc(100vh_-_228px)] w-full flex p-10 justify-center items-center align-center">
        <div className="absolute left-[10px] bottom-[50px]">
          <img src="/landing3.png" alt="landing3" className=" object-cover" />
        </div>
        <div className="absolute right-[170px] top-[50px]">
          <img src="/landing1.png" alt="landing1" className=" object-cover" />
        </div>
        <div className="absolute right-[10px] bottom-[50px]">
          <img src="/landing2.png" alt="landing2" className=" object-cover" />
        </div>
        <div className="absolute w-[500px] flex justify-center items-center bottom-[130px] text-white/70 uppercase text-md ">
          Experience the Future of DeFi: Zen Wallet, Powered by ZenRock
          Protocol, Enables Cross-Chain Transactions with Full Support for Aave
          and Uniswap — Your Gateway to Secure and Efficient Crypto Management
        </div>
        <div className="absolute w-[500px] flex justify-center items-center top-[180px]   text-white uppercase text-5xl font-bold ">
          ZEN Wallet
        </div>

        {status === "connected" ? (
          <button
            className="backdrop-blur-md rounded-md px-[20px] py-[10px] w-[200px] text-white"
            onClick={() => router.push("/wallet")}
          >
            Connect Wallet
          </button>
        ) : (
          <ConnectButton
            client={client}
            theme={lightTheme({
              colors: {
                primaryButtonBg: "#ffffff",
                primaryButtonText: "#000000",
              },
            })}
            connectModal={{ size: "wide" }}
          />
        )}
      </div>
    </main>
  );
}
