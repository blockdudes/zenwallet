"use client";

import { client } from "@/lib/client";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ConnectButton } from "thirdweb/react";
import { useActiveWalletConnectionStatus } from "thirdweb/react";

import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { getUserData } from "@/lib/features/getUserDataSlice";


export default function Home() {
  const status = useActiveWalletConnectionStatus();


  useEffect(() => {
    console.log(status);
  }, [status]);




  return (
    <main>
      <button
        className="bg-[url('/glass.svg')] bg-cover bg-center bg-no-repeat rounded-md px-[20px] py-[10px] text-white "
        onClick={async () =>
          toast.promise(
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve();
              }, 2000);
            }),
            {
              loading: "Saving...",
              success: <b>Settings saved!</b>,
              error: <b>Could not save.</b>,
            }
          )
        }
      >
        click
      </button>
    </main>
  );
}
